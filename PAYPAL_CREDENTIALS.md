# PayPal Credentials

## Client ID (Public - Used in Frontend)
```
AWENgCZmgDmSWoCPafyEVah9MQmXbJpsNfaq8bQrHElnLCnqSJTNG34tMXtHRKBlDuKoTf49Po3iwcRV
```

## Secret Key (Private - For Backend Only)
```
EPv_hqIeerM5-A8UspVHLViBWsKMaoHNdHP5Gp4UvpzN-DBKk1ZRPap-dWEkW0vZGEdNHQ0pEHLjiCPY
```

## Important Notes

⚠️ **SECURITY WARNING:**
- **Client ID** is safe to use in frontend code (browser)
- **Secret Key** should NEVER be exposed in frontend code
- Secret Key is only for server-side API calls (backend/Netlify functions)

## Where Client ID is Used

1. `/test/checkout.html` - Checkout page with PayPal buttons and card fields
2. `/test/moringa-product.html` - Product page with PayPal checkout
3. `/test/paypal-test.html` - Test page to verify Client ID

## Where Secret Key Should Be Used

- Netlify Functions (serverless backend)
- Environment variables in Netlify dashboard
- Backend API endpoints for order creation/capture

## Setup Instructions for Backend

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add:
   - `PAYPAL_CLIENT_ID` = `AWENgCZmgDmSWoCPafyEVah9MQmXbJpsNfaq8bQrHElnLCnqSJTNG34tMXtHRKBlDuKoTf49Po3iwcRV`
   - `PAYPAL_CLIENT_SECRET` = `EPv_hqIeerM5-A8UspVHLViBWsKMaoHNdHP5Gp4UvpzN-DBKk1ZRPap-dWEkW0vZGEdNHQ0pEHLjiCPY`
   - `PAYPAL_ENVIRONMENT` = `live` (or `sandbox` for testing)

## Testing

Visit: `https://nutrithrive.com.au/test/paypal-test.html` to verify Client ID is working.
