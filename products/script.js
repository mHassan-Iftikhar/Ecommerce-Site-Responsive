import { AuthManager } from '../script.js';
import { Toast } from '../utils/toast.js';
// Ensure toast container exists
Toast.init();
function showToast(message, type = 'info') {
    try {
        switch (type) {
            case 'success':
                Toast.success(message);
                break;
            case 'warning':
                Toast.warning(message);
                break;
            case 'error':
                Toast.error(message);
                break;
            default:
                Toast.info(message);
        }
    }
    catch (_) {
        const fallback = document.createElement('div');
        const bg = type === 'success' ? '#16a34a' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6';
        fallback.style.cssText = `position:fixed;top:20px;right:20px;z-index:10000;background:${bg};color:#fff;padding:12px 20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);font-family:Poppins, sans-serif;`;
        fallback.textContent = message;
        document.body.appendChild(fallback);
        setTimeout(() => fallback.remove(), 2500);
    }
}
// DOM elements
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('search');
const minInput = document.getElementById('min');
const maxInput = document.getElementById('max');
// Get products from localStorage
let products = JSON.parse(localStorage.getItem('products') || '[]');
// Add sample products if none exist
if (products.length === 0) {
    localStorage.setItem('products', JSON.stringify(products));
}
// Function to render products
function renderProducts(productsToRender) {
    if (!productsContainer)
        return;
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-gray-500 text-xl mb-4">No products found</div>
                <div class="text-gray-400">Try adjusting your search or filters</div>
            </div>
        `;
        return;
    }
    // Ensure container has grid classes (in case HTML was changed)
    productsContainer.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-6', 'items-stretch', 'content-start', 'justify-items-stretch');
    productsContainer.innerHTML = productsToRender.map((product) => `
        <div class="relative bg-white rounded-2xl shadow-md p-4 transition hover:shadow-lg min-h-80 h-full flex flex-col justify-between cursor-pointer" onclick="navigateToProduct('${product.id}')">
            <!-- Top section: title, price, icons -->
            <div class="flex justify-between items-start" onclick="event.stopPropagation()">
                <div>
                    <h3 class="text-base font-medium text-gray-900">${product.title}</h3>
                    <p class="text-sm font-semibold text-gray-700">$${product.price}</p>
                </div>
                <div class="flex space-x-2">
                    <!-- Wishlist icon -->
                    <button onclick="addToWishlist('${product.id}'); event.stopPropagation();"
                        class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                        <i class="fa-regular fa-heart text-gray-600"></i>
                    </button>
                    <!-- Cart icon -->
                    <button onclick="addToCart('${product.id}'); event.stopPropagation();"
                        class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                        <i class="fa-solid fa-bag-shopping text-gray-600"></i>
                    </button>
                </div>
            </div>

            <!-- Product image -->
            <img src="${product.image}" alt="${product.title}" 
                class="w-full h-56 object-cover rounded-xl" />
        </div>
    `).join('');
}
// Function to filter products
function filterProducts() {
    let filteredProducts = [...products];
    // Apply search filter
    if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)));
    }
    // Apply price range filter
    if (minInput && minInput.value !== '') {
        const minPrice = Math.max(0, parseFloat(minInput.value));
        minInput.value = minPrice.toString();
        filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
    }
    if (maxInput && maxInput.value !== '') {
        const maxPrice = Math.max(0, parseFloat(maxInput.value));
        maxInput.value = maxPrice.toString();
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
    renderProducts(filteredProducts);
}
// Function to add product to cart
function addToCart(productId) {
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../login/index.html';
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p) => p.id === productId);
    if (product) {
        const userEmail = currentUser.email;
        // Get user-specific cart
        let userCart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');
        const existingItem = userCart.find((item) => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        }
        else {
            userCart.push({
                ...product,
                quantity: 1,
            });
        }
        localStorage.setItem(`cart_${userEmail}`, JSON.stringify(userCart));
        console.log('Product added to cart:', product);
        showToast('Product added to cart!', 'success');
    }
}
// Function to add product to wishlist
function addToWishlist(productId) {
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../login/index.html';
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p) => p.id === productId);
    if (product) {
        const userEmail = currentUser.email;
        // Get user-specific wishlist
        let userWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
        const existingItem = userWishlist.find((item) => item.id === productId);
        if (existingItem) {
            showToast('Product is already in your wishlist!', 'warning');
        }
        else {
            userWishlist.push(product);
            localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(userWishlist));
            console.log('Product added to wishlist:', product);
            showToast('Product added to wishlist!', 'success');
        }
    }
}
// Function to navigate to product detail page
function navigateToProduct(productId) {
    window.location.href = `../productInfo/index.html?id=${productId}`;
}
// Event listeners
if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
}
if (minInput) {
    minInput.addEventListener('input', filterProducts);
}
if (maxInput) {
    maxInput.addEventListener('input', filterProducts);
}
// Make functions available globally
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.navigateToProduct = navigateToProduct; // Make navigateToProduct available globally
// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in and show admin panel if admin
    const adminPanel = document.querySelector('.adminPanel');
    if (adminPanel) {
        const currentUser = AuthManager.getCurrentUser();
        adminPanel.style.display = (currentUser && currentUser.email === 'hassan@admin.panel') ? '' : 'none';
    }
    // Display products
    products = JSON.parse(localStorage.getItem('products') || '[]');
    renderProducts(products);
});
// Attach event listeners to buttons
document.addEventListener('DOMContentLoaded', () => {
    console.log('Products page loaded.');
    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = button.getAttribute('data-product-id');
            if (productId) {
                addToCart(productId);
            }
        });
    });
    // Add event listeners for "Add to Wishlist" buttons
    document.querySelectorAll('.add-to-wishlist-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = button.getAttribute('data-product-id');
            if (productId) {
                addToWishlist(productId);
            }
        });
    });
});
//# sourceMappingURL=script.js.map