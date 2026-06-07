# Quick Start: Auto-Save Emails to Google Sheets

## Current Status
Right now, newsletter subscriptions are **only sent to your email inbox** (`nutrithrive0@gmail.com`). They are **NOT automatically saved** to a file or spreadsheet.

## To Enable Auto-Save to Google Sheets:

### Option 1: Quick Setup (5 minutes)

1. **Create Google Sheet**
   - Go to https://sheets.google.com
   - Create new sheet named "Newsletter Subscribers"
   - Add headers in Row 1: `Email` | `Name` | `Date` | `Source`

2. **Create Google Apps Script**
   - In your sheet: **Extensions** → **Apps Script**
   - Delete default code, paste the code from `GOOGLE_SHEETS_SETUP.md`
   - Click **Deploy** → **New deployment**
   - Choose **Web app**, set access to **Anyone**
   - Copy the Web App URL

3. **Update Website**
   - Open `/shared/js/newsletter.js`
   - Find: `const GOOGLE_SHEETS_WEB_APP_URL = '';`
   - Paste your Web App URL between the quotes
   - Save and push to website

4. **Test**
   - Subscribe on your website
   - Check Google Sheet - email should appear automatically!

### Option 2: Use Email Marketing Service (Recommended for sending newsletters)

Services like **Mailchimp** or **Brevo** will:
- ✅ Store emails automatically
- ✅ Let you send beautiful newsletters
- ✅ Track opens and clicks
- ✅ Handle unsubscribes

**Mailchimp Setup:**
1. Sign up at mailchimp.com (free for up to 500 contacts)
2. Create a signup form
3. Get the form HTML code
4. Replace newsletter forms with Mailchimp form code

**Brevo Setup:**
1. Sign up at brevo.com (free tier available)
2. Create a form
3. Get embed code
4. Replace newsletter forms

## Current Behavior

**Without Google Sheets setup:**
- ✅ Subscriptions sent to email inbox
- ❌ No automatic file/spreadsheet storage
- ⚠️ You must manually copy emails to a spreadsheet

**With Google Sheets setup:**
- ✅ Subscriptions sent to email inbox (notification)
- ✅ Subscriptions automatically saved to Google Sheet
- ✅ Easy to view, export, and manage subscribers

## Need Help?

See `GOOGLE_SHEETS_SETUP.md` for detailed step-by-step instructions with screenshots guidance.

