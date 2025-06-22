document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.querySelector('body');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            body.classList.toggle('no-scroll');
        });
    }

    // Product detail page logic
    if (document.querySelector('.product-detail-section')) {
        const sizeSelect = document.getElementById('size-select');
        const quantityInput = document.getElementById('quantity-input');
        const paypalContainer = document.getElementById('paypal-button-container');

        if (paypalContainer) {
            // Load PayPal script
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=AZ2-stnQ_x1AHe9dMx2y2p0N9E5P_8a09NfW-Mh-4f4y_e4a_e-zT_D_p-e-v-C_e-Y_n-f-O_f-Z_c&currency=AUD';
            script.onload = () => {
                renderPayPalButton();
            };
            document.head.appendChild(script);

            function renderPayPalButton() {
                paypal.Buttons({
                    style: {
                        shape: 'rect',
                        color: 'gold',
                        layout: 'vertical',
                        label: 'paypal',
                    },
                    createOrder: function(data, actions) {
                        const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
                        const price = parseFloat(selectedOption.getAttribute('data-price'));
                        const quantity = parseInt(quantityInput.value);
                        const total = (price * quantity).toFixed(2);

                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: total,
                                    currency_code: 'AUD'
                                },
                                description: `Moringa Powder - ${selectedOption.text} x ${quantity}`
                            }]
                        });
                    },
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(function(details) {
                            alert('Transaction completed by ' + details.payer.name.given_name + '!');
                            // Redirect to a thank you page or show a success message
                            window.location.href = 'thank-you.html';
                        });
                    },
                    onError: function(err) {
                        console.error('An error occurred with the PayPal button:', err);
                        alert('An error occurred. Please try again.');
                    }
                }).render('#paypal-button-container');
            }
        }
    }
}); 