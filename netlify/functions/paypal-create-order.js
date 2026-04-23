import { createHmac } from "crypto";

export async function handler(event) {
    const requestOrigin = event?.headers?.origin || event?.headers?.Origin || "";
    const allowedOrigins = new Set([
        "https://nutrithrive.com.au",
        "https://www.nutrithrive.com.au",
    ]);

    // Tighten CORS: only allow our frontend origin to call this endpoint.
    if (requestOrigin && !allowedOrigins.has(requestOrigin)) {
        return {
            statusCode: 403,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Origin not allowed" }),
        };
    }

    const headers = {
        "Access-Control-Allow-Origin": requestOrigin || "https://nutrithrive.com.au",
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
        const { countryCode, items } = payload;
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

        if (!countryCode || typeof countryCode !== "string") {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing countryCode" }),
            };
        }

        const cc = countryCode.trim().toUpperCase();

        if (!Array.isArray(items) || items.length < 1) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing items" }),
            };
        }

        // Authoritative product catalog for server-side pricing/weighting.
        // SECURITY: Do not trust client-provided prices/names/amounts.
        const PRODUCT_CATALOG = {
            "moringa-powder": { name: "100g Moringa", price: 11.00, weight: 100 },
            "moringa-200g": { name: "200g Moringa", price: 21.50, weight: 200 },
            "moringa-400g": { name: "3 + 1 = 400g Moringa", price: 35.00, weight: 400 },
            "moringa-soap": { name: "Moringa Soap", price: 7.00, weight: 95 },
            "moringa-soap-combo": { name: "Moringa 100g + Soap 95g", price: 17.00, weight: 195 },
            "curry-leaves": { name: "Dried Curry Leaves", price: 7.00, weight: 30 },
            "black-tea": { name: "Darjeeling Black Tea", price: 7.50, weight: 100 },
            "combo-pack": { name: "Premium Combo Pack", price: 17.00, weight: 130 },

            // Product page variations (cart ids are moringa-variation-1..6)
            "moringa-variation-1": { name: "3 + 1 = 400g Moringa", price: 35.00, weight: 400 },
            "moringa-variation-2": { name: "100g Moringa", price: 11.00, weight: 100 },
            "moringa-variation-3": { name: "Combo Moringa + Dried Curry Leaves", price: 17.00, weight: 130 },
            "moringa-variation-4": { name: "200g Moringa", price: 21.50, weight: 200 },
            "moringa-variation-5": { name: "30g Dried Curry Leaves", price: 7.00, weight: 30 },
            "moringa-variation-6": { name: "Moringa 100g + Soap 95g", price: 17.00, weight: 195 },
        };

        // Import shipping rates shared logic (Node-safe export).
        const shippingRatesModule = await import("../../scripts/global/shipping-rates.js");
        const ShippingRates = shippingRatesModule.default ?? shippingRatesModule;

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

        // Build purchase unit using authoritative server-side pricing + shipping.
        // SECURITY: ignore client-provided amount/subtotal/shipping/unit prices.
        if (Array.isArray(items) && items.length > 0) {
            let computedSubtotal = 0;
            const cartItemsForShipping = [];
            const paypalItems = [];

            for (const item of items) {
                const id = String(item?.id ?? "").trim();
                const quantity = parseInt(item?.quantity ?? 1, 10);
                if (!id || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) continue;

                const product = PRODUCT_CATALOG[id];
                if (!product) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: "Invalid item id" }),
                    };
                }

                computedSubtotal += product.price * quantity;
                cartItemsForShipping.push({
                    id,
                    name: product.name,
                    weight: product.weight,
                    quantity: quantity,
                });

                paypalItems.push({
                    name: String(product.name).substring(0, 127),
                    quantity: String(quantity),
                    unit_amount: {
                        currency_code: currency,
                        value: product.price.toFixed(2),
                    },
                });
            }

            computedSubtotal = Number(computedSubtotal.toFixed(2));
            if (computedSubtotal <= 0 || paypalItems.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: "Invalid cart" }),
                };
            }

            const shippingCostRaw =
                ShippingRates && typeof ShippingRates.calculate === "function"
                    ? ShippingRates.calculate(cc, cartItemsForShipping, computedSubtotal)
                    : null;
            const shippingCost = shippingCostRaw === null || shippingCostRaw === undefined ? 0 : Number(shippingCostRaw);
            const totalNum = Number((computedSubtotal + shippingCost).toFixed(2));

            purchaseUnit = {
                amount: {
                    currency_code: currency,
                    value: totalNum.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: currency,
                            value: computedSubtotal.toFixed(2),
                        },
                        ...(shippingCost > 0
                            ? {
                                  shipping: {
                                      currency_code: currency,
                                      value: shippingCost.toFixed(2),
                                  },
                              }
                            : {}),
                    },
                },
                items: paypalItems,
            };
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing items" }),
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

        const captureToken = createHmac("sha256", secret).update(String(order.id)).digest("hex");

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ orderID: order.id, captureToken }),
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
