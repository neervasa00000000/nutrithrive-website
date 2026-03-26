import { createHmac, timingSafeEqual } from "crypto";

export async function handler(event) {
    const requestOrigin = event?.headers?.origin || event?.headers?.Origin || "";
    const allowedOrigins = new Set([
        "https://nutrithrive.com.au",
        "https://www.nutrithrive.com.au",
    ]);

    // Tighten CORS: only allow our own frontend origin to call this endpoint.
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
