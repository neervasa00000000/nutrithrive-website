// Netlify Serverless Function - Create PayPal Order
// Uses PayPal Server SDK for secure server-side order creation

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
        // Check if PayPal SDK is available
        let Client, Environment, OrdersController;
        try {
            const paypalSDK = require('@paypal/paypal-server-sdk');
            Client = paypalSDK.Client;
            Environment = paypalSDK.Environment;
            OrdersController = paypalSDK.OrdersController;
        } catch (sdkError) {
            console.error('PayPal Server SDK not installed:', sdkError);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ 
                    error: 'PayPal Server SDK not installed',
                    message: 'Please install @paypal/paypal-server-sdk in netlify/functions/',
                    details: sdkError.message
                })
            };
        }
        
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
        
        // Parse request body
        const { cart, totals, shipping } = JSON.parse(event.body);
        
        // Calculate order amounts
        const subtotal = totals?.subtotal || cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = totals?.shipping || (subtotal >= 80 ? 0 : 10);
        const total = subtotal + shippingCost;
        
        // Create order items
        const items = cart.map(item => ({
            name: item.name.substring(0, 127),
            description: item.name.substring(0, 127),
            quantity: item.quantity.toString(),
            unit_amount: {
                currency_code: 'AUD',
                value: item.price.toFixed(2)
            }
        }));
        
        // Create order payload
        const payload = {
            body: {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'AUD',
                        value: total.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'AUD',
                                value: subtotal.toFixed(2)
                            },
                            shipping: {
                                currency_code: 'AUD',
                                value: shippingCost.toFixed(2)
                            }
                        }
                    },
                    items: items,
                    shipping: shipping ? {
                        name: {
                            full_name: (shipping.firstName || '') + ' ' + (shipping.lastName || '')
                        },
                        address: {
                            address_line_1: shipping.address || '',
                            address_line_2: shipping.address2 || '',
                            admin_area_2: shipping.city || '',
                            admin_area_1: shipping.state || '',
                            postal_code: shipping.postcode || '',
                            country_code: 'AU'
                        }
                    } : undefined
                }]
            },
            prefer: 'return=minimal',
        };
        
        // Create order via PayPal API
        const { body, ...httpResponse } = await ordersController.createOrder(payload);
        const orderData = JSON.parse(body);
        
        if (orderData.id) {
            return {
                statusCode: httpResponse.statusCode || 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify(orderData)
            };
        } else {
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);
            
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Failed to create order:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Failed to create order', 
                message: error.message,
                details: error.stack
            })
        };
    }
};
