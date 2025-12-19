# Connect Your Google Sheet - Step by Step

Your Google Sheet: https://docs.google.com/spreadsheets/d/124i9E9BZWU8CZO_JKbIeSM8i1BL-fVLnX6GL-ZXaBAg/edit

## Step 1: Open Google Apps Script

1. Open your Google Sheet: [Click here](https://docs.google.com/spreadsheets/d/124i9E9BZWU8CZO_JKbIeSM8i1BL-fVLnX6GL-ZXaBAg/edit)
2. Click **Extensions** → **Apps Script** (at the top menu)
3. A new tab will open with the Apps Script editor

## Step 2: Paste the Code

1. In the Apps Script editor, delete any existing code
2. Open the file: `/pages/newsletter/google-apps-script-code.js` from your website files
3. Copy ALL the code from that file
4. Paste it into the Apps Script editor
5. Click **Save** (💾 icon or Ctrl+S / Cmd+S)

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Fill in:
   - **Description**: Newsletter Subscription Handler
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** (IMPORTANT!)
5. Click **Deploy**
6. **Authorize** when prompted:
   - Click "Review permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"
7. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbyXXXXXXXXXXXXXXXXXXXXX/exec
   ```
   ⚠️ **SAVE THIS URL** - you'll need it in the next step!

## Step 4: Update Your Website

1. Open the file: `/shared/js/newsletter.js` in your website
2. Find this line (around line 6):
   ```javascript
   const GOOGLE_SHEETS_WEB_APP_URL = '';
   ```
3. Paste your Web App URL between the quotes:
   ```javascript
   const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. Save the file
5. Push to your website (git add, commit, push)

## Step 5: Test It!

1. Go to your website
2. Subscribe to the newsletter with a test email
3. Check your Google Sheet - you should see the email appear in Row 2!

## Troubleshooting

**If emails don't appear in the sheet:**
- Make sure "Who has access" is set to **"Anyone"** (not "Only myself")
- Check the Apps Script execution log: In Apps Script editor, click **Executions** tab
- Make sure you authorized the script when deploying

**If you get errors:**
- Check that your sheet has headers: Email | Name | Date | Source
- Make sure the Apps Script is saved
- Try redeploying the web app

## What Happens Now?

✅ Every newsletter subscription will:
- Be sent to your email (nutrithrive0@gmail.com) - for notifications
- Be automatically saved to your Google Sheet - for storage and management

You can now:
- View all subscribers in your Google Sheet
- Export the data anytime
- Import into email marketing tools (Mailchimp, etc.)
- See subscription dates and sources

