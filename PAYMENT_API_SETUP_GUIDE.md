# Payment API Setup Guide: Sandbox vs Live

## Current Status

You're currently using:
- **PayPal Client ID:** `BAAvR6DiyzKb15OmvmOef-880T3liGnJna4Ghb_RmwL-CSfDn34xznqYOFvytR6v_DnqMl1THPbxzB-8Pk`
- **Payment Methods:** PayPal Hosted Buttons (embedded) + Redirect form

---

## Sandbox vs Live: Which Do You Need?

### 🧪 **SANDBOX (Testing Environment)**
- **Purpose:** Testing and development
- **Money:** Fake/test transactions only
- **When to use:** 
  - During development
  - Testing checkout flow
  - Before going live
- **URL:** `https://www.sandbox.paypal.com`
- **Client IDs:** Start with different prefixes, clearly marked as "Sandbox"

### ✅ **LIVE (Production Environment)**
- **Purpose:** Real transactions with real money
- **Money:** REAL payments from customers
- **When to use:**
  - When your website is live
  - When customers are making real purchases
  - Production environment
- **URL:** `https://www.paypal.com`
- **Client IDs:** Production credentials

---

## How to Check if Your Current Client ID is Sandbox or Live

### Method 1: Check PayPal Developer Dashboard
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal Business account
3. Navigate to **Dashboard** → **My Apps & Credentials**
4. Check if your app is under:
   - **Sandbox** tab = Testing environment
   - **Live** tab = Production environment

### Method 2: Test a Transaction
- **Sandbox:** Transactions won't charge real money
- **Live:** Transactions will charge REAL money

### Method 3: Check the URL
- If your PayPal buttons redirect to `sandbox.paypal.com` = Sandbox
- If they redirect to `paypal.com` = Live

---

## What You Need for a Full Checkout System

### For PRODUCTION (Live Website):

#### 1. **PayPal Live API Credentials** ✅ REQUIRED
- **Client ID** (Public) - Used in frontend JavaScript
- **Secret Key** (Private) - Used in backend/server-side only
- **App ID** - For advanced features

**Where to get:**
1. Log into [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Go to **Dashboard** → **My Apps & Credentials**
3. Switch to **Live** tab (not Sandbox)
4. Create a new app or use existing
5. Copy **Client ID** and **Secret**

#### 2. **Backend API Endpoint** (For Order Processing)
You'll need server-side code to:
- Process payments securely
- Create orders
- Handle webhooks
- Store order data

**Options:**
- **Serverless Functions** (Netlify, Vercel, AWS Lambda)
- **Backend API** (Node.js, Python, PHP)
- **E-commerce Platform** (Shopify, WooCommerce)

#### 3. **Webhook URL** (For Order Notifications)
- PayPal will send payment notifications to your server
- You need a public URL endpoint to receive these
- Example: `https://nutrithrive.com.au/api/paypal-webhook`

#### 4. **Order Storage/Database**
- Store order details
- Track payment status
- Manage inventory

**Options:**
- Google Sheets API
- Firebase
- Supabase
- PostgreSQL/MySQL

---

## Step-by-Step: Setting Up Live PayPal

### Step 1: Get Live Credentials
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your **PayPal Business Account**
3. Click **Dashboard** → **My Apps & Credentials**
4. Click **Live** tab (top of page)
5. Click **Create App** (if you don't have one)
6. Name it: "NutriThrive Production"
7. Copy:
   - **Client ID** (starts with `A...` or similar)
   - **Secret** (click "Show" to reveal)

### Step 2: Update Your Website
Replace sandbox Client ID with live Client ID in:
- `products/product-detail.html`
- `products/product-curry-leaves.html`
- `products/product-black-tea.html`
- `products/product-combo.html`

### Step 3: Test with Small Amount
- Make a test purchase with real money (small amount)
- Verify payment goes through
- Check order confirmation

---

## For Development/Testing: Use Sandbox

### When to Use Sandbox:
- ✅ Building the checkout system
- ✅ Testing payment flows
- ✅ Debugging issues
- ✅ Before going live

### How to Get Sandbox Credentials:
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Click **Sandbox** tab
3. Create test accounts
4. Get Sandbox Client ID
5. Test transactions (no real money)

---

## Complete Checkout System Requirements

### Frontend (What Customers See):
1. ✅ **PayPal SDK** - Already have this
2. ✅ **Client ID** - Need to verify if live or sandbox
3. ✅ **Shopping Cart** - Need to add
4. ✅ **Checkout Page** - Need to create

### Backend (Server-Side):
1. ❌ **Secret Key** - Need to get from PayPal
2. ❌ **API Endpoint** - Need to create
3. ❌ **Webhook Handler** - Need to create
4. ❌ **Order Storage** - Need to set up

### Security:
1. ✅ **HTTPS/SSL** - Already have (enforced in .htaccess)
2. ❌ **Secret Key Protection** - Never expose in frontend
3. ❌ **Webhook Verification** - Verify PayPal webhooks

---

## Quick Checklist

### For Production (Live):
- [ ] Get **Live** PayPal Client ID
- [ ] Get **Live** PayPal Secret Key
- [ ] Replace Client ID in all product pages
- [ ] Set up backend API endpoint
- [ ] Set up webhook handler
- [ ] Set up order storage
- [ ] Test with real small transaction
- [ ] Monitor first few orders

### For Development:
- [ ] Use **Sandbox** PayPal Client ID
- [ ] Test all payment flows
- [ ] Verify order processing
- [ ] Test error handling
- [ ] Switch to Live when ready

---

## Important Notes

### ⚠️ Security Warnings:
1. **NEVER** expose Secret Key in frontend code
2. **ALWAYS** use HTTPS for payment processing
3. **VERIFY** webhook signatures from PayPal
4. **STORE** Secret Key in environment variables (not in code)

### 💰 Transaction Fees:
- **PayPal Standard:** 2.6% + $0.30 AUD per transaction
- **PayPal Advanced:** Lower rates for high volume
- **Stripe Alternative:** 1.75% + $0.30 AUD per transaction

### 🔄 Switching Between Sandbox and Live:
- Use environment variables to switch easily
- Example: `PAYPAL_CLIENT_ID` (sandbox or live)
- Test in sandbox, deploy with live

---

## Next Steps

1. **Check your current Client ID** - Is it sandbox or live?
2. **Get Live credentials** if you're ready for production
3. **Set up backend** for order processing
4. **Test thoroughly** before going live

Would you like me to:
- ✅ Check if your current Client ID is sandbox or live?
- ✅ Help set up a backend API for order processing?
- ✅ Create a shopping cart system?
- ✅ Set up webhook handling?

---

## Resources

- [PayPal Developer Dashboard](https://developer.paypal.com/)
- [PayPal REST API Documentation](https://developer.paypal.com/docs/api/overview/)
- [PayPal Webhooks Guide](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)
- [PayPal Sandbox Testing](https://developer.paypal.com/docs/api-basics/sandbox/)
