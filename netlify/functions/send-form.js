/**
 * Contact + newsletter email delivery.
 *
 * Configure ONE of these in Netlify → Site configuration → Environment variables:
 *   WEB3FORMS_ACCESS_KEY  — from https://web3forms.com (verify nutrithrive0@gmail.com)
 *   SMTP_USER + SMTP_PASS — Gmail app password for nutrithrive0@gmail.com
 *
 * Optional: FORM_EMAIL_TO (defaults to nutrithrive0@gmail.com)
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 15;
const requestBuckets = new Map();

const ALLOWED_ORIGINS = new Set([
    "https://nutrithrive.com.au",
    "https://www.nutrithrive.com.au",
]);

function getHeader(event, key) {
    const headers = event?.headers || {};
    if (headers[key] !== undefined) return headers[key];
    const lower = key.toLowerCase();
    const found = Object.keys(headers).find((name) => name.toLowerCase() === lower);
    return found ? headers[found] : undefined;
}

function getClientIp(event) {
    const forwardedFor = String(getHeader(event, "x-forwarded-for") || "").split(",")[0].trim();
    const netlifyIp = String(getHeader(event, "x-nf-client-connection-ip") || "").trim();
    return forwardedFor || netlifyIp || "unknown";
}

function isRateLimited(key) {
    const now = Date.now();
    const bucket = requestBuckets.get(key);
    if (!bucket || now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
        requestBuckets.set(key, { count: 1, windowStart: now });
        return false;
    }
    bucket.count += 1;
    return bucket.count > RATE_LIMIT_MAX;
}

function corsHeaders(requestOrigin, baseHeaders) {
    if (requestOrigin && ALLOWED_ORIGINS.has(requestOrigin)) {
        return {
            ...baseHeaders,
            "Access-Control-Allow-Origin": requestOrigin,
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
        };
    }
    return baseHeaders;
}

function cleanText(value, maxLen = 5000) {
    return String(value ?? "")
        .replace(/[\0\r]/g, "")
        .trim()
        .slice(0, maxLen);
}

async function sendViaWeb3Forms({ accessKey, toEmail, formType, name, email, subject, message, pageUrl }) {
    const emailSubject =
        subject ||
        (formType === "newsletter"
            ? "Newsletter subscription — NutriThrive"
            : "Website contact — NutriThrive");

    const body = [
        `Type: ${formType}`,
        `Name: ${name || "(not provided)"}`,
        `Email: ${email}`,
        pageUrl ? `Page: ${pageUrl}` : "",
        "",
        message || "(newsletter signup — no message)",
    ]
        .filter(Boolean)
        .join("\n");

    const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            access_key: accessKey,
            subject: emailSubject,
            from_name: name || "NutriThrive website",
            email,
            message: body,
            to: toEmail,
        }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
        throw new Error(data.message || `Web3Forms error (${res.status})`);
    }
    return data;
}

async function sendViaSmtp({ smtpUser, smtpPass, toEmail, formType, name, email, subject, message, pageUrl }) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE !== "false",
        auth: { user: smtpUser, pass: smtpPass },
    });

    const emailSubject =
        subject ||
        (formType === "newsletter"
            ? "Newsletter subscription — NutriThrive"
            : "Website contact — NutriThrive");

    const text = [
        `Type: ${formType}`,
        `Name: ${name || "(not provided)"}`,
        `Email: ${email}`,
        pageUrl ? `Page: ${pageUrl}` : "",
        "",
        message || "(newsletter signup — no message)",
    ]
        .filter(Boolean)
        .join("\n");

    await transporter.sendMail({
        from: `"NutriThrive Website" <${smtpUser}>`,
        to: toEmail,
        replyTo: email,
        subject: emailSubject,
        text,
    });
}

export async function handler(event) {
    const requestOrigin = String(getHeader(event, "origin") || "");
    const baseHeaders = {
        "Content-Type": "application/json",
        Vary: "Origin",
    };

    const headers = corsHeaders(requestOrigin, baseHeaders);

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (!requestOrigin || !ALLOWED_ORIGINS.has(requestOrigin)) {
        return {
            statusCode: 403,
            headers: baseHeaders,
            body: JSON.stringify({ error: "Origin not allowed" }),
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const clientIp = getClientIp(event);
        if (isRateLimited(`send-form:${clientIp}`)) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ error: "Too many requests" }),
            };
        }

        const payload = JSON.parse(event.body || "{}");
        const formType = cleanText(payload.formType, 32) || "contact";
        const name = cleanText(payload.name, 200);
        const email = cleanText(payload.email, 320);
        const subject = cleanText(payload.subject, 300);
        const message = cleanText(payload.message, 8000);
        const pageUrl = cleanText(payload.pageUrl, 500);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Valid email is required" }),
            };
        }

        if (formType === "contact" && !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Message is required" }),
            };
        }

        const toEmail = process.env.FORM_EMAIL_TO || "nutrithrive0@gmail.com";
        const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        const mailPayload = { toEmail, formType, name, email, subject, message, pageUrl };

        if (web3Key) {
            await sendViaWeb3Forms({ accessKey: web3Key, ...mailPayload });
        } else if (smtpUser && smtpPass) {
            await sendViaSmtp({ smtpUser, smtpPass, ...mailPayload });
        } else {
            return {
                statusCode: 503,
                headers,
                body: JSON.stringify({
                    error: "Email delivery is not configured on the server",
                    hint: "Add WEB3FORMS_ACCESS_KEY or SMTP_USER + SMTP_PASS in Netlify environment variables, then redeploy.",
                    fallback: "netlify-forms",
                }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ ok: true }),
        };
    } catch (err) {
        console.error("[send-form]", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to send message",
                detail: err?.message || "Unknown error",
            }),
        };
    }
}
