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

    // Use environment variables or fallback to defaults
    const base = (process.env.PAYPAL_BASE || process.env.PAYPAL_ENVIRONMENT || "https://api.paypal.com").replace(/\/$/, "");
    const client = process.env.PAYPAL_CLIENT_ID || "AWtclBnz1gQWQne-vS-OnExG1-RI7Tj01nE8J1j7aZsLItOJvecwRVCpG757OrJ3QCf65w7q9i2bSgVi";
    const secret = process.env.PAYPAL_CLIENT_SECRET || "EAnPKgxB1TWM042LEvt-FmCeWZB9UqX3rSdJ0W95IU_selSN1ZFqRx69SIMBCSQOsk8fBc336C_mSICw";

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
