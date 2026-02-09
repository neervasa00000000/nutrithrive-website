# Blog Payment Links Audit Report
**Date:** February 9, 2026
**Issue:** Missing shipping/delivery information for orders

## ❌ PROBLEM IDENTIFIED

**Blog posts with PayPal buttons are NOT collecting shipping addresses** because they use PayPal Hosted Buttons that don't require shipping address collection by default.

---

## 📋 BLOG POSTS WITH PAYMENT BUTTONS

### 1. **musashi-protein-powder-australia-comprehensive-guide-2026.html**
- **PayPal Button IDs Found:** 
  - `ERYQAP7ZAHDDQ` (Moringa Powder) - **6 instances**
  - `NJKU46NBZ55JN` (Curry Leaves) - **1 instance**
  - `ASMMMWXFS7X84` (Combo Pack) - **1 instance**
- **Type:** PayPal Hosted Buttons (form-based)
- **Shipping Address Collection:** ❌ **NOT COLLECTING**
- **Locations:** Lines 988, 1172, 1263, 1284, 1715, 1735

### 2. **why-australians-cant-sleep-moringa-midnight-reset.html**
- **PayPal Button ID:** `ERYQAP7ZAHDDQ` (Moringa Powder)
- **Type:** PayPal Hosted Buttons (form-based)
- **Shipping Address Collection:** ❌ **NOT COLLECTING**
- **Locations:** Lines 541, 676, 714, 807, 1070 (5 instances)

### 3. **moringa-brands-reviewed-australia-2025-verdict.html**
- **PayPal Button ID:** `ERYQAP7ZAHDDQ` (Moringa Powder)
- **Type:** PayPal Hosted Buttons (form-based)
- **Shipping Address Collection:** ❌ **NOT COLLECTING**
- **Location:** Line 577

### 4. **black-tea-benefits-caffeine-australia.html**
- **PayPal Button ID:** `AMDLXGV7HCKXW` (Black Tea)
- **Type:** PayPal Hosted Buttons (JavaScript API)
- **Shipping Address Collection:** ❌ **NOT COLLECTING**
- **Locations:** Lines 1524, 1531 (2 instances - top and bottom)

### 5. **darjeeling-black-tea-melbourne-muscatel-marvel.html**
- **PayPal Button ID:** `AMDLXGV7HCKXW` (Black Tea)
- **Type:** PayPal Hosted Buttons (JavaScript API)
- **Shipping Address Collection:** ❌ **NOT COLLECTING**
- **Location:** Line 1307

### 6. **the-2026-moringa-market-disruption-chemical-free-superfood-power.html**
- **Payment Method:** Apple Pay (via PayPal)
- **Type:** Apple Pay Session
- **Shipping Address Collection:** ✅ **YES - COLLECTING**
- **Details:** Line 614 shows `requiredShippingContactFields: ["name", "phone", "email", "postalAddress"]`
- **Status:** ✅ This one is working correctly!

---

## 🔍 PAYPAL BUTTON IDS USED

| Button ID | Product | Used In | Status |
|-----------|---------|---------|--------|
| `ERYQAP7ZAHDDQ` | Moringa Powder | Multiple blog posts + product pages | ❌ Not collecting shipping |
| `NJKU46NBZ55JN` | Curry Leaves | Blog + product pages | ❌ Not collecting shipping |
| `AMDLXGV7HCKXW` | Black Tea | Blog + product pages | ❌ Not collecting shipping |
| `ASMMMWXFS7X84` | Combo Pack | Blog post | ❌ Not collecting shipping |

---

## ⚠️ ROOT CAUSE

**PayPal Hosted Buttons** (both form-based and JavaScript API) don't collect shipping addresses unless:
1. Configured in PayPal Business Dashboard
2. OR using PayPal Buttons API with shipping address requirement enabled

---

## ✅ SOLUTIONS

### **Option 1: Fix in PayPal Dashboard (Recommended)**
1. Log into PayPal Business account
2. Go to **Tools → All Tools → PayPal Buttons**
3. Edit each button ID:
   - `ERYQAP7ZAHDDQ`
   - `NJKU46NBZ55JN`
   - `AMDLXGV7HCKXW`
   - `ASMMMWXFS7X84`
4. Enable **"Require shipping address"** or **"Collect shipping address"**
5. Save and republish buttons

### **Option 2: Add Shipping Form Before PayPal Button**
Add a shipping address form on blog posts before showing PayPal button.

### **Option 3: Switch to PayPal Buttons API**
Replace Hosted Buttons with PayPal Buttons API that collects shipping addresses (like cart.html does).

---

## 📊 SUMMARY

- **Total Blog Posts with Payment Buttons:** 6
- **Not Collecting Shipping:** 5 ❌
- **Collecting Shipping:** 1 ✅ (Apple Pay only)
- **Total PayPal Button Instances:** ~15+

**All PayPal Hosted Buttons need to be configured in PayPal dashboard to collect shipping addresses.**

---

## 🚨 IMMEDIATE ACTION REQUIRED

1. **For current orders:** Contact customers via email from PayPal notifications to get shipping addresses
2. **Fix PayPal buttons:** Enable shipping address collection in PayPal dashboard for all button IDs
3. **Test:** Place a test order to verify shipping address is collected
