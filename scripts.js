// =========================================================
// 1. SESSION CHECK - This runs immediately when the script loads
// =========================================================
(function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages that require login validation
    const securedPages = ['home.html', 'products.html', 'contact.html'];
    
    if (securedPages.includes(currentPage)) {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            // Use replace() to ensure the back button doesn't take them to the secured page
            window.location.replace('login.html');
            return; // Stop script execution on this page
        }
    }
    
    // Optional: On login.html, redirect if already logged in (better UX)
    if (currentPage === 'login.html' && sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.replace('home.html');
    }
})();


// =========================================================
// 2. MODAL FUNCTIONS (Used on home.html)
// =========================================================
function openModal() {
    document.getElementById('demoModal').style.display = "block";
}

function closeModal() {
    document.getElementById('demoModal').style.display = "none";
}

// Close the modal if the user clicks anywhere outside of the modal
window.onclick = function(event) {
    var modal = document.getElementById('demoModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}


// =========================================================
// 3. DYNAMIC CONTENT FUNCTION (Used on home.html)
// =========================================================
function toggleContent() {
    var content = document.getElementById('hidden-content');
    var button = document.getElementById('btn-toggle');
    
    if (content.style.display === "none") {
        content.style.display = "block";
        button.textContent = "Hide Text";
    } else {
        content.style.display = "none";
        button.textContent = "Show Text";
    }
}

// =========================================================
// 4. LOGOUT FUNCTION
// =========================================================
function logout() {
    sessionStorage.clear(); // Clears all session data, including 'isLoggedIn'
    window.location.replace('login.html');
}

// =========================================================
// 5. CAROUSEL LOGIC (Used on home.html)
// =========================================================
if (document.getElementById('image-carousel')) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        // Loop index to ensure we stay within bounds
        currentSlide = (index + totalSlides) % totalSlides; 
        
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.style.display = 'block'; // Show the current slide
                slide.setAttribute('data-visible', 'true'); // Automation verification target
            } else {
                slide.style.display = 'none'; // Hide others
                slide.setAttribute('data-visible', 'false');
            }
        });
    }

    // Event listeners for control buttons
    document.getElementById('btn-carousel-next').addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });

    document.getElementById('btn-carousel-prev').addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
    
    // Initialize the carousel
    showSlide(0); 
}

// =========================================================
// 6. PRODUCT GRID & LAZY LOADING LOGIC (products.html)
// =========================================================

const productGrid = document.getElementById('product-grid');
const filter = document.getElementById('category-filter');
let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        loadProducts(); // Initial load after fetching
    } catch (error) {
        console.error("Could not fetch products:", error);
        if (productGrid) {
            productGrid.innerHTML = `<p style="color:red;">Error loading product data. Check console.</p>`;
        }
    }
}

function loadProducts() {
    if (!productGrid) return; 

    // Get filter value
    const selectedCategory = filter ? filter.value : 'all';
    
    // Filter products
    const productsToDisplay = selectedCategory === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === selectedCategory);

    // Build the HTML for the grid
    let html = '';
    productsToDisplay.forEach(product => {
        const statusText = product.inStock ? 'In Stock' : `<span class="status-oos">Out of Stock</span>`;
        
        html += `
            <div class="product-card" data-product-id="${product.id}" data-category="${product.category}">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <span class="price">$${product.price.toFixed(2)}</span>
                <p>Status: ${statusText}</p>
                <div class="product-actions">
                    <input type="number" id="qty-${product.id}" value="1" min="1" class="quantity-input" ${product.inStock ? '' : 'disabled'}>
                    <button id="btn-add-to-cart-${product.id}" 
                            ${product.inStock ? '' : 'disabled'}
                            data-product-id="${product.id}"
                            data-product-name="${product.name}"
                            data-product-price="${product.price.toFixed(2)}">
                        ${product.inStock ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>
            </div>
        `;
    });

    productGrid.innerHTML = html;
    addCartEventListeners(); // Add event listeners after products are loaded
}

function addCartEventListeners() {
    document.querySelectorAll('.product-actions button').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
            const productPrice = parseFloat(event.target.dataset.productPrice);
            const quantityInput = document.getElementById(`qty-${productId}`);
            const quantity = parseInt(quantityInput.value);

            addToCart({ id: productId, name: productName, price: productPrice }, quantity);
        });
    });
}

function addToCart(product, quantity) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    
    if (cart[product.id]) {
        cart[product.id].quantity += quantity;
    } else {
        cart[product.id] = { ...product, quantity };
    }
    
    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} x ${product.name} added to cart!`);
    updateCartIcon();
}

function updateCartIcon() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const cartButton = document.getElementById('btn-cart');
    if (cartButton) {
        cartButton.textContent = `🛒 Cart (${totalItems})`;
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    let html = '';
    let subtotal = 0;

    if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }

    for (const productId in cart) {
        const item = cart[productId];
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        html += `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <div class="cart-item-controls">
                        <label for="cart-qty-${item.id}">Quantity:</label>
                        <input type="number" id="cart-qty-${item.id}" value="${item.quantity}" min="1" class="cart-quantity-input" data-product-id="${item.id}">
                        <button class="btn-remove-item" data-product-id="${item.id}">Remove</button>
                    </div>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    }

    cartItemsContainer.innerHTML = html;
    document.getElementById('cart-summary').style.display = 'block';

    // Calculate summary
    const taxRate = 0.05; // 5% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart-tax').textContent = tax.toFixed(2);
    document.getElementById('cart-total').textContent = total.toFixed(2);

    // Add event listeners for quantity changes and remove buttons
    document.querySelectorAll('.cart-quantity-input').forEach(input => {
        input.addEventListener('change', (event) => {
            const productId = event.target.dataset.productId;
            const newQuantity = parseInt(event.target.value);
            updateCartItemQuantity(productId, newQuantity);
        });
    });

    document.querySelectorAll('.btn-remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            removeCartItem(productId);
        });
    });
}

function updateCartItemQuantity(productId, newQuantity) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    if (cart[productId]) {
        cart[productId].quantity = newQuantity;
        sessionStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Re-render cart to update totals
        updateCartIcon();
    }
}

function removeCartItem(productId) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    if (cart[productId]) {
        delete cart[productId];
        sessionStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Re-render cart to update totals
        updateCartIcon();
    }
}

// Checkout button (placeholder)
const checkoutButton = document.getElementById('btn-checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        alert('Proceeding to checkout! (Not implemented in this demo)');
        // Here you would typically redirect to a checkout page or process the order
    });
}

// Initial render for cart page
if (currentPage === 'cart.html') {
    renderCart();
}

// Update cart icon on all pages that have it
updateCartIcon();

// Check if we are on the products page and initiate fetch
const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'products.html' || currentPage === 'products.html#') {
    // This simulates lazy loading by fetching the data when the DOM is ready
    document.addEventListener('DOMContentLoaded', fetchProducts);
}