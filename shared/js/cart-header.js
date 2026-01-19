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
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a2e22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                <!-- Basket body with rounded bottom -->
                <path d="M6 2L4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4H6z" style="fill: none;"></path>
                <!-- Top opening -->
                <line x1="4" y1="6" x2="20" y2="6" style="fill: none;"></line>
                <!-- Left handle (semicircular) -->
                <path d="M8 6c0-1.1.9-2 2-2h0" style="fill: none;"></path>
                <path d="M8 6c0 1.1-.9 2-2 2" style="fill: none;"></path>
                <!-- Right handle (semicircular) -->
                <path d="M16 6c0-1.1.9-2 2-2h0" style="fill: none;"></path>
                <path d="M16 6c0 1.1.9 2 2 2" style="fill: none;"></path>
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
