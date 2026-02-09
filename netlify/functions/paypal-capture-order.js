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
        const { orderID } = JSON.parse(event.body || "{}");
        if (!orderID) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing orderID" }),
            };
        }

        const base = (process.env.PAYPAL_BASE || "https://api-m.paypal.com").replace(/\/$/, "");
        const client = process.env.PAYPAL_CLIENT_ID;
        const secret = process.env.PAYPAL_CLIENT_SECRET;

        // Debug logging
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

        // Log shipping address and email for verification
        if (capture.purchase_units && capture.purchase_units[0]) {
            const shipping = capture.purchase_units[0].shipping;
            const payer = capture.payer;
            console.log("Shipping address:", shipping);
            console.log("Payer email:", payer?.email_address);
            console.log("Payer name:", payer?.name);
        }

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
