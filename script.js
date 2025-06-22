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

        // --- Image Gallery ---
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.getAttribute('data-image');
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // --- Price Calculation ---
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

        // --- PayPal Integration ---
        if (paypalContainer) {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=AZ2-stnQ_x1AHe9dMx2y2p0N9E5P_8a09NfW-Mh-4f4y_e4a_e-zT_D_p-e-v-C_e-Y_n-f-O_f-Z_c&currency=AUD&components=buttons`;
            script.onload = () => {
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
                                    value: totalValue
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            alert('Transaction completed by ' + details.payer.name.given_name);
                            window.location.href = 'thank-you.html';
                        });
                    },
                    onError: (err) => {
                        console.error("PayPal checkout error", err);
                        alert("An error occurred with your payment. Please try again.");
                    }
                }).render('#paypal-button-container');
            };
            document.head.appendChild(script);
        }
        
        // Initial price update
        updatePrice();
    }
}); 