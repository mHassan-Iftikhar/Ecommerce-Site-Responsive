declare class AuthManager {
    static getUserEmail(): string;
    private static readonly TOKEN_KEY;
    private static readonly USER_KEY;
    private static readonly TOKEN_EXPIRY_KEY;
    static generateToken(): string;
    static setAuth(userData: any): void;
    static isAuthenticated(): boolean;
    static getCurrentUser(): any;
    static clearAuth(): void;
    static refreshToken(): void;
}
declare function checkUserLoginStatus(): boolean;
declare function updateUIForLoginStatus(): void;
declare function addToCart(productId: string): void;
declare function addToWishlist(productId: string): void;
declare function logout(): void;
export { checkUserLoginStatus, updateUIForLoginStatus, logout, AuthManager, addToCart, addToWishlist };
//# sourceMappingURL=script.d.ts.map