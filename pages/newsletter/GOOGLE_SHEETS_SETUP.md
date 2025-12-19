# Google Sheets Auto-Save Setup Guide

This guide will help you automatically save all newsletter subscriptions to a Google Sheet.

## Step-by-Step Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Newsletter Subscribers" (or any name you prefer)
4. In the first row, add these column headers:
   - **Column A**: `Email`
   - **Column B**: `Name`
   - **Column C**: `Date`
   - **Column D**: `Source`

### Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the form data
    var data = JSON.parse(e.postData.contents);
    
    // Get current date/time
    var timestamp = new Date();
    
    // Extract email and name from the data
    var email = data.email || '';
    var name = data.name || '';
    var source = data.source || 'Website';
    
    // Add row to sheet: Email, Name, Date, Source
    sheet.appendRow([email, name, timestamp, source]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Subscription saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for testing)
function test() {
  var testData = {
    email: 'test@example.com',
    name: 'Test User',
    source: 'Test'
  };
  var mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  doPost(mockEvent);
}
```

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type" → Choose **Web app**
3. Set:
   - **Description**: Newsletter Subscription Handler
   - **Execute as**: Me
   - **Who has access**: Anyone (important!)
4. Click **Deploy**
5. **Copy the Web App URL** - you'll need this in the next step
   - It will look like: `https://script.google.com/macros/s/AKfycby.../exec`

### Step 4: Update Your Website Forms

I'll update the newsletter forms to send data to your Google Sheet. You'll need to:

1. Replace the form action in all newsletter forms
2. The forms will send data to both:
   - Your email (via FormSubmit.co) - for notifications
   - Google Sheets (via the web app) - for storage

### Step 5: Test It

1. Go to your website
2. Subscribe to the newsletter with a test email
3. Check your Google Sheet - you should see the new row appear!

## Alternative: Use FormSubmit.co with Zapier/Make.com

If you prefer not to use Google Apps Script:

1. **Zapier Method** (Free tier available):
   - Create a Zapier account
   - Create a new Zap
   - Trigger: Email (FormSubmit.co)
   - Action: Google Sheets - Add Row
   - Connect your accounts and set up the mapping

2. **Make.com Method** (Free tier available):
   - Similar to Zapier
   - Create a scenario
   - Trigger: Email from FormSubmit
   - Action: Add row to Google Sheets

## Viewing Your Subscribers

Once set up, you can:
- View all subscribers in your Google Sheet
- Export the data anytime
- Import into email marketing tools (Mailchimp, SendGrid, etc.)
- Sort and filter subscribers
- See subscription dates

## Security Note

The Google Apps Script web app URL will be public, but it only accepts POST requests with the correct data format. The script doesn't expose your sheet data - it only adds new rows.

## Troubleshooting

**Subscriptions not saving?**
- Check that the web app is deployed with "Anyone" access
- Verify the Web App URL is correct in the form
- Check the Apps Script execution log for errors

**Need help?**
- Check the Apps Script execution log: **Executions** tab in Apps Script editor
- Make sure the sheet name matches (case-sensitive)

