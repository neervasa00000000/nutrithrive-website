/**
 * Order confirmation + owner notification emails.
 * Reuses the same SMTP / Web3Forms env vars as send-form.js.
 */

const OWNER_EMAIL = () => process.env.FORM_EMAIL_TO || "nutrithrive0@gmail.com";
const SUPPORT_PHONE = "0438 201 419";
const SUPPORT_EMAIL = "nutrithrive0@gmail.com";
const DISPATCH_NOTE =
    "Orders placed before 2:00 PM AEST (Mon–Sun) are usually dispatched the same business day from our Truganina, Melbourne warehouse. Delivery times depend on your location and Australia Post.";

function money(value, currency) {
    const n = Number.parseFloat(value);
    if (!Number.isFinite(n)) return `${currency || "AUD"} —`;
    return `${currency || "AUD"} $${n.toFixed(2)}`;
}

function cleanLine(value, maxLen = 200) {
    return String(value ?? "")
        .replace(/[\0\r]/g, "")
        .trim()
        .slice(0, maxLen);
}

function payerName(payer) {
    const given = cleanLine(payer?.name?.given_name, 80);
    const family = cleanLine(payer?.name?.surname, 80);
    return [given, family].filter(Boolean).join(" ") || "there";
}

function formatAddress(shipping) {
    const addr = shipping?.address;
    if (!addr) return null;
    const lines = [
        cleanLine(shipping?.name?.full_name, 120),
        [cleanLine(addr.address_line_1), cleanLine(addr.address_line_2)].filter(Boolean).join(", "),
        [cleanLine(addr.admin_area_2), cleanLine(addr.admin_area_1), cleanLine(addr.postal_code)]
            .filter(Boolean)
            .join(" "),
        cleanLine(addr.country_code, 8),
    ].filter(Boolean);
    return lines.length ? lines.join("\n") : null;
}

export function parseCaptureForEmail(capture, orderId) {
    const unit = capture?.purchase_units?.[0] || {};
    const paymentCapture = unit?.payments?.captures?.[0] || {};
    const amount = paymentCapture?.amount || unit?.amount || {};
    const currency = amount.currency_code || "AUD";
    const totalValue = amount.value || unit?.amount?.value || "0";
    const breakdown = unit?.amount?.breakdown || {};
    const shippingValue = breakdown?.shipping?.value;
    const itemTotalValue = breakdown?.item_total?.value;

    const items = (unit.items || []).map((item) => ({
        name: cleanLine(item.name, 127) || "NutriThrive product",
        quantity: parseInt(item.quantity, 10) || 1,
        unitPrice: item.unit_amount?.value,
        currency: item.unit_amount?.currency_code || currency,
    }));

    const payer = capture?.payer || {};
    const customerEmail = cleanLine(payer.email_address, 320);
    const customerName = payerName(payer);
    const shippingAddress = formatAddress(unit.shipping);

    return {
        orderId: cleanLine(orderId, 64),
        invoiceId: cleanLine(unit.invoice_id, 64),
        currency,
        totalValue,
        shippingValue,
        itemTotalValue,
        items,
        customerEmail,
        customerName,
        shippingAddress,
    };
}

function itemLines(items, currency) {
    if (!items.length) return "  (item details unavailable)\n";
    return items
        .map((item) => {
            const lineTotal =
                item.unitPrice != null
                    ? money(Number(item.unitPrice) * item.quantity, item.currency || currency)
                    : "";
            const pricePart = lineTotal ? ` — ${lineTotal}` : "";
            return `  • ${item.quantity}× ${item.name}${pricePart}`;
        })
        .join("\n");
}

function buildCustomerEmailBody(details) {
    const ref = details.invoiceId || details.orderId;
    const lines = [
        `Hi ${details.customerName},`,
        "",
        "Thank you for your NutriThrive order — payment is confirmed.",
        "",
        `Order reference: ${ref}`,
        `PayPal order ID: ${details.orderId}`,
        "",
        "Items:",
        itemLines(details.items, details.currency),
        "",
    ];

    if (details.itemTotalValue != null) {
        lines.push(`Subtotal: ${money(details.itemTotalValue, details.currency)}`);
    }
    if (details.shippingValue != null) {
        const ship = Number(details.shippingValue) === 0 ? "Free" : money(details.shippingValue, details.currency);
        lines.push(`Shipping: ${ship}`);
    }
    lines.push(`Total paid: ${money(details.totalValue, details.currency)}`);

    if (details.shippingAddress) {
        lines.push("", "Ship to:", details.shippingAddress);
    }

    lines.push(
        "",
        "What happens next",
        DISPATCH_NOTE,
        "",
        `Questions? Reply to this email, write ${SUPPORT_EMAIL}, or call ${SUPPORT_PHONE}.`,
        "",
        "— NutriThrive Australia",
        "15 Europe Street, Truganina VIC 3029",
        "https://nutrithrive.com.au"
    );

    return lines.join("\n");
}

