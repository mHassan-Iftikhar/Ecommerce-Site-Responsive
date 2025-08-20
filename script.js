class AuthManager {
    static getUserEmail() {
        const user = this.getCurrentUser();
        return user && user.email ? user.email : '';
    }
    static generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    static setAuth(userData) {
        const token = this.generateToken();
        const expiry = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toString());
    }
    static isAuthenticated() {
        const user = localStorage.getItem(this.USER_KEY);
        return !!user;
    }
    static getCurrentUser() {
        if (!this.isAuthenticated()) {
            return null;
        }
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }
    static clearAuth() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }
    static refreshToken() {
        if (this.isAuthenticated()) {
            const userData = this.getCurrentUser();
            this.setAuth(userData);
        }
    }
}
AuthManager.TOKEN_KEY = 'authToken';
AuthManager.USER_KEY = 'currentUser';
AuthManager.TOKEN_EXPIRY_KEY = 'tokenExpiry';
// Import utility functions
import { initializeProducts, getAllProducts, formatPrice, generateStarRating } from './utils/script.js';
// Fallback functions in case imports fail
function fallbackInitializeProducts() {
    const existingProducts = localStorage.getItem('products');
    if (!existingProducts) {
        const sampleProducts = [
            {
                id: '1',
                title: 'Premium Wireless Headphones',
                price: 199.99,
                image: './images/chair.jpg',
                description: 'High-quality wireless headphones with noise cancellation.',
                category: 'Electronics',
                rating: 4.8,
                reviews: 1247,
                inStock: true
            },
            {
                id: '2',
                title: 'Smart Fitness Watch',
                price: 299.99,
                image: './images/watch.jpg',
                description: 'Advanced fitness tracking watch with heart rate monitor.',
                category: 'Electronics',
                rating: 4.6,
                reviews: 892,
                inStock: true
            }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}
function fallbackGetAllProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}
function fallbackFormatPrice(price) {
    return `$${price.toFixed(2)}`;
}
function fallbackGenerateStarRating(rating, maxStars = 5) {
    const fullStars = Math.floor(rating);
    let starsHTML = '';
    for (let i = 0; i < maxStars; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fa-solid fa-star text-yellow-400"></i>';
        }
        else {
            starsHTML += '<i class="fa-solid fa-star text-gray-300"></i>';
        }
    }
    return starsHTML;
}
// DOM elements
const navButtons = document.querySelectorAll(".navButtons");
const userSections = document.querySelectorAll(".userSection");
// const profileIcon = document.getElementById("profileIcon") as HTMLAnchorElement;
const logoutBtns = document.querySelectorAll(".logoutBtn");
const productsContainer = document.getElementById("productsContainer");
const collectionsContainer = document.getElementById('collectionsContainer');
// Function to check if user is logged in
function checkUserLoginStatus() {
    return AuthManager.isAuthenticated();
}
// Function to update UI based on login status
function updateUIForLoginStatus() {
    const isLoggedIn = checkUserLoginStatus();
    navButtons.forEach((nav) => {
        nav.style.display = isLoggedIn ? 'none' : '';
    });
    userSections.forEach((section) => {
        section.style.display = isLoggedIn ? '' : 'none';
    });
    // Do not auto-render products here; handled on specific pages
}
// Function to filter products
function filterProducts(products) {
    const searchInput = document.getElementById('search');
    const minInput = document.getElementById('min');
    const maxInput = document.getElementById('max');
    let filteredProducts = [...products];
    // Apply search filter
    if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm));
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
    return filteredProducts;
}
function getLoginPath() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    return pathParts.length > 1 ? '../login/index.html' : './login/index.html';
}
// Function to add product to cart
function addToCart(productId) {
    if (!AuthManager.isAuthenticated()) {
        window.location.href = getLoginPath();
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p) => p.id === productId);
    if (product) {
        const currentUser = AuthManager.getCurrentUser();
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
                quantity: 1
            });
        }
        localStorage.setItem(`cart_${userEmail}`, JSON.stringify(userCart));
        // Toast message
        window.Toast?.success('Product added to cart!');
    }
}
// Function to add product to wishlist
function addToWishlist(productId) {
    if (!AuthManager.isAuthenticated()) {
        window.location.href = getLoginPath();
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p) => p.id === productId);
    if (product) {
        const currentUser = AuthManager.getCurrentUser();
        const userEmail = currentUser.email;
        // Get user-specific wishlist
        let userWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
        const existingItem = userWishlist.find((item) => item.id === productId);
        if (existingItem) {
            window.Toast?.warning('Product is already in your wishlist!');
        }
        else {
            userWishlist.push(product);
            localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(userWishlist));
            window.Toast?.success('Product added to wishlist!');
        }
    }
}
// Updated displayProducts function to include wishlist functionality and click navigation
function displayProducts() {
    // Try to use imported functions, fallback if they fail
    let products;
    let formatPriceFunc;
    let generateStarRatingFunc;
    try {
        products = getAllProducts();
        formatPriceFunc = formatPrice;
        generateStarRatingFunc = generateStarRating;
    }
    catch (error) {
        products = fallbackGetAllProducts();
        formatPriceFunc = fallbackFormatPrice;
        generateStarRatingFunc = fallbackGenerateStarRating;
    }
    const filteredProducts = filterProducts(products);
    // ✅ Randomize and take 6 products
    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
    const limitedProducts = shuffled.slice(0, 6);
    if (productsContainer) {
        productsContainer.innerHTML = `
			<div class="flex flex-wrap justify-center gap-6">
				${limitedProducts.map((product) => `
					<div class="flex flex-col justify-between relative bg-white rounded-2xl shadow-md p-4 w-71 transition hover:shadow-lg cursor-pointer" 
						 onclick="window.location.href='./productInfo/index.html?id=${product.id}'">
						
						<!-- Top section: title, price, icons -->
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<h3 class="text-base font-medium text-gray-900 mb-1">${product.title}</h3>
								<p class="text-sm font-semibold text-gray-800 mb-2">${formatPriceFunc(product.price)}</p>
								${product.category ? `<p class="text-xs text-gray-500 mb-2">${product.category}</p>` : ''}
								${product.rating ? `
									<div class="flex items-center gap-1 mb-2">
										<div class="flex text-yellow-400 text-xs">
											${generateStarRatingFunc(product.rating, 5)}
										</div>
										<span class="text-xs text-gray-500">(${product.reviews || 0})</span>
									</div>
								` : ''}
							</div>
                            <div class="flex space-x-2 ml-2">
                                <!-- Wishlist icon -->
                                <button onclick="event.stopPropagation(); addToWishlist('${product.id}')"
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <i class="fa-regular fa-heart text-gray-600"></i>
                                </button>
                                <!-- Cart icon -->
                                <button onclick="event.stopPropagation(); addToCart('${product.id}')"
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <i class="fa-solid fa-bag-shopping text-gray-600"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Product image -->
                        <div class="mt-4 relative">
                            <img src="${product.image}" alt="${product.title}" 
                                class="w-full h-56 object-cover rounded-xl" />
                            ${product.inStock === false ? `
                                <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    Out of Stock
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}
// Render collections by category on the homepage
function renderCollections() {
    if (!collectionsContainer)
        return;
    const allProducts = getAllProducts();
    if (!allProducts || allProducts.length === 0) {
        collectionsContainer.innerHTML = '';
        return;
    }
    const categories = [
        { name: 'Shoes', keywords: ['shoe', 'sneaker', 'runner', 'boot', 'nike', 'adidas', 'puma'] },
        { name: 'Clothes', keywords: ['shirt', 'pant', 'jeans', 'dress', 'fashion', 't-shirt', 'jacket', 'hoodie', 'clothes', 'apparel'] },
        { name: 'Electronics', keywords: ['electronic', 'watch', 'headphone', 'speaker', 'camera', 'smart', 'phone', 'laptop', 'bluetooth', 'smart home'] },
        { name: 'Home Appliances', keywords: ['home', 'kitchen', 'appliance', 'coffee', 'microwave', 'vacuum', 'oven', 'blender', 'home & kitchen', 'furniture', 'chair'] },
    ];
    const normalize = (value) => (value || '').toLowerCase();
    function productsForCategory(spec) {
        const name = spec.name.toLowerCase();
        const byCategory = allProducts.filter(p => {
            const c = normalize(p.category);
            return c === name || (c && c.includes(name));
        });
        if (byCategory.length > 0)
            return byCategory;
        // Fallback: keyword match on title/description/category
        return allProducts.filter(p => {
            const hay = `${normalize(p.title)} ${normalize(p.description)} ${normalize(p.category)}`;
            return spec.keywords.some(k => hay.includes(k));
        });
    }
    const html = categories.map(spec => {
        const items = productsForCategory(spec).slice(0, 6);
        const itemsHTML = items.length > 0 ? items.map((product) => `
            <div class="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition cursor-pointer" onclick="window.location.href='./productInfo/index.html?id=${product.id}'">
                <div class="relative w-24 h-24 shrink-0">
                    <img src="${product.image}" alt="${product.title}" class="w-24 h-24 object-cover rounded-lg" />
                    ${product.inStock === false ? `
                        <div class=\"absolute top-1 right-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full\">Out of Stock</div>
                    ` : ''}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate mb-1">${product.title}</div>
                    <div class="text-sm font-semibold text-gray-600 mb-2">${formatPrice(product.price)}</div>
                </div>
            </div>
        `).join('') : `
            <div class="col-span-full flex items-center justify-center text-sm text-gray-500 py-6">
                No items found in ${spec.name}
            </div>
        `;
        return `
            <div class="bg-white rounded-2xl shadow-md p-5">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-gray-900">${spec.name}</h3>
                    <a href="./category/index.html?name=${encodeURIComponent(spec.name)}" class="text-sm text-gray-700 hover:underline">View all</a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${itemsHTML}
                </div>
            </div>
        `;
    }).join('');
    collectionsContainer.innerHTML = html;
}
// Function to handle logout
function logout() {
    AuthManager.clearAuth();
    updateUIForLoginStatus();
    setTimeout(() => {
        window.location.href = './index.html';
    }, 100);
}
// Add logout event listener
logoutBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});
// Set initial display states
userSections.forEach((section) => {
    section.style.display = 'none';
});
navButtons.forEach((nav) => {
    nav.style.display = '';
});
// Add event listeners for search and filter
function setupSearchAndFilter() {
    const searchInput = document.getElementById('search');
    const minInput = document.getElementById('min');
    const maxInput = document.getElementById('max');
    if (searchInput) {
        searchInput.addEventListener('input', displayProducts);
    }
    if (minInput) {
        minInput.addEventListener('input', (e) => {
            const input = e.target;
            if (input.value !== '' && parseFloat(input.value) < 0) {
                input.value = '0';
            }
            displayProducts();
        });
    }
    if (maxInput) {
        maxInput.addEventListener('input', (e) => {
            const input = e.target;
            if (input.value !== '' && parseFloat(input.value) < 0) {
                input.value = '0';
            }
            displayProducts();
        });
    }
}
updateUIForLoginStatus();
document.addEventListener('DOMContentLoaded', () => {
    // Force initialize products
    try {
        initializeProducts();
    }
    catch (error) {
        fallbackInitializeProducts();
    }
    updateUIForLoginStatus();
    setupSearchAndFilter();
    renderCollections();
    // Always try to display products if container exists
    if (productsContainer) {
        displayProducts();
    }
});
// Make addToCart function available globally
window.addToCart = addToCart;
// Make addToWishlist function available globally
window.addToWishlist = addToWishlist;
// Expose AuthManager globally for pages that rely on window access
window.AuthManager = AuthManager;
// Export functions and classes for other modules
export { checkUserLoginStatus, updateUIForLoginStatus, logout, AuthManager, addToCart, addToWishlist };
//# sourceMappingURL=script.js.map