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
        cartLink.href = '/cart.html';
        cartLink.className = 'cart-icon-link';
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
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style="display: block;">
                <!-- Solid black basket with trapezoidal body -->
                <path d="M5 8h14l-1 12H6L5 8z" fill="#1a2e22"></path>
                <path d="M5 8l-1-4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1l-1 4" fill="#1a2e22"></path>
                <!-- Flat rectangular handle -->
                <rect x="8" y="3" width="8" height="2" fill="#1a2e22" rx="1"></rect>
                <!-- Three vertical white bars on front -->
                <rect x="6" y="10" width="2" height="8" fill="white" rx="0.5"></rect>
                <rect x="11" y="10" width="2" height="8" fill="white" rx="0.5"></rect>
                <rect x="16" y="10" width="2" height="8" fill="white" rx="0.5"></rect>
            </svg>
            <span class="cart-badge" data-cart-count style="
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
