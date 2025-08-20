// Import authentication manager
import { AuthManager, addToCart } from '../script.js';
import { formatPrice, generateStarRating } from '../utils/script.js';

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    description: string;
    category?: string;
    rating?: number;
    reviews?: number;
    inStock?: boolean;
}

// DOM elements
const navButtons = document.querySelectorAll(".navButtons") as NodeListOf<HTMLDivElement>;
const userSections = document.querySelectorAll(".userSection") as NodeListOf<HTMLDivElement>;
const logoutBtns = document.querySelectorAll(".logoutBtn") as NodeListOf<HTMLButtonElement>;
const wishlistContainer = document.getElementById("wishlistContainer") as HTMLDivElement;

// Function to check if user is logged in
function checkUserLoginStatus(): boolean {
    return AuthManager.isAuthenticated();
}

// Function to update UI based on login status
function updateUIForLoginStatus(): void {
    const isLoggedIn = checkUserLoginStatus();

    navButtons.forEach((nav) => {
        nav.style.display = isLoggedIn ? 'none' : '';
    });

    userSections.forEach((section) => {
        section.style.display = isLoggedIn ? '' : 'none';
    });

    // Show admin panel if user is admin
    const adminPanel = document.querySelector('.adminPanel') as HTMLElement;
    if (adminPanel) {
        const currentUser = AuthManager.getCurrentUser();
        adminPanel.style.display = (currentUser && currentUser.email === 'hassan@admin.com') ? '' : 'none';
    }
}

// Function to display wishlist
function displayWishlist(): void {
    if (!AuthManager.isAuthenticated()) {
        window.location.href = '../login/index.html';
        return;
    }

    const currentUser = AuthManager.getCurrentUser();
    const userEmail = currentUser.email;
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');

    if (wishlistContainer) {
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="text-center py-16">
                    <div class="text-gray-400 text-6xl mb-6">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                    <div class="text-gray-500 text-xl mb-4">Your wishlist is empty</div>
                    <div class="text-gray-400 mb-8">Start adding products you love!</div>
                    <a href="../products/index.html" class="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <i class="fa-solid fa-shopping-bag mr-2"></i>
                        Browse Products
                    </a>
                </div>
            `;
            return;
        }

        wishlistContainer.innerHTML = `
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                <p class="text-gray-600">You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${wishlist.map((product: Product) => `
                    <div class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
                        
                        <!-- Top section: title, price, icons -->
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex-1">
                                <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">${product.title}</h3>
                                <p class="text-xl font-bold text-gray-800 mb-2">${formatPrice(product.price)}</p>
                                ${product.category ? `<p class="text-sm text-gray-500 mb-2">${product.category}</p>` : ''}
                                ${product.rating ? `
                                    <div class="flex items-center gap-1 mb-2">
                                        <div class="flex text-yellow-400 text-sm">
                                            ${generateStarRating(product.rating, 5)}
                                        </div>
                                        <span class="text-xs text-gray-500">(${product.reviews || 0})</span>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="flex space-x-2 ml-2">
                                <!-- Remove from wishlist icon -->
                                <button onclick="removeFromWishlist('${product.id}')"
                                    class="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors group">
                                    <i class="fa-solid fa-trash text-red-600 group-hover:text-red-700"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Product image -->
                        <div class="relative mb-4">
                            <img src="${product.image}" alt="${product.title}" 
                                class="w-full h-48 object-cover rounded-xl cursor-pointer group-hover:scale-105 transition-transform duration-300" 
                                onclick="window.location.href='../productInfo/index.html?id=${product.id}'" />
                            ${product.inStock === false ? `
                                <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                    Out of Stock
                                </div>
                            ` : ''}
                        </div>

                        <!-- Action buttons -->
                        <div class="space-y-3">
                            <button onclick="window.location.href='../productInfo/index.html?id=${product.id}'"
                                class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                <i class="fa-solid fa-eye"></i>
                                View Details
                            </button>
                            <button onclick="addToCart('${product.id}')"
                                ${product.inStock === false ? 'disabled' : ''}
                                class="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900">
                                <i class="fa-solid fa-cart-plus"></i>
                                ${product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Function to remove product from wishlist
function removeFromWishlist(productId: string): void {
    const currentUser = AuthManager.getCurrentUser();
    const userEmail = currentUser.email;
    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
    wishlist = wishlist.filter((item: Product) => item.id !== productId);
    localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(wishlist));
    
    // Show removal notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fa-solid fa-trash"></i>
            <span>Product removed from wishlist</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
    
    displayWishlist();
}

// Function to handle logout
function logout(): void {
    AuthManager.clearAuth();
    updateUIForLoginStatus();
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 100);
}

// Add logout event listener
logoutBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateUIForLoginStatus();
    displayWishlist();
});

// Make functions available globally
(window as any).addToCart = addToCart;
(window as any).removeFromWishlist = removeFromWishlist;