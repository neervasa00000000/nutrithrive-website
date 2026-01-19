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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a2e22" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                <!-- Shopping cart basket -->
                <path d="M7 8H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2" style="fill: none;"></path>
                <!-- Cart handle -->
                <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" style="fill: none;"></path>
                <!-- Left wheel -->
                <circle cx="7" cy="20" r="1.5" style="fill: none;"></circle>
                <!-- Right wheel -->
                <circle cx="17" cy="20" r="1.5" style="fill: none;"></circle>
            </svg>
            <span class="cart-badge" data-cart-count style="
                position: absolute;
                top: -4px;
                right: -4px;
                background: #175c36;
                color: white;
                font-size: 11px;
                font-weight: 700;
                display: none;
                align-items: center;
                justify-content: center;
                line-height: 1;
                min-width: 18px;
                height: 18px;
                border-radius: 50%;
                padding: 0 4px;
                box-sizing: border-box;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
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
