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

function payerName(payer, shipping) {
    const given = cleanLine(payer?.name?.given_name, 80);
    const family = cleanLine(payer?.name?.surname, 80);
    const fromPayer = [given, family].filter(Boolean).join(" ");
    if (fromPayer) return fromPayer;
    const fromShipping = cleanLine(shipping?.name?.full_name, 120);
    return fromShipping || "there";
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

function firstEmail(...candidates) {
    for (const value of candidates) {
        const email = cleanLine(value, 320);
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return email;
    }
    return "";
}

function paymentSourceEmail(capture) {
    const source = capture?.payment_source || {};
    return firstEmail(source.apple_pay?.email_address, source.paypal?.email_address);
}

function mergePurchaseUnit(primary = {}, fallback = {}) {
    return {
        ...fallback,
        ...primary,
        amount: primary.amount || fallback.amount,
        invoice_id: primary.invoice_id || fallback.invoice_id,
        items: Array.isArray(primary.items) && primary.items.length ? primary.items : fallback.items || [],
        shipping: primary.shipping?.address ? primary.shipping : fallback.shipping || primary.shipping,
        payments: primary.payments || fallback.payments,
    };
}

/**
 * Enrich a sparse capture payload with a full GET /orders representation.
 * Apple Pay + minimal capture responses often omit items, shipping, or payer email.
 */
export function mergeOrderDetails(capture, orderDetails) {
    if (!orderDetails || typeof orderDetails !== "object") return capture || {};
    const captureUnit = capture?.purchase_units?.[0] || {};
    const orderUnit = orderDetails?.purchase_units?.[0] || {};
    const mergedUnit = mergePurchaseUnit(captureUnit, orderUnit);
    return {
        ...orderDetails,
        ...capture,
        id: capture?.id || orderDetails?.id,
        payer: {
            ...(orderDetails.payer || {}),
            ...(capture?.payer || {}),
            email_address:
                firstEmail(capture?.payer?.email_address, orderDetails?.payer?.email_address) ||
                undefined,
            name: capture?.payer?.name || orderDetails?.payer?.name,
        },
        payment_source: capture?.payment_source || orderDetails?.payment_source,
        purchase_units: [mergedUnit],
    };
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
    const shipping = unit.shipping || {};
    const customerEmail = firstEmail(
        payer.email_address,
        shipping.email_address,
        paymentSourceEmail(capture)
    );
    const customerName = payerName(payer, shipping);
    const shippingAddress = formatAddress(shipping);
    const phone =
        cleanLine(shipping?.phone_number?.national_number, 32) ||
        cleanLine(shipping?.phone_number?.country_code, 8) ||
        cleanLine(payer?.phone?.phone_number?.national_number, 32) ||
        "";

    return {
        orderId: cleanLine(orderId || capture?.id, 64),
        invoiceId: cleanLine(unit.invoice_id, 64),
        currency,
        totalValue,
        shippingValue,
        itemTotalValue,
        items,
        customerEmail,
        customerName,
        shippingAddress,
        phone,
        hasItems: items.length > 0,
        hasShippingAddress: Boolean(shippingAddress),
    };
}

function itemLines(items, currency) {
    if (!items.length) return "  (item details unavailable — check PayPal dashboard)\n";
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
    } else {
        lines.push("", "Ship to: We could not read a shipping address from checkout — reply to this email with your full delivery address.");
    }

    if (details.phone) {
        lines.push(`Phone: ${details.phone}`);
    }

    lines.push(
        "",
        "What happens next",
        DISPATCH_NOTE,
        "",
        "After your parcel arrives:",
        "Order help: https://nutrithrive.com.au/order-help/",
        "Buy again: https://nutrithrive.com.au/reorder/",
        "",
        `Questions? Reply to this email, write ${SUPPORT_EMAIL}, or call ${SUPPORT_PHONE}.`,
        "",
        "— NutriThrive Australia",
        "Ridley Place, Truganina VIC 3029",
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
        `Customer email: ${details.customerEmail || "(not provided — check Apple Pay / PayPal dashboard)"}`,
        details.phone ? `Customer phone: ${details.phone}` : "",
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
        details.shippingAddress
            ? `Ship to:\n${details.shippingAddress}`
            : "Shipping address: MISSING — check PayPal activity / contact customer before dispatch",
        "",
        `PayPal: https://www.paypal.com/activity/payment/${encodeURIComponent(details.orderId)}`,
    ]
        .filter((line) => line !== "")
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

async function sendViaWeb3Forms({ accessKey, subject, text, fromName, replyToEmail }) {
    const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            access_key: accessKey,
            subject,
            from_name: fromName || "NutriThrive Australia",
            email: replyToEmail || OWNER_EMAIL(),
            message: text,
        }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
        throw new Error(data.message || `Web3Forms error (${res.status})`);
    }
    return "web3forms";
}

async function deliverEmail({ to, subject, text, replyTo, allowWeb3Forms = false }) {
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const attempts = [];

    if (smtpUser && smtpPass) {
        attempts.push(() => sendViaSmtp({ smtpUser, smtpPass, to, subject, text, replyTo }));
    }
    // Web3Forms sends to the inbox associated with its access key. Its "to"
    // field is ordinary form data, so it cannot deliver buyer confirmations.
    if (web3Key && allowWeb3Forms) {
        attempts.push(() =>
            sendViaWeb3Forms({
                accessKey: web3Key,
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
    throw new Error(allowWeb3Forms
        ? "No email provider configured (set SMTP_USER/SMTP_PASS or WEB3FORMS_ACCESS_KEY)"
        : "Customer email requires SMTP_USER and SMTP_PASS");
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
        hasItems: details.hasItems,
        hasShippingAddress: details.hasShippingAddress,
        errors: [],
    };

    if (!details.hasItems) {
        result.errors.push({ target: "order", message: "Capture/order missing line items" });
        console.error("[order-email] missing line items", { orderId: details.orderId });
    }
    if (!details.hasShippingAddress) {
        result.errors.push({ target: "order", message: "Capture/order missing shipping address" });
        console.error("[order-email] missing shipping address", { orderId: details.orderId });
    }

    const customerSubject = `Order confirmed — NutriThrive (${details.invoiceId || details.orderId})`;
    const ownerSubject = `New order — ${details.invoiceId || details.orderId}`;

    const deliveries = [];
    if (details.customerEmail) {
        deliveries.push((async () => {
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
        })());
    } else {
        const message = "No customer email on capture/order (Apple Pay/PayPal payer email missing)";
        result.errors.push({ target: "customer", message });
        console.error("[order-email] customer confirmation skipped", {
            orderId: details.orderId,
            reason: message,
        });
    }

    deliveries.push((async () => {
        try {
            result.ownerVia = await deliverEmail({
                to: OWNER_EMAIL(),
                subject: ownerSubject,
                text: buildOwnerEmailBody(details),
                replyTo: details.customerEmail || SUPPORT_EMAIL,
                allowWeb3Forms: true,
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
    })());
    await Promise.all(deliveries);

    return result;
}
