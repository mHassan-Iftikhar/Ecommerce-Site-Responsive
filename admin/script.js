import { AuthManager } from '../script.js';
import { Toast } from '../utils/toast.js';
const ADMIN_EMAIL = 'hassan@admin.panel';
const adminContainer = document.querySelector('.admin-container');
// Sidebar controls
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeSidebar = document.getElementById('closeSidebar');
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    overlay.classList.toggle('active');
    if (window.innerWidth < 768) {
        closeSidebar.style.display = sidebar.classList.contains('collapsed') ? 'none' : 'flex';
    }
}
menuToggle?.addEventListener('click', toggleSidebar);
closeSidebar?.addEventListener('click', toggleSidebar);
overlay?.addEventListener('click', toggleSidebar);
// Close on mobile when clicking nav item
Array.from(document.querySelectorAll('nav button')).forEach((btn) => {
    btn.addEventListener('click', () => {
        if (window.innerWidth < 768)
            toggleSidebar();
    });
});
// Initialize collapsed on mobile
if (window.innerWidth < 768) {
    sidebar.classList.add('collapsed');
    closeSidebar.style.display = 'none';
}
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        sidebar.classList.remove('collapsed');
        overlay.classList.remove('active');
        closeSidebar.style.display = 'none';
    }
    else {
        closeSidebar.style.display = sidebar.classList.contains('collapsed') ? 'none' : 'flex';
    }
});
try {
    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    const demoIds = new Set(['1001', '1002', '1003']);
    if (Array.isArray(existing) && existing.length && existing.every((o) => demoIds.has(String(o.id)))) {
        localStorage.removeItem('orders');
    }
}
catch { }
function showDashboard() {
    if (!adminContainer)
        return;
    const user = JSON.parse(localStorage.getItem('user') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    adminContainer.innerHTML = `
		<div id="mainPanel" class="main-panel">
			<h2 class="panel-title text-2xl font-medium mb-6">Dashboard</h2>
			<div class="flex flex-wrap gap-6 justify-center md:justify-start">
				<div class="bg-white rounded-xl shadow p-6 w-full max-w-xs h-32 flex flex-col justify-center items-center">
					<span class="text-base font-light text-gray-700">Total Users</span>
					<span class="text-3xl font-bold text-green-600">${user.length}</span>
				</div>
				<div class="bg-white rounded-2xl shadow p-6 w-full max-w-xs h-32 flex flex-col justify-center items-center">
					<span class="text-base font-light text-gray-700">Total Products</span>
					<span class="text-3xl font-bold text-green-600">${products.length}</span>
				</div>
			</div>
		</div>
	`;
}
function showUsers() {
    if (!adminContainer)
        return;
    const user = JSON.parse(localStorage.getItem('user') || '[]');
    adminContainer.innerHTML = `
		<div id="mainPanel" class="main-panel">
			<h2 class="panel-title text-2xl font-medium mb-6">Users</h2>
			<div class="grid-responsive">
				${user
        .map((u) => `
						<div class="bg-white rounded-xl shadow p-5 flex items-center gap-4 h-48 card-responsive relative">
							<button data-email="${u.email}" data-action="delete-user" class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600 hover:text-red-700 font-bold text-lg" title="Delete User">
								✕
							</button>
							<div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-600">
								${u.username.charAt(0).toUpperCase()}
							</div>
							<div>
								<div class="text-lg font-semibold text-gray-800">${u.username}</div>
								<div class="text-gray-500 text-sm">${u.email}</div>
							</div>
						</div>
					`)
        .join('')}
			</div>
		</div>
	`;
    // Add event listeners for delete buttons
    Array.from(document.querySelectorAll('[data-action="delete-user"]')).forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const email = btn.getAttribute('data-email');
            if (email && confirm(`Are you sure you want to delete user with email: ${email}?`)) {
                let users = JSON.parse(localStorage.getItem('user') || '[]');
                users = users.filter((u) => u.email !== email);
                localStorage.setItem('user', JSON.stringify(users));
                Toast.success('User deleted successfully!');
                showUsers(); // Refresh the users list
            }
        });
    });
}
function showProducts() {
    if (!adminContainer)
        return;
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    let editProductId = null;
    adminContainer.innerHTML = `
		<div id="mainPanel" class="main-panel">
			<h2 class="panel-title text-2xl font-medium mb-4">Products</h2>
			<div class="mb-6 w-full">
				<input type="text" id="searchBar" placeholder="Search products by name..." class="border border-gray-300 rounded-lg p-2 w-full max-w-2xl" />
			</div>
			<div class="addProduct w-full max-w-2xl h-auto bg-gray-50 p-4 rounded-lg mb-6">
				<input type="text" id="productName" placeholder="Product Name" class="border p-2 rounded-lg w-full mb-2" />
				<input type="number" id="productPrice" placeholder="Product Price" class="border p-2 rounded-lg w-full mb-2" />
				<input type="text" id="productImage" placeholder="Product Image URL" class="border p-2 rounded-lg w-full mb-2" />
				<textarea id="productDescription" placeholder="Product Description" class="border p-2 rounded-lg w-full mb-2"></textarea>
				<input type="number" id="productRating" placeholder="Product Rating (0-100)" class="border p-2 rounded-lg w-full mb-2" />
				<input type="text" id="productCategory" placeholder="Product Category" class="border p-2 rounded-lg w-full mb-2" />
				<div class="flex gap-2 flex-wrap">
					<button id="addProductBtn" class="bg-green-500 text-white rounded-lg px-4 py-2">Add Product</button>
					<button id="saveChangesBtn" class="hidden bg-gray-900 text-white rounded-lg px-4 py-2">Save Changes</button>
				</div>
			</div>
			<div id="productsList" class="grid-responsive">${renderProducts(products)}</div>
		</div>
	`;
    const nameInput = document.getElementById('productName');
    const priceInput = document.getElementById('productPrice');
    const imageInput = document.getElementById('productImage');
    const addProductBtn = document.getElementById('addProductBtn');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const searchBar = document.getElementById('searchBar');
    const productsList = document.getElementById('productsList');
    addProductBtn.addEventListener('click', () => {
        const title = nameInput.value.trim();
        const price = Number(priceInput.value);
        const image = imageInput.value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const rating = Number(document.getElementById('productRating').value);
        const category = document.getElementById('productCategory').value.trim();
        if (rating < 0 || rating > 5) {
            Toast.warning('Rating must be between 0 and 5.');
            return;
        }
        if (!title || !price || !image || !description || !category) {
            Toast.warning('Please fill all required fields.');
            return;
        }
        const newProduct = { id: Date.now().toString(), title, price, image, description, rating, category };
        let all = JSON.parse(localStorage.getItem('products') || '[]');
        all.push(newProduct);
        localStorage.setItem('products', JSON.stringify(all));
        showProducts();
    });
    saveChangesBtn.addEventListener('click', () => {
        if (!editProductId)
            return;
        const title = nameInput.value.trim();
        const price = Number(priceInput.value);
        const image = imageInput.value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const rating = Number(document.getElementById('productRating').value);
        const category = document.getElementById('productCategory').value.trim();
        if (rating < 0 || rating > 5) {
            Toast.warning('Rating must be between 0 and 5.');
            return;
        }
        if (!title || !price || !image || !description || !category) {
            Toast.warning('Please fill all required fields.');
            return;
        }
        let all = JSON.parse(localStorage.getItem('products') || '[]');
        all = all.map((p) => p.id === editProductId ? { ...p, title, price, image, description, rating, category } : p);
        localStorage.setItem('products', JSON.stringify(all));
        editProductId = null;
        nameInput.value = '';
        priceInput.value = '';
        imageInput.value = '';
        document.getElementById('productDescription').value = '';
        document.getElementById('productRating').value = '';
        document.getElementById('productCategory').value = '';
        addProductBtn.classList.remove('hidden');
        saveChangesBtn.classList.add('hidden');
        showProducts();
    });
    attachProductEvents();
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.trim().toLowerCase();
        if (query === '') {
            productsList.innerHTML = renderProducts(products);
            attachProductEvents();
            return;
        }
        const filtered = products.filter((p) => p.title.toLowerCase().includes(query));
        productsList.innerHTML = renderProducts(filtered);
        attachProductEvents();
    });
    function renderProducts(list) {
        return list.map((product) => `
			<div class="bg-white rounded-xl shadow p-4 h-auto flex flex-col justify-between card-responsive">
				<div>
					<div class="flex justify-between items-center mb-2">
						<span class="text-lg font-semibold text-gray-800">${product.title}</span>
						<div class="flex gap-3">
							<button data-id="${product.id}" data-action="edit" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
								<i class="fa-regular fa-pen-to-square text-gray-600"></i>
							</button>
							<button data-id="${product.id}" data-action="delete" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
								<i class="fa-solid fa-trash text-gray-600 hover:text-red-600"></i>
							</button>
						</div>
					</div>
					<span class="text-sm font-medium text-gray-600">$${product.price}</span>
				</div>
				<img src="${product.image}" alt="${product.title}" class="w-full h-36 object-contain rounded-lg bg-gray-100 mt-2 mb-2" />
			</div>
		`).join('');
    }
    function attachProductEvents() {
        Array.from(document.querySelectorAll('#productsList button')).forEach((btn) => {
            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                const id = btn.getAttribute('data-id');
                const action = btn.getAttribute('data-action');
                if (action === 'delete') {
                    let all = JSON.parse(localStorage.getItem('products') || '[]');
                    all = all.filter((p) => p.id !== id);
                    localStorage.setItem('products', JSON.stringify(all));
                    showProducts();
                }
                else if (action === 'edit') {
                    const all = JSON.parse(localStorage.getItem('products') || '[]');
                    const product = all.find((p) => p.id === id);
                    if (product) {
                        document.getElementById('productName').value = product.title;
                        document.getElementById('productPrice').value = String(product.price);
                        document.getElementById('productImage').value = product.image;
                        editProductId = id;
                        document.getElementById('addProductBtn').classList.add('hidden');
                        document.getElementById('saveChangesBtn').classList.remove('hidden');
                    }
                }
            });
        });
        Array.from(document.querySelectorAll('#productsList .card-responsive')).forEach((card) => {
            card.addEventListener('click', () => {
                const productId = card.getAttribute('data-id');
                showProductInfo(productId);
            });
        });
    }
}
function showOrders() {
    if (!adminContainer)
        return;
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (!orders.length) {
        adminContainer.innerHTML = `
			<div id="mainPanel" class="main-panel">
				<h2 class="text-2xl font-bold mb-6 text-gray-800">Orders</h2>
				<div class="bg-white rounded-xl shadow p-8 text-center text-gray-500">No orders found.</div>
			</div>
		`;
        return;
    }
    adminContainer.innerHTML = `
		<div id="mainPanel" class="main-panel">
			<h2 class="text-2xl font-bold mb-6 text-gray-800">Orders</h2>
			<div class="grid-responsive">
				${orders.map((order) => `
					<div class="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition duration-300 card-responsive">
						<div class="mb-3">
							<span class="block text-sm text-gray-500">Order ID</span>
							<span class="text-lg font-semibold text-gray-800">#${order.id}</span>
						</div>
						<div class="mb-2">
							<span class="block text-sm text-gray-500">User</span>
							<span class="text-base text-gray-700">${order.user}</span>
						</div>
						<div class="mb-2">
							<span class="block text-sm text-gray-500">Total</span>
							<span class="text-base font-medium text-green-600">$${order.total}</span>
						</div>
						<div class="mt-3">
							<span class="block text-sm text-gray-500">Status</span>
							<span class="inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${order.status}</span>
						</div>
					</div>
				`).join('')}
			</div>
		</div>
	`;
}
function showProductInfo(productId) {
    if (!adminContainer)
        return;
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p) => p.id === productId);
    if (!product) {
        adminContainer.innerHTML = `<div class="p-8 bg-white rounded-xl shadow"><h3 class="text-xl font-medium text-red-600">Product Not Found</h3></div>`;
        return;
    }
    adminContainer.innerHTML = `
		<div class="bg-white rounded-xl shadow p-6">
			<h2 class="text-2xl font-bold mb-4">${product.title}</h2>
			<img src="${product.image}" alt="${product.title}" class="w-full h-64 object-contain rounded-lg mb-4" />
			<p class="text-gray-700 text-base mb-4">${product.description}</p>
			<div class="flex items-center mb-4">
				${renderStars(product.rating)}
				<span class="ml-2 text-sm text-gray-500">(${product.rating}%)</span>
			</div>
			<span class="text-sm font-medium text-gray-500">Category: ${product.category}</span>
		</div>
	`;
}
function renderStars(rating) {
    const clamped = Math.max(0, Math.min(5, rating));
    const stars = Math.round(clamped);
    return Array(5).fill(0).map((_, i) => i < stars ? '<i class="fa-solid fa-star text-yellow-500"></i>' : '<i class="fa-regular fa-star text-gray-300"></i>').join('');
}
// Boot
if (AuthManager.isAuthenticated() && AuthManager.getCurrentUser()?.email === ADMIN_EMAIL) {
    showDashboard();
    document.getElementById('dashboardBtn').addEventListener('click', (e) => { e.preventDefault(); if (adminContainer)
        adminContainer.innerHTML = ''; showDashboard(); });
    document.getElementById('usersBtn').addEventListener('click', (e) => { e.preventDefault(); if (adminContainer)
        adminContainer.innerHTML = ''; showUsers(); });
    document.getElementById('productsBtn').addEventListener('click', (e) => { e.preventDefault(); if (adminContainer)
        adminContainer.innerHTML = ''; showProducts(); });
    document.getElementById('ordersBtn').addEventListener('click', (e) => { e.preventDefault(); if (adminContainer)
        adminContainer.innerHTML = ''; showOrders(); });
}
else {
    if (adminContainer)
        adminContainer.innerHTML = '<div class="p-8 bg-white rounded-xl shadow"><h3 class="text-xl font-medium text-red-600">Access Denied</h3><p class="mt-2">You do not have admin privileges.</p></div>';
}
//# sourceMappingURL=script.js.map