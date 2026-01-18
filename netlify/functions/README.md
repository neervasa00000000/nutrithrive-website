# Netlify Functions for PayPal Integration

## Setup Instructions

### 1. Install Dependencies

The PayPal Server SDK needs to be installed. Netlify will automatically install dependencies from `package.json` when deploying.

If testing locally, run:
```bash
cd netlify/functions
npm install
```

### 2. Set Environment Variables in Netlify

Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables** and add:

- `PAYPAL_CLIENT_ID` = `AWtclBnz1gQWQne-vS-OnExG1-Rl7Tj01nE8J1j7aZsLItOJvecwRVCpG757OrJ3QCf65w7q9i2bSgVi`
- `PAYPAL_CLIENT_SECRET` = `EAnPKgxB1TWM042LEvt-FmCeWZB9UqX3rSdJ0W95lU_selSN1ZFqRx69SlMBCSQOsk8fBc336C_mSICw`
- `PAYPAL_ENVIRONMENT` = `live` (or `sandbox` for testing)

⚠️ **Important:** The functions have fallback values, but it's better to use environment variables for security.

### 3. Deploy

Netlify will automatically:
1. Install dependencies from `package.json`
2. Deploy the functions
3. Make them available at:
   - `/.netlify/functions/create-order`
   - `/.netlify/functions/capture-order`

## How It Works

### Frontend (checkout.html)
- Calls `/.netlify/functions/create-order` to create PayPal order
- Calls `/.netlify/functions/capture-order` to capture payment
- All sensitive operations happen server-side

### Backend (Netlify Functions)
- Uses PayPal Server SDK to securely create and capture orders
- Credentials stored in environment variables (not exposed to frontend)
- Returns order IDs and transaction details

## Testing

1. Visit: `https://nutrithrive.com.au/test/checkout.html`
2. Fill in the form
3. Click PayPal button or use card fields
4. Check browser console (F12) for detailed logs

## Troubleshooting

### Function not found (404)
- Check Netlify deployment logs
- Ensure `package.json` exists in `netlify/functions/`
- Verify functions are deployed in Netlify dashboard

### Authentication errors
- Verify environment variables are set correctly
- Check Client ID and Secret are for the correct environment (live/sandbox)
- Ensure credentials are active in PayPal dashboard

### Order creation fails
- Check Netlify function logs
- Verify cart data is being sent correctly
- Check PayPal account status and permissions
