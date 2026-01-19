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
                <!-- Traditional woven basket -->
                <path d="M5 9h14l-1 10H6L5 9z" fill="#1a2e22"></path>
                <path d="M5 9l-1-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1l-1 2" fill="#1a2e22"></path>
                <!-- Basket handle -->
                <path d="M8 6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" stroke="#1a2e22" stroke-width="2" stroke-linecap="round" fill="none"></path>
                <!-- Woven pattern lines -->
                <line x1="7" y1="12" x2="17" y2="12" stroke="#1a2e22" stroke-width="1" opacity="0.4"></line>
                <line x1="7" y1="15" x2="17" y2="15" stroke="#1a2e22" stroke-width="1" opacity="0.4"></line>
                <line x1="7" y1="18" x2="17" y2="18" stroke="#1a2e22" stroke-width="1" opacity="0.4"></line>
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
