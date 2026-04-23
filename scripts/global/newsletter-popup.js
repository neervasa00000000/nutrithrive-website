// Newsletter Popup for Blog Pages
if (window.__NT_NEWSLETTER_POPUP_INITIALIZED__) {
    console.log('[NutriThrive] newsletter-popup.js already initialized, skipping duplicate load');
} else {
window.__NT_NEWSLETTER_POPUP_INITIALIZED__ = true;
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

        const popup = document.createElement('div');
        popup.className = 'newsletter-popup';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'newsletter-popup-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Close popup');
        closeBtn.textContent = '×';

        const title = document.createElement('h2');
        title.textContent = '🌱 Stay Updated with NutriThrive';

        const desc = document.createElement('p');
        desc.textContent =
            'Get exclusive health tips, product updates, special offers, and wellness insights delivered to your inbox!';

        const form = document.createElement('form');
        form.className = 'newsletter-popup-form';
        form.action = 'https://formsubmit.co/nutrithrive0@gmail.com';
        form.method = 'POST';

        const subject = document.createElement('input');
        subject.type = 'hidden';
        subject.name = '_subject';
        subject.value = 'Newsletter Subscription - Blog Popup';

        const next = document.createElement('input');
        next.type = 'hidden';
        next.name = '_next';
        // SECURITY: assign to the input property (not via innerHTML/template strings)
        next.value = window.location.href;

        const template = document.createElement('input');
        template.type = 'hidden';
        template.name = '_template';
        template.value = 'table';

        const captcha = document.createElement('input');
        captcha.type = 'hidden';
        captcha.name = '_captcha';
        // Keeping existing behavior; consider enabling captcha to reduce spam.
        captcha.value = 'false';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'name';
        nameInput.placeholder = 'Your Name';
        nameInput.required = true;

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.placeholder = 'Your Email Address';
        emailInput.required = true;

        const submit = document.createElement('button');
        submit.type = 'submit';
        submit.textContent = 'Subscribe Now';

        const message = document.createElement('div');
        message.className = 'newsletter-popup-message';

        // Assemble form
        form.append(subject, next, template, captcha, nameInput, emailInput, submit, message);

        const privacy = document.createElement('p');
        privacy.style.fontSize = '0.85rem';
        privacy.style.color = '#999';
        privacy.style.marginTop = '1rem';
        privacy.style.marginBottom = '0';
        privacy.textContent = 'We respect your privacy. Unsubscribe anytime.';

        popup.append(closeBtn, title, desc, form, privacy);
        overlay.appendChild(popup);
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
}
