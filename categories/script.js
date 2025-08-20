import { AuthManager } from '../script.js';
import { getAllProducts, formatPrice } from '../utils/script.js';
import { Toast } from '../utils/toast.js';
const sectionsContainer = document.getElementById('categorySections');
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
    catch { }
}
function addToCart(productId) {
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../login/index.html';
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (!product)
        return;
    const userEmail = currentUser.email;
    let userCart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');
    const existing = userCart.find((i) => i.id === productId);
    if (existing)
        existing.quantity += 1;
    else
        userCart.push({ ...product, quantity: 1 });
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(userCart));
    showToast('Product added to cart!', 'success');
}
function addToWishlist(productId) {
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../login/index.html';
        return;
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (!product)
        return;
    const userEmail = currentUser.email;
    let userWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
    const exists = userWishlist.find(i => i.id === productId);
    if (exists) {
        showToast('Product is already in your wishlist!', 'warning');
        return;
    }
    userWishlist.push(product);
    localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(userWishlist));
    showToast('Product added to wishlist!', 'success');
}
function renderCategory(title, items) {
    const content = items.length > 0 ? items.slice(0, 6).map(p => `
		<div class="w-[270px] group bg-white rounded-2xl shadow p-3 flex gap-3">
			<img src="${p.image}" alt="${p.title}" class="w-24 h-24 object-cover rounded-lg" />
			<div class="flex-1 min-w-0">
				<div class="text-sm font-medium text-gray-900 mb-1">${p.title}</div>
				<div class="text-sm font-semibold text-gray-800 mb-2">${formatPrice(p.price)}</div>
			</div>
		</div>
	`).join('') : `<div class="text-sm text-gray-500">No items found in ${title}</div>`;
    return `
		<section class="bg-white rounded-2xl shadow-md p-5">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-xl font-semibold text-gray-900">${title}</h2>
				<a href="../category/index.html?name=${encodeURIComponent(title)}" class="text-sm text-gray-700 hover:underline">View all</a>
			</div>
			<div class="flex gap-4">${content}</div>
		</section>
	`;
}
function render() {
    if (!sectionsContainer)
        return;
    const all = getAllProducts();
    const normalize = (v) => (v || '').trim();
    // Build unique category list dynamically from products
    const categorySet = new Set();
    all.forEach(p => {
        const name = normalize(p.category) || 'Uncategorized';
        categorySet.add(name);
    });
    const categoryNames = Array.from(categorySet).sort((a, b) => a.localeCompare(b));
    const sections = categoryNames
        .map(name => {
        const items = all.filter(p => (normalize(p.category) || 'Uncategorized').toLowerCase() === name.toLowerCase());
        return renderCategory(name, items);
    })
        .join('');
    sectionsContainer.innerHTML = sections || '<div class="text-gray-500">No categories found.</div>';
}
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
document.addEventListener('DOMContentLoaded', render);
//# sourceMappingURL=script.js.map