function buildOwnerEmailBody(details) {
    const ref = details.invoiceId || details.orderId;
    return [
        "New paid order — NutriThrive website",
        "",
        `Order reference: ${ref}`,
        `PayPal order ID: ${details.orderId}`,
        `Customer: ${details.customerName}`,
        `Customer email: ${details.customerEmail || "(not provided by PayPal)"}`,
        "",
        "Items:",
        itemLines(details.items, details.currency),
        "",
        details.itemTotalValue != null ? `Subtotal: ${money(details.itemTotalValue, details.currency)}` : "",
        details.shippingValue != null
            ? `Shipping: ${Number(details.shippingValue) === 0 ? "Free" : money(details.shippingValue, details.currency)}`
            : "",
        `Total paid: ${money(details.totalValue, details.currency)}`,
        "",
        details.shippingAddress ? `Ship to:\n${details.shippingAddress}` : "Shipping address: (check PayPal dashboard)",
        "",
        `PayPal: https://www.paypal.com/activity/payment/${encodeURIComponent(details.orderId)}`,
    ]
        .filter(Boolean)
        .join("\n");
}

async function sendViaSmtp({ smtpUser, smtpPass, to, subject, text, replyTo }) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE !== "false",
        auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
        from: `"NutriThrive Australia" <${smtpUser}>`,
        to,
        replyTo: replyTo || smtpUser,
        subject,
        text,
    });
    return "smtp";
}

async function sendViaWeb3Forms({ accessKey, to, subject, text, fromName, replyToEmail }) {
    const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            access_key: accessKey,
            subject,
            from_name: fromName || "NutriThrive Australia",
            email: replyToEmail || OWNER_EMAIL(),
            message: text,
            to,
        }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
        throw new Error(data.message || `Web3Forms error (${res.status})`);
    }
    return "web3forms";
}

async function deliverEmail({ to, subject, text, replyTo }) {
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const attempts = [];

    if (smtpUser && smtpPass) {
        attempts.push(() => sendViaSmtp({ smtpUser, smtpPass, to, subject, text, replyTo }));
    }
    if (web3Key) {
        attempts.push(() =>
            sendViaWeb3Forms({
                accessKey: web3Key,
                to,
                subject,
                text,
                replyToEmail: replyTo || OWNER_EMAIL(),
            })
        );
    }

    let lastErr;
    for (const attempt of attempts) {
        try {
            return await attempt();
        } catch (err) {
            lastErr = err;
            console.error("[order-email] delivery attempt failed", { to, subject, error: err?.message || err });
        }
    }
    if (lastErr) throw lastErr;
    throw new Error("No email provider configured (set SMTP_USER/SMTP_PASS or WEB3FORMS_ACCESS_KEY)");
}

/**
 * Send customer confirmation + owner notification. Never throws — logs all outcomes.
 */
export async function sendOrderConfirmationEmails(capture, orderId) {
    const details = parseCaptureForEmail(capture, orderId);
    const result = {
        orderId: details.orderId,
        customerEmail: details.customerEmail || null,
        customerSent: false,
        ownerSent: false,
        customerVia: null,
        ownerVia: null,
        errors: [],
    };

    const customerSubject = `Order confirmed — NutriThrive (${details.invoiceId || details.orderId})`;
    const ownerSubject = `New order — ${details.invoiceId || details.orderId}`;

    if (details.customerEmail) {
        try {
            result.customerVia = await deliverEmail({
                to: details.customerEmail,
                subject: customerSubject,
                text: buildCustomerEmailBody(details),
                replyTo: SUPPORT_EMAIL,
            });
            result.customerSent = true;
            console.log("[order-email] customer confirmation sent", {
                orderId: details.orderId,
                to: details.customerEmail,
                via: result.customerVia,
            });
        } catch (err) {
            const message = err?.message || String(err);
            result.errors.push({ target: "customer", message });
            console.error("[order-email] customer confirmation failed", {
                orderId: details.orderId,
                to: details.customerEmail,
                error: message,
            });
        }
    } else {
        const message = "PayPal capture did not include payer email_address";
        result.errors.push({ target: "customer", message });
        console.error("[order-email] customer confirmation skipped", {
            orderId: details.orderId,
            reason: message,
        });
    }

    try {
        result.ownerVia = await deliverEmail({
            to: OWNER_EMAIL(),
            subject: ownerSubject,
            text: buildOwnerEmailBody(details),
            replyTo: details.customerEmail || SUPPORT_EMAIL,
        });
        result.ownerSent = true;
        console.log("[order-email] owner notification sent", {
            orderId: details.orderId,
            to: OWNER_EMAIL(),
            via: result.ownerVia,
        });
    } catch (err) {
        const message = err?.message || String(err);
        result.errors.push({ target: "owner", message });
        console.error("[order-email] owner notification failed", {
            orderId: details.orderId,
            to: OWNER_EMAIL(),
            error: message,
        });
    }

    return result;
}
