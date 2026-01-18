# PayPal Credentials

## Client ID (Public - Used in Frontend)
```
AWtclBnz1gQWQne-vS-OnExG1-Rl7Tj01nE8J1j7aZsLItOJvecwRVCpG757OrJ3QCf65w7q9i2bSgVi
```

## Secret Key (Private - For Backend Only)
```
EAnPKgxB1TWM042LEvt-FmCeWZB9UqX3rSdJ0W95lU_selSN1ZFqRx69SlMBCSQOsk8fBc336C_mSICw
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
   - `PAYPAL_CLIENT_ID` = `AWtclBnz1gQWQne-vS-OnExG1-Rl7Tj01nE8J1j7aZsLItOJvecwRVCpG757OrJ3QCf65w7q9i2bSgVi`
   - `PAYPAL_CLIENT_SECRET` = `EAnPKgxB1TWM042LEvt-FmCeWZB9UqX3rSdJ0W95lU_selSN1ZFqRx69SlMBCSQOsk8fBc336C_mSICw`
   - `PAYPAL_ENVIRONMENT` = `live` (or `sandbox` for testing)

## Testing

Visit: `https://nutrithrive.com.au/test/paypal-test.html` to verify Client ID is working.
