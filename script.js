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
        const paypalContainer = document.getElementById('paypal-button-container');
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

        // --- Price Calculation & PayPal ---
        if (sizeSelect && quantitySelect && priceDisplay && paypalContainer) {
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

            // --- Render PayPal Buttons ---
            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color:  'gold',
                    shape:  'rect',
                    label:  'paypal'
                },
                createOrder: (data, actions) => {
                    const totalValue = updatePrice();
                    const selectedSizeOption = sizeSelect.options[sizeSelect.selectedIndex];
                    const description = `Moringa Powder - ${selectedSizeOption.text.split(' - ')[0]} x ${quantitySelect.value}`;
                    
                    return actions.order.create({
                        purchase_units: [{
                            description: description,
                            amount: {
                                value: totalValue,
                                currency_code: 'AUD'
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(order => {
                        orderStatusEl.textContent = 'Processing your order...';
                        // Call our serverless function
                        fetch('/.netlify/functions/process-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ order }),
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                orderStatusEl.textContent = 'Thank you! Your order has been received.';
                                // Optional: redirect to a thank you page
                                // window.location.href = 'thank-you.html';
                            } else {
                                orderStatusEl.textContent = 'There was an issue processing your order. Please contact support.';
                            }
                        })
                        .catch(error => {
                            console.error('Error calling serverless function:', error);
                            orderStatusEl.textContent = 'An error occurred. Please contact us.';
                        });
                    });
                },
                onError: (err) => {
                    console.error("PayPal checkout error", err);
                    orderStatusEl.textContent = 'An error occurred with payment. Please try again.';
                }
            }).render('#paypal-button-container');
            
            // Initial price update
            updatePrice();
        }
    }
});