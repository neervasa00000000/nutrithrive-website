// Netlify Serverless Function - Capture PayPal Order
// This requires PayPal Server SDK - for now, we'll use a simpler approach

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        const { orderID } = JSON.parse(event.body);
        
        // For now, return success message
        // In production, you would call PayPal API here using your secret key
        // to capture the order server-side
        
        // Note: This is a simplified version. For production, you need:
        // 1. Install @paypal/paypal-server-sdk
        // 2. Use your PayPal Secret Key from environment variables
        // 3. Call PayPal Orders API to capture order server-side
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                message: 'Use client-side capture. Backend API requires PayPal Server SDK setup.',
                orderID: orderID,
                // Return mock success response
                id: orderID,
                status: 'COMPLETED'
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Failed to capture order', message: error.message })
        };
    }
};
