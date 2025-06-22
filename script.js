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

    // Optimized PayPal Hosted Button Loader
    const paypalHostedContainer = document.getElementById('paypal-hosted-button-container');
    if (paypalHostedContainer) {
        const hostedButtonId = paypalHostedContainer.dataset.hostedButtonId;
        if (hostedButtonId) {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=BAAvR6DiyzKb15OmvmOef-880T3liGnJna4Ghb_RmwL-CSfDn34xznqYOFvytR6v_DnqMl1THPbxzB-8Pk&components=hosted-buttons&disable-funding=venmo&currency=AUD';
            script.setAttribute('defer', '');
            script.onload = () => {
                paypal.HostedButtons({
                    hostedButtonId: hostedButtonId,
                }).render("#paypal-hosted-button-container");
            };
            document.head.appendChild(script);
        }
    }
}); 