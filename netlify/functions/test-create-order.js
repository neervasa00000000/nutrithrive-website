// Test script to verify create-order function works
// Run this locally: node netlify/functions/test-create-order.js

const testPayload = {
    cart: [
        {
            id: 'moringa-powder',
            name: 'Moringa Powder',
            price: 10.00,
            quantity: 1
        }
    ],
    totals: {
        subtotal: 10.00,
        shipping: 10.00,
        total: 20.00
    },
    shipping: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '0412345678',
        address: '123 Test St',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000'
    }
};

// Simulate Netlify function event
const event = {
    httpMethod: 'POST',
    body: JSON.stringify(testPayload)
};

// Import and test the function
const handler = require('./create-order').handler;

handler(event, {})
    .then(result => {
        console.log('✅ Function executed successfully!');
        console.log('Status:', result.statusCode);
        console.log('Response:', JSON.parse(result.body));
    })
    .catch(error => {
        console.error('❌ Function failed:', error);
    });
