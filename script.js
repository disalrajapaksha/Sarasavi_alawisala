// Cart array to store items
let cart = [];

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadCart();
    updateCartUI();


    // Menu Toggle
    let menu = document.querySelector('#menu-icon');
    let navbar = document.querySelector('.navbar');

    if (menu) { // Added check for menu existence
        menu.onclick = () => {
            menu.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        }
    }

    window.onscroll = () => {
        if (menu) { // Added check for menu existence
            menu.classList.remove('bx-x');
        }
        navbar.classList.remove('active');
    }

    // Reveal Animations
    const revealElements = document.querySelectorAll('.product-box, .heading, .about-text, .contact-box');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.onclick = () => {
            navbar.classList.remove('active');
        };
    });
});

// Search box toggle
let search = document.querySelector('.search-box');
let searchIcon = document.querySelector('#search-icon');

if (searchIcon) {
    searchIcon.onclick = () => {
        search.classList.toggle('active');
    };
}

// Shopping cart toggle
let cartElement = document.querySelector('.cart');
let cartIcon = document.querySelector('#cart-icon');
let closeCart = document.querySelector('#close-cart');

if (cartIcon) {
    cartIcon.onclick = () => {
        cartElement.classList.add('active');
    };
}

if (closeCart) {
    closeCart.onclick = () => {
        cartElement.classList.remove('active');
    };
}

// Add to cart functionality
const addCartButtons = document.querySelectorAll('.add-cart:not(.whatsapp-btn)');

addCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productName = this.getAttribute('data-name');
        const productPrice = parseFloat(this.getAttribute('data-price'));
        const productImage = this.getAttribute('data-image');

        addToCart(productName, productPrice, productImage);
    });
});

function addToCart(name, price, image) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        alert('Item already in cart!');
        return;
    }

    // Add new item to cart
    cart.push({
        name: name,
        price: price,
        image: image
    });

    // Save to localStorage
    saveCart();

    // Update UI
    updateCartUI();

    // Show cart
    cartElement.classList.add('active');

    // Success feedback
    alert('Added to cart!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartContent = document.querySelector('#cart-content');
    const cartCount = document.querySelector('#cart-count');
    const totalPrice = document.querySelector('#total-price');

    // Clear cart content
    cartContent.innerHTML = '';

    // Update cart count
    cartCount.textContent = cart.length;

    // Calculate total
    let total = 0;

    // Add cart items
    cart.forEach((item, index) => {
        total += item.price;

        const cartBox = document.createElement('div');
        cartBox.classList.add('cart-box');
        cartBox.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-img">
            <div class="cart-detail">
                <div class="cart-product-title">${item.name}</div>
                <div class="cart-price">Rs. ${item.price}</div>
                <i class='bx bx-trash cart-remove' onclick="removeFromCart(${index})"></i>
            </div>
        `;
        cartContent.appendChild(cartBox);
    });

    // Update total price
    totalPrice.textContent = `Rs. ${total}`;

    // Show empty message if cart is empty
    if (cart.length === 0) {
        cartContent.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
    }
}

function saveCart() {
    localStorage.setItem('sarasaviCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('sarasaviCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Checkout via WhatsApp
const checkoutBtn = document.querySelector('#checkout-btn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Create WhatsApp message
        let message = 'Hello! I would like to order:\n\n';
        let total = 0;

        cart.forEach(item => {
            message += `• ${item.name} - Rs. ${item.price}\n`;
            total += item.price;
        });

        message += `\nTotal: Rs. ${total}`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp (using a general number, you can change this)
        const whatsappURL = `https://wa.me/94740341255?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');

        // Clear cart after order
        cart = [];
        saveCart();
        updateCartUI();
        cartElement.classList.remove('active');
    });
}

// Product filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const productBoxes = document.querySelectorAll('.product-box');

filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        this.classList.add('active');

        // Get filter value
        const filterValue = this.getAttribute('data-filter');

        // Filter products
        productBoxes.forEach(box => {
            if (filterValue === 'all') {
                box.style.display = 'block';
            } else {
                const category = box.getAttribute('data-category');
                if (category === filterValue) {
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            }
        });
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search functionality
const searchInput = document.querySelector('.search-box input');

if (searchInput) {
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        productBoxes.forEach(box => {
            const productName = box.querySelector('h3').textContent.toLowerCase();
            const productDesc = box.querySelector('p').textContent.toLowerCase();

            if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });

        // Reset all filters when searching
        if (searchTerm === '') {
            productBoxes.forEach(box => box.style.display = 'block');
        }
    });
}