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

        // Parse request body to get orderID
        const { orderID } = JSON.parse(event.body);

        if (!orderID) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "orderID is required" }),
            };
        }

        // Capture order payload
        const collect = {
            id: orderID,
            prefer: "return=minimal",
        };

        // Capture the order
        const { body, ...httpResponse } = await ordersController.captureOrder(collect);

        return {
            statusCode: httpResponse.statusCode || 200,
            headers,
            body: body,
        };
    } catch (error) {
        console.error("Failed to capture order:", error);
        
        if (error instanceof ApiError) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: "Failed to capture order",
                    details: error.message,
                    debug_id: error.debugId,
                }),
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to capture order",
                details: error.message || "Unknown error",
            }),
        };
    }
};
