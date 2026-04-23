import { createHmac, timingSafeEqual } from "crypto";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestBuckets = new Map();

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
    const fallback = String(event?.requestContext?.identity?.sourceIp || "").trim();
    return forwardedFor || netlifyIp || fallback || "unknown";
}

function isRateLimited(key, limit = RATE_LIMIT_MAX_REQUESTS, windowMs = RATE_LIMIT_WINDOW_MS) {
    const now = Date.now();
    const bucket = requestBuckets.get(key);
    if (!bucket || now - bucket.windowStart >= windowMs) {
        requestBuckets.set(key, { count: 1, windowStart: now });
        return false;
    }
    bucket.count += 1;
    return bucket.count > limit;
}

export async function handler(event) {
    const requestOrigin = String(getHeader(event, "origin") || "");
    const allowedOrigins = new Set([
        "https://nutrithrive.com.au",
        "https://www.nutrithrive.com.au",
    ]);
    const originAllowed = requestOrigin && allowedOrigins.has(requestOrigin);
    const baseHeaders = {
        "Content-Type": "application/json",
        "Vary": "Origin",
    };

    if (!originAllowed) {
        return {
            statusCode: 403,
            headers: baseHeaders,
            body: JSON.stringify({ error: "Origin not allowed" }),
        };
    }

    const headers = {
        ...baseHeaders,
        "Access-Control-Allow-Origin": requestOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
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
        if (isRateLimited(`paypal-capture:${clientIp}`)) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ error: "Too many requests" }),
            };
        }

        const { orderID, captureToken } = JSON.parse(event.body || "{}");
        // PayPal order IDs are typically an opaque alphanumeric string (no "order-" prefix).
        const orderIdOk = typeof orderID === "string" && /^[A-Za-z0-9]{10,64}$/.test(orderID);
        if (
            !orderIdOk ||
            !captureToken ||
            typeof captureToken !== "string"
        ) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing or invalid orderID/captureToken" }),
            };
        }

        const base = (process.env.PAYPAL_BASE || "https://api-m.paypal.com").replace(/\/$/, "");
        const client = process.env.PAYPAL_CLIENT_ID;
        const secret = process.env.PAYPAL_CLIENT_SECRET;

        if (!client || !secret) {
            const missing = [];
            if (!client) missing.push("PAYPAL_CLIENT_ID");
            if (!secret) missing.push("PAYPAL_CLIENT_SECRET");
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: "Missing PayPal environment variables",
                    missing: missing,
                    hint: "Please check Netlify environment variables and redeploy"
                }),
            };
        }

        // Verify capture token to prevent capturing arbitrary PayPal orders.
        const expected = createHmac("sha256", secret).update(String(orderID)).digest();
        const provided = Buffer.from(String(captureToken), "hex");
        if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: "Invalid capture token" }),
            };
        }

        // Get access token
        const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(`${client}:${secret}`).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(JSON.stringify(tokenData));

        // Capture order
        const capRes = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenData.access_token}`,
            },
        });

        const capture = await capRes.json();
        if (!capRes.ok) throw new Error(JSON.stringify(capture));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(capture),
        };
    } catch (err) {
        console.error("Capture order error:", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: String(err) }),
        };
    }
}
