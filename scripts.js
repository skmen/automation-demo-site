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
                <button id="btn-add-to-cart-${product.id}" 
                        ${product.inStock ? '' : 'disabled'}
                        data-product-name="${product.name}">
                    ${product.inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
            </div>
        `;
    });

    productGrid.innerHTML = html;
}

// Check if we are on the products page and initiate fetch
const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'products.html' || currentPage === 'products.html#') {
    // This simulates lazy loading by fetching the data when the DOM is ready
    document.addEventListener('DOMContentLoaded', fetchProducts);
}