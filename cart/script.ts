// Import authentication manager
import { AuthManager } from '../script.js';
import { Toast } from '../utils/toast.js';

interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    description: string;
}

interface Order {
    id: string;
    user: string;
    items: CartItem[];
    total: number;
    status: string;
    date: string;
}

const cartContainer = document.querySelector('.cart-items') as HTMLDivElement;
const navButtons = document.querySelectorAll(".navButtons") as NodeListOf<HTMLDivElement>;
const userSections = document.querySelectorAll(".userSection") as NodeListOf<HTMLDivElement>;
const logoutBtns = document.querySelectorAll(".logoutBtn") as NodeListOf<HTMLButtonElement>;

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

function displayCart(): void {
    if (!AuthManager.isAuthenticated()) {
        window.location.href = '../login/index.html';
        return;
    }

    const currentUser = AuthManager.getCurrentUser();
    const userEmail = currentUser.email;
    const cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');

    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart-message text-center py-12">
                    <div class="text-gray-500 text-xl mb-4">Your cart is empty</div>
                    <div class="text-gray-400 mb-6">Start shopping to add items to your cart!</div>
                    <a href="../products/index.html" class="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors">
                        Browse Products
                    </a>
                </div>
            `;
            return;
        }

        let total = 0;
        const cartHTML = cart.map((item: CartItem) => {
            total += item.price * item.quantity;
            return `
                <div class="cart-item bg-white rounded-lg shadow-md p-4 mb-4">
                    <div class="flex items-center gap-4">
                        <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-cover rounded-lg">
                        <div class="item-details flex-1">
                            <h4 class="font-semibold text-lg text-gray-900 mb-2">${item.title}</h4>
                            <p class="text-gray-600 text-sm mb-2">${item.description}</p>
                            <p class="text-gray-800 font-semibold text-lg">$${item.price.toFixed(2)}</p>
                            <div class="quantity-controls flex items-center gap-3 mt-3">
                                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                                        ${item.quantity <= 1 ? 'disabled' : ''} 
                                        class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                    <i class="fa-solid fa-minus text-sm"></i>
                                </button>
                                <span class="text-lg font-semibold w-12 text-center">${item.quantity}</span>
                                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                                        class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                                    <i class="fa-solid fa-plus text-sm"></i>
                                </button>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-semibold text-gray-900 mb-2">$${(item.price * item.quantity).toFixed(2)}</p>
                            <button class="remove-button bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors" 
                                    onclick="removeFromCart('${item.id}')">
                                <i class="fa-solid fa-trash mr-2"></i>Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        cartContainer.innerHTML = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-gray-900">Your Cart</h3>
                ${cartHTML}
                <div class="cart-summary bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-xl font-semibold text-gray-900">Total:</h4>
                        <span class="text-2xl font-bold text-gray-800">$${total.toFixed(2)}</span>
                    </div>
                    <button class="place-order-button w-full bg-gray-900 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-black transition-colors" 
                            onclick="placeOrder()">
                        <i class="fa-solid fa-shopping-cart mr-2"></i>Place Order
                    </button>
                </div>
            </div>
        `;
    }
}

function updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity < 1) return;

    const currentUser = AuthManager.getCurrentUser();
    const userEmail = currentUser.email;
    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');
    const itemIndex = cart.findIndex((item: CartItem) => item.id === productId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
        displayCart();
    }
}

function removeFromCart(productId: string): void {
    const currentUser = AuthManager.getCurrentUser();
    const userEmail = currentUser.email;
    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');
    cart = cart.filter((item: CartItem) => item.id !== productId);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    displayCart();
}

function placeOrder(): void {
    const currentUser = AuthManager.getCurrentUser();
    const userEmail = currentUser.email;
    const cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');

    if (cart.length === 0) {
        Toast.warning('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

    const order: Order = {
        id: Date.now().toString(),
        user: userEmail,
        items: cart,
        total: total,
        status: 'Pending',
        date: new Date().toISOString()
    };

    // Save order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear user's cart
    localStorage.setItem(`cart_${userEmail}`, '[]');

    Toast.success(`✅ Order placed successfully! Order ID: ${order.id}`);

    displayCart();
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

// Make functions available globally
(window as any).updateQuantity = updateQuantity;
(window as any).removeFromCart = removeFromCart;
(window as any).placeOrder = placeOrder;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateUIForLoginStatus();
    displayCart();
});
