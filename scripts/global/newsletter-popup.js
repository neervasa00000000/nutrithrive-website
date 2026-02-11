// Newsletter Popup for Blog Pages
(function() {
    'use strict';

    // Configuration
    const POPUP_DELAY = 5000; // Show after 5 seconds
    const COOKIE_NAME = 'newsletter_popup_shown';
    const COOKIE_DAYS = 7; // Don't show again for 7 days if closed

    // Check if popup was already shown
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    // Create popup HTML
    function createPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'newsletter-popup-overlay';
        overlay.innerHTML = `
            <div class="newsletter-popup">
                <button class="newsletter-popup-close" aria-label="Close popup">&times;</button>
                <h2>🌱 Stay Updated with NutriThrive</h2>
                <p>Get exclusive health tips, product updates, special offers, and wellness insights delivered to your inbox!</p>
                <form class="newsletter-popup-form" action="https://formsubmit.co/nutrithrive0@gmail.com" method="POST">
                    <input type="hidden" name="_subject" value="Newsletter Subscription - Blog Popup">
                    <input type="hidden" name="_next" value="${window.location.href}">
                    <input type="hidden" name="_template" value="table">
                    <input type="hidden" name="_captcha" value="false">
                    <input type="text" name="name" placeholder="Your Name" required>
                    <input type="email" name="email" placeholder="Your Email Address" required>
                    <button type="submit">Subscribe Now</button>
                    <div class="newsletter-popup-message"></div>
                </form>
                <p style="font-size: 0.85rem; color: #999; margin-top: 1rem; margin-bottom: 0;">We respect your privacy. Unsubscribe anytime.</p>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    // Show popup
    function showPopup() {
        const overlay = document.querySelector('.newsletter-popup-overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    // Hide popup
    function hidePopup() {
        const overlay = document.querySelector('.newsletter-popup-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // Initialize popup
    function initPopup() {
        // Check if already shown
        if (getCookie(COOKIE_NAME)) {
            return;
        }

        // Create popup
        const overlay = createPopup();

        // Close button handler
        const closeBtn = overlay.querySelector('.newsletter-popup-close');
        closeBtn.addEventListener('click', function() {
            hidePopup();
            setCookie(COOKIE_NAME, 'true', COOKIE_DAYS);
        });

        // Click outside to close
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hidePopup();
                setCookie(COOKIE_NAME, 'true', COOKIE_DAYS);
            }
        });

        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                hidePopup();
                setCookie(COOKIE_NAME, 'true', COOKIE_DAYS);
            }
        });

        // Form submission handler
        const form = overlay.querySelector('.newsletter-popup-form');
        const message = overlay.querySelector('.newsletter-popup-message');
        
        form.addEventListener('submit', function(e) {
            // Let the form submit naturally to FormSubmit
            // After submission, FormSubmit will redirect to _next URL
            message.textContent = 'Subscribing...';
            message.className = 'newsletter-popup-message';
            message.style.display = 'block';
            
            // Set cookie so popup doesn't show again
            setCookie(COOKIE_NAME, 'true', 365); // Don't show for 1 year after subscription
        });

        // Show popup after delay
        setTimeout(function() {
            showPopup();
        }, POPUP_DELAY);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopup);
    } else {
        initPopup();
    }
})();
