import { AuthManager } from '../script.js';
import { getAllProducts, formatPrice } from '../utils/script.js';
import { Toast } from '../utils/toast.js';

interface Product {
	id: string;
	title: string;
	price: number;
	image: string;
	description?: string;
	category?: string;
	rating?: number;
	reviews?: number;
	inStock?: boolean;
}

const titleEl = document.getElementById('categoryTitle') as HTMLHeadingElement;
const grid = document.getElementById('categoryProductsContainer') as HTMLDivElement;

Toast.init();

function addToCart(productId: string): void {
	const currentUser = AuthManager.getCurrentUser();
	if (!currentUser) {
		window.location.href = '../login/index.html';
		return;
	}
	const products = getAllProducts();
	const product = products.find(p => p.id === productId);
	if (!product) return;
	const userEmail = currentUser.email;
	let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || '[]');
	const existing = cart.find((i: any) => i.id === productId);
	if (existing) existing.quantity += 1; else cart.push({ ...product, quantity: 1 });
	localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
	Toast.success('Product added to cart!');
}

function addToWishlist(productId: string): void {
	const currentUser = AuthManager.getCurrentUser();
	if (!currentUser) {
		window.location.href = '../login/index.html';
		return;
	}
	const products = getAllProducts();
	const product = products.find(p => p.id === productId);
	if (!product) return;
	const userEmail = currentUser.email;
	let wishlist: Product[] = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`) || '[]');
	if (wishlist.find(p => p.id === productId)) {
		Toast.warning('Product is already in your wishlist!');
		return;
	}
	wishlist.push(product);
	localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(wishlist));
	Toast.success('Product added to wishlist!');
}

function render(): void {
	if (!grid) return;
	const params = new URLSearchParams(window.location.search);
	const rawName = params.get('name') || '';
	const name = rawName.trim();
	if (titleEl) titleEl.textContent = name || 'Category';

	const all = getAllProducts();
	const lower = (v?: string) => (v || '').toLowerCase();
	const keywords = name.toLowerCase();

	const filtered = all.filter(p => {
		const hay = `${lower(p.title)} ${lower(p.description)} ${lower(p.category)}`;
		return hay.includes(keywords);
	});

	if (filtered.length === 0) {
		grid.innerHTML = `<div class="col-span-full text-center text-gray-500 py-12">No products found in ${name}</div>`;
		return;
	}

	grid.innerHTML = filtered.map(p => `
		<div class="relative bg-white rounded-2xl shadow-md p-4 transition hover:shadow-lg h-85 flex flex-col justify-between cursor-pointer" onclick="window.location.href='../productInfo/index.html?id=${p.id}'">
			<div class="flex justify-between  w-[13vw] items-start" onclick="event.stopPropagation()">
				<div>
					<h3 class="text-base font-medium text-gray-900">${p.title}</h3>
					<p class="text-sm font-semibold text-gray-700">${formatPrice(p.price)}</p>
				</div>
				<div class="flex space-x-2">
					<button onclick="addToWishlist('${p.id}'); event.stopPropagation();" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
						<i class="fa-regular fa-heart text-gray-600"></i>
					</button>
					<button onclick="addToCart('${p.id}'); event.stopPropagation();" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
						<i class="fa-solid fa-bag-shopping text-gray-600"></i>
					</button>
				</div>
			</div>
			<img src="${p.image}" alt="${p.title}" class="w-full h-56 object-cover rounded-xl" />
		</div>
	`).join('');
}

(window as any).addToCart = addToCart;
(window as any).addToWishlist = addToWishlist;

document.addEventListener('DOMContentLoaded', render);
