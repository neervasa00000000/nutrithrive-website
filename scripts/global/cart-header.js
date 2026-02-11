// Add cart icon to header on all pages
(function() {
    function addCartIcon() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) {
            setTimeout(addCartIcon, 100);
            return;
        }
        
        // Check if cart icon already exists
        if (document.querySelector('.cart-icon-link')) {
            return;
        }
        
        // Create cart icon link
        const cartLink = document.createElement('a');
        cartLink.href = '/cart';
        cartLink.className = 'cart-icon-link';
        cartLink.setAttribute('aria-label', 'View shopping cart');
        cartLink.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: #1a2e22;
            font-weight: 500;
            padding: 0.5rem;
            margin-left: 0.5rem;
        `;
        
        cartLink.innerHTML = `
            <svg width="30" height="30" viewBox="0 0 25 25" fill="none" style="display: block;" aria-hidden="true">
                <path d="M8.5 10.5H5L6.5 19.5H18.5L20 10.5H16.5M8.5 10.5L10.2721 5.18377C10.4082 4.77543 10.7903 4.5 11.2208 4.5H13.7792C14.2097 4.5 14.5918 4.77543 14.7279 5.18377L16.5 10.5M8.5 10.5H16.5" stroke="#1a2e22" stroke-width="1.5"/>
                <path d="M12.5 10.5V19.5" stroke="#1a2e22" stroke-width="1.5"/>
                <path d="M9.5 19.5L8.5 10.5" stroke="#1a2e22" stroke-width="1.5"/>
                <path d="M15.5 19.5L16.5 10.5" stroke="#1a2e22" stroke-width="1.5"/>
                <path d="M19.5 13.5H5.5" stroke="#1a2e22" stroke-width="1.5"/>
                <path d="M19 16.5H6" stroke="#1a2e22" stroke-width="1.5"/>
            </svg>
            <span class="cart-badge" data-cart-count aria-label="items in cart" style="
                position: absolute;
                bottom: -4px;
                right: -4px;
                background: #175c36;
                color: white;
                font-size: 12px;
                font-weight: 700;
                display: none;
                align-items: center;
                justify-content: center;
                line-height: 1;
                min-width: 20px;
                height: 20px;
                border-radius: 50%;
                padding: 0 5px;
                box-sizing: border-box;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">0</span>
        `;
        
        // Insert before hamburger button or at end of nav
        const hamburger = document.querySelector('.hamburger');
        if (hamburger && hamburger.parentNode) {
            hamburger.parentNode.insertBefore(cartLink, hamburger);
        } else {
            navLinks.appendChild(cartLink);
        }
        
        // Update badge count
        if (window.Cart) {
            window.Cart.updateUI();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCartIcon);
    } else {
        addCartIcon();
    }
})();
