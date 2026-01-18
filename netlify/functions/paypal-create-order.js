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
    const { amount, cart } = JSON.parse(event.body || "{}");

    // Use environment variables - REQUIRED (no fallbacks for security)
    // PAYPAL_BASE should be: https://api.paypal.com (LIVE) or https://api.sandbox.paypal.com (SANDBOX)
    // Note: api-m.paypal.com is for mobile SDK, NOT REST API
    let base = process.env.PAYPAL_BASE || process.env.PAYPAL_ENVIRONMENT;
    
    // Fix common mistake: api-m.paypal.com -> api.paypal.com
    if (base && base.includes('api-m.paypal.com')) {
        base = base.replace('api-m.paypal.com', 'api.paypal.com');
    }
    
    // Default to production if not set
    if (!base) {
        base = "https://api.paypal.com";
    }
    
    base = base.replace(/\/$/, "");
    const client = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;

    if (!client || !secret) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Missing PayPal environment variables. Please configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Netlify." }),
        };
    }

    // Calculate amount from cart if provided
    let orderAmount = amount || "10.00";
    if (cart && cart.length > 0) {
      orderAmount = cart.reduce((sum, item) => {
        const itemTotal = parseFloat(item.total || (parseFloat(item.unit_amount) * parseInt(item.quantity))).toFixed(2);
        return (parseFloat(sum) + parseFloat(itemTotal)).toFixed(2);
      }, "0.00");
    }

    // 1) Get access token
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

    // 2) Create order
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "AUD",
              value: String(orderAmount),
            },
          },
        ],
      }),
    });

    const order = await orderRes.json();
    if (!orderRes.ok) throw new Error(JSON.stringify(order));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: order.id }),
    };
  } catch (err) {
    console.error("Create order error:", err);
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
