# Netlify Functions for PayPal Integration

## Setup Instructions

### Option 1: Client-Side Only (Current - Works Now)
The checkout page currently uses client-side PayPal order creation and capture. This works immediately but processes payments on the client side.

### Option 2: Server-Side with PayPal Server SDK (Recommended for Production)

1. **Install PayPal Server SDK:**
```bash
npm install @paypal/paypal-server-sdk
```

2. **Set Environment Variables in Netlify:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add:
     - `PAYPAL_CLIENT_ID` = Your Live Client ID
     - `PAYPAL_CLIENT_SECRET` = Your Live Secret Key
     - `PAYPAL_ENVIRONMENT` = `live` (or `sandbox` for testing)

3. **Update Functions:**
   - The functions in this directory need to be updated to use the PayPal Server SDK
   - See the Express.js example code you provided for reference

4. **Deploy:**
   - Netlify will automatically deploy these functions
   - They'll be available at: `/.netlify/functions/create-order` and `/.netlify/functions/capture-order`

## Current Status

- ✅ Client-side PayPal integration (works now)
- ✅ Card Fields integration (works now)
- ⚠️ Backend API functions created but need PayPal Server SDK setup
- ⚠️ Environment variables need to be configured in Netlify

## Security Notes

- Never expose Secret Key in frontend code
- Always use environment variables for sensitive data
- Server-side processing is more secure for production
