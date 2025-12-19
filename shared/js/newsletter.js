// Newsletter Subscription Handler
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const formData = new FormData(form);
            const email = formData.get('email');
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
                
                // Form will submit normally to FormSubmit.co
                // The _next parameter will redirect to thank you page
            }
        });
    });
    
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

