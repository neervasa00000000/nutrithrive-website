// Newsletter Subscription Handler
document.addEventListener('DOMContentLoaded', function() {
    // ✅ CURRENT SETUP: Emails are sent to nutrithrive0@gmail.com
    // ✅ All subscriptions are stored in your email inbox
    // ✅ You can manually copy emails to Google Sheets if needed
    // 
    // Optional: To auto-save to Google Sheets, uncomment and add your Web App URL below:
    // const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_URL/exec';
    const GOOGLE_SHEETS_WEB_APP_URL = ''; // Leave empty for now - emails go to inbox
    
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const formData = new FormData(form);
            const email = formData.get('email');
            const name = formData.get('name') || '';
            const submitButton = form.querySelector('.newsletter-submit-btn');
            const messageDiv = form.querySelector('.newsletter-message') || form.parentElement.querySelector('.newsletter-message');
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                e.preventDefault();
                showMessage(messageDiv, 'Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Subscribing...';
                
                // Track subscription (if analytics available)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_subscription', {
                        'event_category': 'engagement',
                        'event_label': 'Newsletter Signup'
                    });
                }
                
                // Save to Google Sheets if URL is configured
                if (GOOGLE_SHEETS_WEB_APP_URL) {
                    saveToGoogleSheets(email, name, GOOGLE_SHEETS_WEB_APP_URL)
                        .catch(error => {
                            console.log('Google Sheets save failed (form will still submit):', error);
                            // Don't prevent form submission if Google Sheets fails
                        });
                }
                
                // Form will submit normally to FormSubmit.co
                // The _next parameter will redirect to thank you page
            }
        });
    });
    
    // Function to save subscription to Google Sheets
    function saveToGoogleSheets(email, name, webAppUrl) {
        const data = {
            email: email,
            name: name,
            source: 'Website',
            timestamp: new Date().toISOString()
        };
        
        return fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script web apps
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    }
    
    function showMessage(container, message, type) {
        if (!container) return;
        
        // Remove existing messages
        const existingMessage = container.querySelector('.newsletter-message-text');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = 'newsletter-message-text ' + type;
        messageEl.textContent = message;
        container.appendChild(messageEl);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
});

