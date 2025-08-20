// Add product to cart
export function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(`Product ${productId} added to cart.`);
    }
    else {
        console.log(`Product ${productId} is already in the cart.`);
    }
}
// Add product to wishlist
export function addToWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        console.log(`Product ${productId} added to wishlist.`);
    }
    else {
        console.log(`Product ${productId} is already in the wishlist.`);
    }
}
//# sourceMappingURL=utils.js.map