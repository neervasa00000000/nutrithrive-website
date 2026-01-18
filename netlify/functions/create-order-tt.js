const {
    ApiError,
    Client,
    Environment,
    LogLevel,
    OrdersController,
} = require("@paypal/paypal-server-sdk");

exports.handler = async (event, context) => {
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
        // Get PayPal credentials from environment variables
        const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "AWtclBnz1gQWQne-vS-OnExG1-Rl7Tj01nE8J1j7aZsLItOJvecwRVCpG757OrJ3QCf65w7q9i2bSgVi";
        const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "EAnPKgxB1TWM042LEvt-FmCeWZB9UqX3rSdJ0W95lU_selSN1ZFqRx69SlMBCSQOsk8fBc336C_mSICw";
        const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || "production"; // Use "sandbox" for testing

        // Initialize PayPal Client
        const client = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: PAYPAL_CLIENT_ID,
                oAuthClientSecret: PAYPAL_CLIENT_SECRET,
            },
            timeout: 0,
            environment: PAYPAL_ENVIRONMENT === "sandbox" ? Environment.Sandbox : Environment.Production,
            logging: {
                logLevel: LogLevel.Info,
            },
        });

        const ordersController = new OrdersController(client);

        // Parse request body
        const { cart } = JSON.parse(event.body);

        // Calculate order total from cart
        let totalAmount = "0.00";
        const items = [];

        if (cart && cart.length > 0) {
            cart.forEach((item) => {
                const itemTotal = parseFloat(item.total || (parseFloat(item.unit_amount) * parseInt(item.quantity))).toFixed(2);
                items.push({
                    name: item.name || "Moringa Powder",
                    description: item.description || "100% pure Moringa Oleifera leaf powder",
                    quantity: item.quantity || "1",
                    unit_amount: {
                        currency_code: "AUD",
                        value: item.unit_amount || "10.00",
                    },
                });
                totalAmount = (parseFloat(totalAmount) + parseFloat(itemTotal)).toFixed(2);
            });
        } else {
            // Default to single item if cart is empty
            totalAmount = "10.00";
            items.push({
                name: "Moringa Powder",
                description: "100% pure Moringa Oleifera leaf powder",
                quantity: "1",
                unit_amount: {
                    currency_code: "AUD",
                    value: "10.00",
                },
            });
        }

        // Create order payload
        const payload = {
            body: {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "AUD",
                            value: totalAmount,
                            breakdown: {
                                item_total: {
                                    currency_code: "AUD",
                                    value: totalAmount,
                                },
                            },
                        },
                        items: items,
                    },
                ],
            },
            prefer: "return=minimal",
        };

        // Create the order
        const { body, ...httpResponse } = await ordersController.createOrder(payload);

        return {
            statusCode: httpResponse.statusCode || 200,
            headers,
            body: body,
        };
    } catch (error) {
        console.error("Failed to create order:", error);
        
        if (error instanceof ApiError) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: "Failed to create order",
                    details: error.message,
                    debug_id: error.debugId,
                }),
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to create order",
                details: error.message || "Unknown error",
            }),
        };
    }
};
