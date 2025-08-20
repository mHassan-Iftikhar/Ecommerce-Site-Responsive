// Utility functions for the e-commerce store
// Sample products data
const sampleProducts = [
    {
        id: '1',
        title: 'Premium Wireless Headphones',
        price: 199.99,
        image: './images/chair.jpg',
        description: 'High-quality wireless headphones with noise cancellation, perfect for music lovers and professionals. Features include 30-hour battery life, premium sound quality, and comfortable over-ear design.',
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
        description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and 7-day battery life. Perfect for athletes and health-conscious individuals.',
        category: 'Electronics',
        rating: 4.6,
        reviews: 892,
        inStock: true
    },
    {
        id: '3',
        title: 'Ergonomic Office Chair',
        price: 399.99,
        image: './images/chair.jpg',
        description: 'Professional ergonomic office chair with adjustable lumbar support, headrest, and breathable mesh back. Designed for long hours of comfortable work.',
        category: 'Furniture',
        rating: 4.7,
        reviews: 567,
        inStock: true
    },
    {
        id: '4',
        title: 'Premium Coffee Maker',
        price: 149.99,
        image: './images/chair.jpg',
        description: 'Automatic coffee maker with programmable timer, built-in grinder, and thermal carafe. Brews perfect coffee every time with customizable strength settings.',
        category: 'Home & Kitchen',
        rating: 4.5,
        reviews: 423,
        inStock: true
    },
    {
        id: '5',
        title: 'Wireless Gaming Mouse',
        price: 79.99,
        image: './images/watch.jpg',
        description: 'High-performance wireless gaming mouse with 25K DPI sensor, RGB lighting, and 70-hour battery life. Perfect for competitive gaming.',
        category: 'Electronics',
        rating: 4.4,
        reviews: 756,
        inStock: true
    },
    {
        id: '6',
        title: 'Smart Home Hub',
        price: 129.99,
        image: './images/chair.jpg',
        description: 'Central control hub for all your smart home devices. Compatible with Alexa, Google Assistant, and Apple HomeKit.',
        category: 'Electronics',
        rating: 4.3,
        reviews: 234,
        inStock: false
    },
    {
        id: '7',
        title: 'Professional Camera Lens',
        price: 899.99,
        image: './images/watch.jpg',
        description: 'High-quality 50mm f/1.4 prime lens for professional photography. Features include image stabilization and weather-sealed construction.',
        category: 'Photography',
        rating: 4.9,
        reviews: 189,
        inStock: true
    },
    {
        id: '8',
        title: 'Portable Bluetooth Speaker',
        price: 89.99,
        image: './images/chair.jpg',
        description: 'Waterproof portable speaker with 360-degree sound, 20-hour battery life, and built-in microphone for calls.',
        category: 'Electronics',
        rating: 4.2,
        reviews: 445,
        inStock: true
    }
];
// Function to initialize products if they don't exist
export function initializeProducts() {
    const existingProducts = localStorage.getItem('products');
    if (!existingProducts) {
        localStorage.setItem('products', JSON.stringify(sampleProducts));
        console.log('Sample products initialized');
    }
}
// Function to get all products
export function getAllProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}
// Function to get product by ID
export function getProductById(id) {
    const products = getAllProducts();
    return products.find(product => product.id === id) || null;
}
// Function to get products by category
export function getProductsByCategory(category) {
    const products = getAllProducts();
    return products.filter(product => product.category === category);
}
// Function to search products
export function searchProducts(query) {
    const products = getAllProducts();
    const searchTerm = query.toLowerCase();
    return products.filter(product => product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.category && product.category.toLowerCase().includes(searchTerm)));
}
// Function to get random products (excluding current product)
export function getRandomProducts(excludeId, count = 6) {
    const products = getAllProducts().filter(product => product.id !== excludeId);
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
// Function to format price
export function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}
// Function to calculate average rating
export function calculateAverageRating(ratings) {
    if (ratings.length === 0)
        return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}
// Function to generate star rating HTML
export function generateStarRating(rating, maxStars = 5) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < maxStars; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fa-solid fa-star text-yellow-400"></i>';
        }
        else if (i === fullStars && hasHalfStar) {
            starsHTML += '<i class="fa-solid fa-star-half-alt text-yellow-400"></i>';
        }
        else {
            starsHTML += '<i class="fa-solid fa-star text-gray-300"></i>';
        }
    }
    return starsHTML;
}
// Initialize products when this module is imported
initializeProducts();
//# sourceMappingURL=script.js.map