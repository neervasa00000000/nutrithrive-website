document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('no-scroll');
        });
    }

    // New Product Detail Page Logic
    if (document.body.classList.contains('product-page')) {
        const mainImage = document.getElementById('main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const sizeSelect = document.getElementById('size-select');
        const quantitySelect = document.getElementById('quantity-select');
        const priceDisplay = document.getElementById('product-price');
        const paypalContainer = document.getElementById('paypal-container-ERYQAP7ZAHDDQ');
        const orderStatusEl = document.getElementById('order-status');

        // --- Image Gallery ---
        if (mainImage && thumbnails.length > 0) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    mainImage.src = this.getAttribute('data-image');
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }

        // --- Price Calculation ---
        if (sizeSelect && quantitySelect && priceDisplay) {
            function updatePrice() {
                const selectedSizeOption = sizeSelect.options[sizeSelect.selectedIndex];
                const price = parseFloat(selectedSizeOption.getAttribute('data-price'));
                const quantity = parseInt(quantitySelect.value);
                const total = (price * quantity).toFixed(2);
                priceDisplay.textContent = `$${total} AUD`;
                return total;
            }

            sizeSelect.addEventListener('change', updatePrice);
            quantitySelect.addEventListener('change', updatePrice);

            // Initial price update
            updatePrice();
        }
    }
});