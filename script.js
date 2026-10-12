let currentCartTotal = 0;

function addToOrder(dishName, price) {
    currentCartTotal += price;
    alert(`Added ${dishName} (KES ${price}) to your order.\nCurrent Cart Total: KES ${currentCartTotal}`);
    renderPayPalCheckout();
}

document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-links a, .hero-content a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    const slideLeftBtn = document.getElementById('slide-left');
    const slideRightBtn = document.getElementById('slide-right');
    const signatureSlider = document.getElementById('signature-slider');

    if (slideLeftBtn && slideRightBtn && signatureSlider) {
        slideLeftBtn.addEventListener('click', () => {
            signatureSlider.scrollBy({ left: -300, behavior: 'smooth' });
        });
        slideRightBtn.addEventListener('click', () => {
            signatureSlider.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    const openOrderBtn = document.getElementById('open-order-btn');
    if (openOrderBtn) {
        openOrderBtn.addEventListener('click', () => {
            if (currentCartTotal <= 0) {
                alert('Your cart is empty. Please add items from the menu before reviewing your order.');
            } else {
                alert(`Current order total: KES ${currentCartTotal}. Complete your secure payment below.`);
                const orderSection = document.getElementById('paypal-button-container');
                if (orderSection) {
                    orderSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    renderPayPalCheckout();
});

function renderPayPalCheckout() {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) return;
    
    paypalContainer.innerHTML = '';

    paypal.Buttons({
        createOrder: function(data, actions) {
            if (currentCartTotal <= 0) {
                alert('Your order total is 0 KES. Please add items to your order first.');
                return;
            }

            let totalInUSD = (currentCartTotal / 130).toFixed(2);

            return actions.order.create({
                purchase_units: [{
                    description: "Little Eats Food Order",
                    amount: {
                        currency_code: "USD",
                        value: totalInUSD
                    }
                }]
            });
        },

        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Payment Successful. Thank you, ' + details.payer.name.given_name + '. Your order has been placed.');
                currentCartTotal = 0;
                renderPayPalCheckout();
            });
        },

        onError: function(err) {
            console.error('PayPal Transaction Error:', err);
            alert('An error occurred during payment processing. Please try again.');
        }
    }).render('#paypal-button-container');
}