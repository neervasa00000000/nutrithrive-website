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
        const paypalContainer = document.getElementById('paypal-container-ERYQAP7ZAHDDQ');
        const orderStatusEl = document.getElementById('order-status');
    }
});