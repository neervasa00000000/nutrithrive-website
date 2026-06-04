# Newsletter Subscription Setup Guide

## Overview
The newsletter subscription system is now set up and ready to use! Subscribers can sign up from:
- Footer (on all pages)
- Homepage newsletter section
- Dedicated newsletter page: `/pages/newsletter/`

## How It Works

### Current Setup (FormSubmit.co)
The forms currently use **FormSubmit.co** (same as your contact form) to send subscription emails to `nutrithrive0@gmail.com`. Each subscription will arrive as an email with the subscriber's email address and name (if provided).

### Storing Subscriber Emails

#### Option 1: Manual Collection (Current)
- Subscriptions are sent to your email inbox
- You can manually copy emails into a spreadsheet or email marketing tool

#### Option 2: Google Sheets Integration (Recommended)
To automatically store all subscriptions in Google Sheets:

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet named "Newsletter Subscribers"
   - Add headers: `Email`, `Name`, `Date`, `Source`

2. **Set up FormSubmit with Google Sheets**
   - FormSubmit.co can integrate with Google Sheets via Zapier or Make.com
   - Alternatively, use the Google Apps Script method below

3. **Google Apps Script Method** (Free)
   - In your Google Sheet, go to Extensions → Apps Script
   - Create a webhook that receives FormSubmit data
   - Or use a service like [FormSubmit.co's Google Sheets integration](https://formsubmit.co/help/google-sheets-integration)

#### Option 3: Email Marketing Service (Best for Sending Newsletters)
For sending newsletters later, consider integrating with:
- **Mailchimp** (Free up to 500 contacts)
- **SendGrid** (Free tier available)
- **ConvertKit** (Great for creators)
- **Brevo** (formerly Sendinblue, free tier available)

These services can:
- Store subscriber emails automatically
- Send beautiful newsletters
- Track open rates and clicks
- Manage unsubscribes automatically

## Sending Newsletters

### Method 1: Email Marketing Service (Recommended)
1. Export subscriber emails from your storage (Google Sheets, etc.)
2. Import into your chosen email marketing service
3. Create and send newsletters through their platform

### Method 2: Manual Email
1. Collect all subscriber emails from your storage
2. Use BCC (Blind Carbon Copy) when sending emails
3. **Important**: Always include an unsubscribe link

### Method 3: Automated Newsletter Service
Set up automated newsletters using:
- RSS feed integration (if you have a blog)
- Scheduled campaigns
- Welcome email sequences

## Files Created

1. **`/shared/js/newsletter.js`** - Newsletter form handler
2. **`/shared/css/style.css`** - Newsletter form styles (added)
3. **`/pages/newsletter/index.html`** - Dedicated subscription page
4. **`/pages/newsletter/thank-you.html`** - Thank you page after subscription

## Form Locations

The newsletter form appears in:
- Footer (all pages) - Compact inline form
- Homepage - Full newsletter section
- `/pages/newsletter/` - Dedicated subscription page

## Customization

### Change Email Address
Update the form action URL in:
- `index.html` (homepage and footer)
- `/pages/newsletter/index.html`
- All other pages with footer forms

Change: `action="https://formsubmit.co/nutrithrive0@gmail.com"`

### Change Thank You Page
Update the `_next` hidden input in all forms:
```html
<input type="hidden" name="_next" value="https://nutrithrive.com.au/pages/newsletter/thank-you.html">
```

### Styling
Newsletter form styles are in `/shared/css/style.css` under the "Newsletter Subscription Styles" section.

## Privacy & Compliance

- ✅ Forms include privacy notice
- ✅ Email validation
- ✅ GDPR-friendly (users can unsubscribe)
- ⚠️ Consider adding a privacy policy link
- ⚠️ Consider adding explicit consent checkbox for GDPR compliance

## Next Steps

1. **Test the subscription form** - Subscribe yourself to verify it works
2. **Set up email storage** - Choose Option 2 or 3 above
3. **Plan your first newsletter** - What content will you send?
4. **Set up email marketing service** - For easier newsletter sending
5. **Add unsubscribe functionality** - Important for compliance

## Support

If you need help setting up Google Sheets integration or an email marketing service, the forms are ready to be connected to any backend service that accepts POST requests with email data.

