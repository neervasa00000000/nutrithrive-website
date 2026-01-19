// Shopping Cart System
// Uses localStorage to persist cart across pages

const CART_STORAGE_KEY = 'nutrithrive_cart';

// Cart data structure:
// {
//   items: [
//     {
//       id: "product-id",
//       name: "Product Name",
//       price: 10.00,
//       quantity: 2,
//       image: "image-url"
//     }
//   ],
//   total: 20.00,
//   itemCount: 2
// }

// Initialize cart
function initCart() {
    if (!getCart()) {
        saveCart({
            items: [],
            total: 0,
            itemCount: 0
        });
    }
    updateCartUI();
}

// Get cart from localStorage
function getCart() {
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        return cartData ? JSON.parse(cartData) : null;
    } catch (e) {
        console.error('Error reading cart:', e);
        return null;
    }
}

// Save cart to localStorage
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartUI();
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// Calculate cart totals
function calculateCartTotals(cart) {
    let total = 0;
    let itemCount = 0;
    
    if (cart && cart.items) {
        cart.items.forEach(item => {
            const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
            total += itemTotal;
            itemCount += parseInt(item.quantity);
        });
    }
    
    cart.total = parseFloat(total.toFixed(2));
    cart.itemCount = itemCount;
    return cart;
}

// Add item to cart
function addToCart(product) {
    const cart = getCart() || { items: [], total: 0, itemCount: 0 };
    
    // Check if product already in cart
    const existingIndex = cart.items.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
        // Update quantity
        cart.items[existingIndex].quantity = parseInt(cart.items[existingIndex].quantity) + parseInt(product.quantity || 1);
    } else {
        // Add new item
        cart.items.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity || 1),
            image: product.image || ''
        });
    }
    
    const updatedCart = calculateCartTotals(cart);
    saveCart(updatedCart);
    
    // Show notification
    showCartNotification('Item added to cart!');
    
    return updatedCart;
}

// Remove item from cart
function removeFromCart(productId) {
    const cart = getCart();
    if (!cart) return;
    
    cart.items = cart.items.filter(item => item.id !== productId);
    const updatedCart = calculateCartTotals(cart);
    saveCart(updatedCart);
    
    return updatedCart;
}

// Update item quantity in cart
function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    if (!cart) return;
    
    const item = cart.items.find(item => item.id === productId);
    if (item) {
        const newQuantity = parseInt(quantity);
        if (newQuantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = newQuantity;
    }
    
    const updatedCart = calculateCartTotals(cart);
    saveCart(updatedCart);
    
    return updatedCart;
}

// Clear entire cart
function clearCart() {
    saveCart({
        items: [],
        total: 0,
        itemCount: 0
    });
}

// Get cart item count
function getCartItemCount() {
    const cart = getCart();
    return cart ? cart.itemCount : 0;
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart ? cart.total : 0;
}

// Update cart UI (cart icon badge, etc.)
function updateCartUI() {
    const itemCount = getCartItemCount();
    
    // Update cart badge
    const cartBadges = document.querySelectorAll('.cart-badge, [data-cart-count]');
    cartBadges.forEach(badge => {
        badge.textContent = itemCount;
        badge.style.display = itemCount > 0 ? 'flex' : 'none';
    });
    
    // Update cart link text if exists
    const cartLinks = document.querySelectorAll('[data-cart-link]');
    cartLinks.forEach(link => {
        if (itemCount > 0) {
            link.textContent = `Cart (${itemCount})`;
        } else {
            link.textContent = 'Cart';
        }
    });
}

// Show cart notification
function showCartNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #2d5a3d;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}

// Export functions for use in other scripts
window.Cart = {
    add: addToCart,
    remove: removeFromCart,
    updateQuantity: updateCartQuantity,
    clear: clearCart,
    get: getCart,
    getItemCount: getCartItemCount,
    getTotal: getCartTotal,
    updateUI: updateCartUI
};
