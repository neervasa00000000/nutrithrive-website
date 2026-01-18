// Netlify Serverless Function - Create PayPal Order
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
        const { cart, totals, shipping } = JSON.parse(event.body);
        
        // Calculate order total
        const subtotal = totals.subtotal || cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = totals.shipping || (subtotal >= 80 ? 0 : 10);
        const total = subtotal + shippingCost;
        
        // For now, return a client-side order structure
        // In production, you would call PayPal API here using your secret key
        // For security, the secret key should be in environment variables
        
        // Note: This is a simplified version. For production, you need:
        // 1. Install @paypal/paypal-server-sdk
        // 2. Use your PayPal Secret Key from environment variables
        // 3. Call PayPal Orders API to create order server-side
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                message: 'Use client-side order creation. Backend API requires PayPal Server SDK setup.',
                // Return cart data for client-side processing
                cart: cart,
                totals: { subtotal, shipping: shippingCost, total }
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
            body: JSON.stringify({ error: 'Failed to create order', message: error.message })
        };
    }
};
