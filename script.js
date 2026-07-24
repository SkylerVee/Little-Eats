let currentCartTotal = 0;

function addToOrder(dishName, price) {
    currentCartTotal += price;
    alert(`Added ${dishName} (KES ${price}) to your order!\nCurrent Cart Total: KES ${currentCartTotal}`);
    renderPayPalCheckout();
}

document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling
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

    // Quick order launcher
    const openOrderBtn = document.getElementById('open-order-btn');
    if (openOrderBtn) {
        openOrderBtn.addEventListener('click', () => {
            if (currentCartTotal <= 0) {
                alert('Your cart is empty! Click "+ Order" on any dish above to add items to your cart.');
            } else {
                alert(`Your current order total is KES ${currentCartTotal}. Complete payment below using PayPal.`);
                const orderSection = document.getElementById('paypal-button-container');
                if (orderSection) {
                    orderSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // Signature card clicks
    const gridCards = document.querySelectorAll('.grid-card');
    gridCards.forEach(card => {
        card.addEventListener('click', () => {
            const dishTitle = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const numericPrice = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
            
            addToOrder(dishTitle, numericPrice);
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(13, 13, 13, 0.95)';
            navbar.style.transition = 'background-color 0.3s ease';
        } else {
            navbar.style.backgroundColor = 'transparent';
        }
    });

    renderPayPalCheckout();
});

// PayPal SDK setup
function renderPayPalCheckout() {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) return;
    
    paypalContainer.innerHTML = '';

    paypal.Buttons({
        createOrder: function(data, actions) {
            if (currentCartTotal <= 0) {
                alert('Your order total is 0 KES. Please add items to your cart first!');
                return;
            }

            // Convert KES to USD (1 USD ≈ 130 KES)
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
                alert('Payment Successful! Thank you, ' + details.payer.name.given_name + '. Your order has been placed!');
                
                currentCartTotal = 0;
                renderPayPalCheckout();
                console.log('Transaction Completed:', details);
            });
        },

        onError: function(err) {
            console.error('PayPal Transaction Error:', err);
            alert('An error occurred during payment processing. Please try again.');
        }
    }).render('#paypal-button-container');
}