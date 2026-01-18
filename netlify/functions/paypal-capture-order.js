export async function handler(event) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST
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

    // Use environment variables - REQUIRED (no fallbacks for security)
    // PAYPAL_BASE should be: https://api-m.paypal.com (LIVE) or https://api-m.sandbox.paypal.com (SANDBOX)
    const base = (process.env.PAYPAL_BASE || "https://api-m.paypal.com").replace(/\/$/, "");
    const client = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;

    if (!client || !secret) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Missing PayPal environment variables. Please configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Netlify." }),
        };
    }

    // Access token
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

    // Capture
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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: String(err) }),
    };
  }
}
