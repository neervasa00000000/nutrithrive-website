export async function handler(event) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
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
        const payload = JSON.parse(event.body || "{}");
        const { amount, items, subtotal, shipping } = payload;
        const base = (process.env.PAYPAL_BASE || "https://api-m.paypal.com").replace(/\/$/, "");
        const client = process.env.PAYPAL_CLIENT_ID;
        const secret = process.env.PAYPAL_CLIENT_SECRET;

        // Debug logging (remove in production if needed)
        console.log("Environment check:", {
            hasBase: !!process.env.PAYPAL_BASE,
            hasClient: !!client,
            hasSecret: !!secret,
            base: base
        });

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

        // Build purchase unit with optional item and breakdown details
        const currency = "AUD";

        let purchaseUnit;

        // If we have detailed cart info, build a rich breakdown for PayPal
        if (Array.isArray(items) && items.length > 0) {
            // Map cart items into PayPal line items
            let computedItemTotal = 0;
            const paypalItems = items.map((item) => {
                const quantity = parseInt(item.quantity || 1, 10);
                const unitPrice = parseFloat(item.unitPrice ?? item.price ?? 0);
                const safeUnitPrice = isNaN(unitPrice) ? 0 : unitPrice;
                const lineTotal = safeUnitPrice * quantity;
                computedItemTotal += lineTotal;

                return {
                    name: String(item.name || "Item").substring(0, 127),
                    quantity: String(quantity),
                    unit_amount: {
                        currency_code: currency,
                        value: safeUnitPrice.toFixed(2),
                    },
                };
            });

            // Prefer provided subtotal/shipping, but fall back to computed totals
            const subtotalNum = !isNaN(parseFloat(subtotal))
                ? parseFloat(subtotal)
                : parseFloat(computedItemTotal.toFixed(2));

            const shippingNum = !isNaN(parseFloat(shipping))
                ? parseFloat(shipping)
                : 0;

            const totalNum = subtotalNum + shippingNum;

            purchaseUnit = {
                amount: {
                    currency_code: currency,
                    value: totalNum.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: currency,
                            value: subtotalNum.toFixed(2),
                        },
                        ...(shippingNum > 0
                            ? {
                                  shipping: {
                                      currency_code: currency,
                                      value: shippingNum.toFixed(2),
                                  },
                              }
                            : {}),
                    },
                },
                items: paypalItems,
            };
        } else {
            // Fallback: simple amount-only order (previous behaviour)
            purchaseUnit = {
                amount: {
                    currency_code: currency,
                    value: String(amount ?? "10.00"),
                },
            };
        }

        // Create order with application_context to require shipping address and email
        const orderRes = await fetch(`${base}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenData.access_token}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [purchaseUnit],
                application_context: {
                    shipping_preference: "GET_FROM_FILE", // Requires buyer to provide shipping address
                    user_action: "PAY_NOW", // Shows "Pay Now" button instead of "Continue"
                    payment_method: {
                        payer_selected: "PAYPAL",
                        payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
                    }
                }
            }),
        });

        const order = await orderRes.json();
        if (!orderRes.ok) throw new Error(JSON.stringify(order));

        console.log("Order created successfully:", order.id);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ orderID: order.id }),
        };
    } catch (err) {
        console.error("Create order error:", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: String(err) }),
        };
    }
}
