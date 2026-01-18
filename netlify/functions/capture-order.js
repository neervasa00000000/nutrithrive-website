// Netlify Serverless Function - Capture PayPal Order
// Uses PayPal Server SDK for secure server-side order capture

const { Client, Environment, LogLevel, OrdersController } = require('@paypal/paypal-server-sdk');

exports.handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
            body: '',
        };
    }
    
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        // Get credentials from environment variables
        const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'AWtclBnz1gQWQne-vS-OnExG1-Rl7Tj01nE8J1j7aZsLItOJvecwRVCpG757OrJ3QCf65w7q9i2bSgVi';
        const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'EAnPKgxB1TWM042LEvt-FmCeWZB9UqX3rSdJ0W95lU_selSN1ZFqRx69SlMBCSQOsk8fBc336C_mSICw';
        const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || 'live'; // 'live' or 'sandbox'
        
        // Initialize PayPal client
        const client = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: PAYPAL_CLIENT_ID,
                oAuthClientSecret: PAYPAL_CLIENT_SECRET,
            },
            timeout: 0,
            environment: PAYPAL_ENVIRONMENT === 'live' ? Environment.Live : Environment.Sandbox,
        });
        
        const ordersController = new OrdersController(client);
        
        // Parse request body - can get orderID from body or URL
        let orderID;
        if (event.body) {
            const body = JSON.parse(event.body);
            orderID = body.orderID || event.pathParameters?.orderID;
        } else if (event.pathParameters) {
            orderID = event.pathParameters.orderID;
        }
        
        if (!orderID) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Order ID is required' })
            };
        }
        
        // Capture order
        const collect = {
            id: orderID,
            prefer: 'return=minimal',
        };
        
        const { body, ...httpResponse } = await ordersController.captureOrder(collect);
        const orderData = JSON.parse(body);
        
        return {
            statusCode: httpResponse.statusCode || 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(orderData)
        };
    } catch (error) {
        console.error('Failed to capture order:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Failed to capture order', 
                message: error.message,
                details: error.stack
            })
        };
    }
};
