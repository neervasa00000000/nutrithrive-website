# TT - PayPal Expanded Checkout Integration Test

This directory contains a test implementation of PayPal's Expanded Checkout with both PayPal buttons and Card Fields integration.

## Structure

```
TT/
├── src/
│   ├── index.html    # Main product page with PayPal integration
│   └── app.js        # Front-end PayPal SDK integration
└── netlify/
    └── functions/
        ├── create-order.js    # Backend: Create PayPal order
        ├── capture-order.js   # Backend: Capture PayPal payment
        └── package.json       # Dependencies for Netlify Functions
```

## Setup Instructions

### 1. Install Netlify Functions Dependencies

Navigate to the functions directory and install dependencies:

```bash
cd TT/netlify/functions
npm install
```

### 2. Configure Netlify Environment Variables

In your Netlify dashboard, go to Site Settings > Environment Variables and add:

- `PAYPAL_CLIENT_ID`: `AWtclBnz1gQWQne-vS-OnExG1-Rl7Tj01nE8J1j7aZsLItOJvecwRVCpG757OrJ3QCf65w7q9i2bSgVi`
- `PAYPAL_CLIENT_SECRET`: `EAnPKgxB1TWM042LEvt-FmCeWZB9UqX3rSdJ0W95lU_selSN1ZFqRx69SlMBCSQOsk8fBc336C_mSICw`
- `PAYPAL_ENVIRONMENT`: `production` (or `sandbox` for testing)

### 3. Netlify Functions Location

The Netlify Functions have been copied to the root `netlify/functions/` directory with the following names:
- `create-order-tt.js` - Creates PayPal orders
- `capture-order-tt.js` - Captures PayPal payments

These functions are automatically deployed with your site. Make sure to install dependencies:

```bash
cd netlify/functions
npm install
```

### 4. Access the Test Page

Once deployed, access the test page at:
- Local: `http://localhost:8888/TT/src/index.html`
- Production: `https://yourdomain.com/TT/src/index.html`

## Features

✅ **PayPal Smart Buttons** - Embedded PayPal checkout (no redirect)
✅ **Card Fields** - Direct card payment without leaving the page
✅ **Billing Address** - Collects billing address for card payments
✅ **Quantity Selection** - Users can select quantity before checkout
✅ **Error Handling** - Comprehensive error handling and user feedback
✅ **INSTRUMENT_DECLINED Recovery** - Automatically retries declined payments

## PayPal Credentials

**Client ID:** `AWtclBnz1gQWQne-vS-OnExG1-Rl7Tj01nE8J1j7aZsLItOJvecwRVCpG757OrJ3QCf65w7q9i2bSgVi`

**Secret Key:** `EAnPKgxB1TWM042LEvt-FmCeWZB9UqX3rSdJ0W95lU_selSN1ZFqRx69SlMBCSQOsk8fBc336C_mSICw`

**Environment:** Production (Live)

## Testing

1. Use test card numbers from PayPal's Card Testing documentation
2. Test both PayPal button and Card Fields payment methods
3. Verify order creation and capture in PayPal dashboard
4. Check Netlify Functions logs for any errors

## Notes

- The page has `noindex, nofollow` meta tags to prevent search engine indexing
- All payments are processed in AUD (Australian Dollars)
- Product price is set to $10.00 AUD
- Functions use the PayPal Server SDK for secure backend processing
