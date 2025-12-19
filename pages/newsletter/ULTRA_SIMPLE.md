# Ultra Simple Setup - 3 Steps Only!

## Step 1: Open Apps Script
1. Go to: https://docs.google.com/spreadsheets/d/124i9E9BZWU8CZO_JKbIeSM8i1BL-fVLnX6GL-ZXaBAg/edit
2. Click **Extensions** → **Apps Script**

## Step 2: Paste This Code
Delete everything in the editor and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.email || '', data.name || '', new Date(), 'Website']);
  return ContentService.createTextOutput('OK');
}
```

Click **Save** (💾)

## Step 3: Deploy
1. Click **Deploy** → **New deployment**
2. Click the ⚙️ gear → Choose **Web app**
3. Set **Who has access** to: **Anyone**
4. Click **Deploy**
5. **Copy the URL** (it will look like: `https://script.google.com/macros/s/AKfycby.../exec`)

## Step 4: Send Me The URL
Once you have the URL, just tell me what it is and I'll update your website automatically!

---

**That's it!** Just copy, paste, deploy, and send me the URL. Takes 2 minutes! 🚀

