/**
 * Google Apps Script for Newsletter Subscription
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/124i9E9BZWU8CZO_JKbIeSM8i1BL-fVLnX6GL-ZXaBAg/edit
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire code
 * 5. Click Deploy → New deployment
 * 6. Choose "Web app"
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click Deploy
 * 10. Copy the Web App URL and paste it into shared/js/newsletter.js
 */

function doPost(e) {
  try {
    // Get the active spreadsheet (your Newsletter Subscribers sheet)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the JSON data sent from the website
    var data = JSON.parse(e.postData.contents);
    
    // Get current date/time
    var timestamp = new Date();
    
    // Extract email, name, and source from the data
    var email = data.email || '';
    var name = data.name || '';
    var source = data.source || 'Website';
    
    // Validate email is not empty
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'Email is required'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check if email already exists (optional - prevents duplicates)
    var existingData = sheet.getDataRange().getValues();
    for (var i = 1; i < existingData.length; i++) {
      if (existingData[i][0] === email) {
        return ContentService.createTextOutput(JSON.stringify({
          'status': 'success',
          'message': 'Email already subscribed'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Add new row to sheet: Email (Column A), Name (Column B), Date (Column C), Source (Column D)
    sheet.appendRow([email, name, timestamp, source]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Subscription saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    Logger.log('Error: ' + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - you can run this to test the script
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
  var result = doPost(mockEvent);
  Logger.log(result.getContent());
}

