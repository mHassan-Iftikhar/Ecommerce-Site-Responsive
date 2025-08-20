import { Toast } from '../utils/toast.js';
// DOM elements
const productDetailContainer = document.getElementById('productDetailContainer');
// Get product ID from URL parameters
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
// Function to render product detail
function renderProductDetail(product) {
    if (!productDetailContainer) {
        console.error('Product detail container not found in the DOM.');
        return;
    }
    productDetailContainer.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Product Image -->
            <div class="space-y-4">
                <img src="${product.image}" alt="${product.title}" 
                     class="w-full h-96 object-cover rounded-xl shadow-lg" />
            </div>
            
            <!-- Product Information -->
            <div class="space-y-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">${product.title}</h1>
                    <p class="text-2xl font-semibold text-gray-800">$${product.price}</p>
                </div>
                
                ${product.description ? `
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p class="text-gray-600 leading-relaxed">${product.description}</p>
                </div>
                ` : ''}
                
                ${product.category ? `
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Category</h3>
                    <span class="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        ${product.category}
                    </span>
                </div>
                ` : ''}
                
                ${product.rating ? `
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Rating</h3>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center">
                            ${renderStars(product.rating)}
                        </div>
                        <span class="text-gray-600">(${product.rating}/5)</span>
                        ${product.reviews ? `<span class="text-gray-500">• ${product.reviews} reviews</span>` : ''}
                    </div>
                </div>
                ` : ''}
                
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <button onclick="addToCart('${product.id}')" 
                            class="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2">
                        <i class="fa-solid fa-cart-plus"></i>
                        Add to Cart
                    </button>
                    <button onclick="addToWishlist('${product.id}')" 
                            class="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                        <i class="fa-regular fa-heart"></i>
                        Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
}
// Function to render star rating
function renderStars(rating) {
    const clampedRating = Math.max(0, Math.min(5, rating));
    const stars = Math.round(clampedRating);
    return Array(5)
        .fill(0)
        .map((_, i) => i < stars
        ? '<i class="fa-solid fa-star text-yellow-500"></i>'
        : '<i class="fa-regular fa-star text-gray-300"></i>')
        .join('');
}
// Function to add product to cart
function addToCart(productId) {
    const currentUser = window.AuthManager?.getCurrentUser();
    if (!currentUser) {
        console.warn('User is not logged in. Redirecting to login page.');
        window.location.href = '../login/index.html';
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p) => p.id === productId);
    if (product) {
        const userEmail = currentUser.email;
        let userCart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');
        const existingItem = userCart.find((item) => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        }
        else {
            userCart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem(`cart_${userEmail}`, JSON.stringify(userCart));
        console.log('Product added to cart:', product);
        Toast.success('Product added to cart!');
    }
}
// Function to add product to wishlist
function addToWishlist(productId) {
    const currentUser = window.AuthManager?.getCurrentUser();
    if (!currentUser) {
        console.warn('User is not logged in. Redirecting to login page.');
        window.location.href = '../login/index.html';
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p) => p.id === productId);
    if (product) {
        const userEmail = currentUser.email;
        let userWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
        const existingItem = userWishlist.find((item) => item.id === productId);
        if (existingItem) {
            console.warn('Product is already in wishlist:', product);
            Toast.warning('Product is already in your wishlist!');
        }
        else {
            userWishlist.push(product);
            localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(userWishlist));
            console.log('Product added to wishlist:', product);
            Toast.success('Product added to wishlist!');
        }
    }
}
// Function to load and display product
function loadProduct() {
    console.log('Loading product...');
    const productId = getProductIdFromUrl();
    if (!productId) {
        console.error('Product ID not found in URL.');
        if (productDetailContainer) {
            productDetailContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-red-500 text-xl mb-4">Product not found</div>
                    <a href="../products/index.html" class="text-gray-800 hover:underline">Back to Products</a>
                </div>
            `;
        }
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p) => p.id === productId);
    if (product) {
        renderProductDetail(product);
        document.title = `${product.title} - E-commerce Store`;
    }
    else {
        console.error('Product not found in localStorage.');
        if (productDetailContainer) {
            productDetailContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-red-500 text-xl mb-4">Product not found</div>
                    <a href="../products/index.html" class="text-gray-800 hover:underline">Back to Products</a>
                </div>
            `;
        }
    }
}
// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded.');
    loadProduct();
});
//# sourceMappingURL=script.js.map