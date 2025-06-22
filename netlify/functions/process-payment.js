require('dotenv').config();
const axios = require('axios');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { order } = JSON.parse(event.body);

        // --- Verify PayPal Order ---
        // A real implementation should verify the order with PayPal to prevent fraud
        // This requires a call to the PayPal API to fetch the order details and confirm the status.
        // For this example, we'll assume the order is valid.

        const customerName = order.payer.name.given_name + ' ' + order.payer.name.surname;
        const shippingAddress = order.purchase_units[0].shipping.address;
        const emailAddress = order.payer.email_address;
        const items = order.purchase_units[0].description;
        const amount = order.purchase_units[0].amount.value;
        const currency = order.purchase_units[0].amount.currency_code;

        const emailHtml = `
            <h1>New Order Received!</h1>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${emailAddress}</p>
            <p><strong>Items:</strong> ${items}</p>
            <p><strong>Total:</strong> ${amount} ${currency}</p>
            <hr>
            <h2>Shipping Address</h2>
            <p>
                ${shippingAddress.address_line_1}<br>
                ${shippingAddress.address_line_2 ? shippingAddress.address_line_2 + '<br>' : ''}
                ${shippingAddress.admin_area_2}, ${shippingAddress.admin_area_1} ${shippingAddress.postal_code}<br>
                ${shippingAddress.country_code}
            </p>
        `;

        // --- Send Email via Sendlr ---
        await axios.post('https://api.sendlr.com/v1/email/send', {
            from: 'orders@nutrithrive.com.au', // Replace with your verified Sendlr sender email
            to: process.env.NOTIFICATION_EMAIL,
            subject: `New Order from ${customerName} - Order #${order.id}`,
            html: emailHtml,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.SENDLR_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Order processed successfully' }),
        };

    } catch (error) {
        console.error('Error processing payment:', error);
        // Check if the error is from an external API call
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
        };
    }
}; 