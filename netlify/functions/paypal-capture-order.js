import { mergeOrderDetails, parseCaptureForEmail, sendOrderConfirmationEmails } from "./order-email.js";
import { getHeader, getClientIp, isRateLimited } from "./checkout-request.js";
import { verifyCaptureToken } from "./checkout-proof.js";

function orderNeedsEnrichment(capture, orderId) {
    const details = parseCaptureForEmail(capture, orderId);
    return !details.hasItems || !details.hasShippingAddress || !details.customerEmail;
}

async function fetchOrderRepresentation(base, accessToken, orderID) {
    try {
        const res = await fetch(`${base}/v2/checkout/orders/${orderID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Prefer: "return=representation",
            },
        });
        const body = await res.json();
        if (!res.ok) {
            console.warn("[paypal-capture-order] GET order enrichment failed", body);
            return null;
        }
        return body;
    } catch (err) {
        console.warn("[paypal-capture-order] GET order enrichment unavailable", err);
        return null;
    }
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
            console.error("[paypal-capture-order] PayPal credentials not configured");
            return {
                statusCode: 503,
                headers,
                body: JSON.stringify({
                    error: "Payment is temporarily unavailable. Please try again later.",
                }),
            };
        }

        // Verify capture token to prevent capturing arbitrary PayPal orders.
        const proof = verifyCaptureToken(orderID, captureToken, secret);
        if (!proof) {
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

        // Capture order — always request full representation so emails get items/shipping.
        const capRes = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.access_token}`,
                Prefer: "return=representation",
            },
        });

        let capture = await capRes.json();
        if (!capRes.ok) throw new Error(JSON.stringify(capture));

        let notification = { customerSent: false, ownerSent: false };
        // A successful PayPal capture must never become a payment error because
        // enrichment or email delivery failed after the buyer was charged.
        try {
            // Apple Pay / minimal captures often omit line items, shipping, or payer email.
            // Pull the full order and merge so confirmation emails stay complete.
            if (orderNeedsEnrichment(capture, orderID)) {
                const orderDetails = await fetchOrderRepresentation(base, tokenData.access_token, orderID);
                if (orderDetails) {
                    capture = mergeOrderDetails(capture, orderDetails);
                }
            }

            // Apple Pay approved this address and the server used it for order creation.
            // Keep it for fulfilment even if PayPal's capture omits or replaces contact fields.
            if (proof.walletOrder) {
                const walletAddress = proof.walletOrder.purchase_units[0].shipping.address;
                const paypalAddress = capture?.purchase_units?.[0]?.shipping?.address;
                const paypalDetails = parseCaptureForEmail(capture, orderID);
                console.info("[paypal-capture-order] Apple Pay order fields returned by PayPal", {
                    orderSuffix: orderID.slice(-6),
                    hasShipping: Boolean(paypalAddress),
                    shippingMatchesWallet: Boolean(paypalAddress) &&
                        ["address_line_1", "admin_area_2", "postal_code", "country_code"]
                            .every((field) => paypalAddress[field] === walletAddress[field]),
                    hasItems: paypalDetails.hasItems,
                    hasBuyerEmail: Boolean(paypalDetails.customerEmail),
                    buyerEmailMatchesWallet: paypalDetails.customerEmail === proof.walletOrder.payer.email_address,
                });
                capture = mergeOrderDetails(capture, proof.walletOrder);
                capture.payer = {
                    ...(capture.payer || {}),
                    email_address: proof.walletOrder.payer.email_address,
                    name: {
                        given_name: proof.walletOrder.purchase_units[0].shipping.name.full_name,
                        surname: "",
                    },
                };
                capture.purchase_units[0].shipping = proof.walletOrder.purchase_units[0].shipping;
            }

            const emailResult = await sendOrderConfirmationEmails(capture, orderID);
            notification = {
                customerSent: emailResult.customerSent,
                ownerSent: emailResult.ownerSent,
            };
            if (emailResult.errors.length) {
                console.warn("[paypal-capture-order] order email partial failure", emailResult);
            }
        } catch (postCaptureError) {
            console.error("[paypal-capture-order] post-capture fulfilment failed", postCaptureError);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                ...capture,
                notification,
            }),
        };
    } catch (err) {
        console.error("[paypal-capture-order]", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Unable to complete payment. Please try again.",
            }),
        };
    }
}
