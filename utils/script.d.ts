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
export declare function initializeProducts(): void;
export declare function getAllProducts(): Product[];
export declare function getProductById(id: string): Product | null;
export declare function getProductsByCategory(category: string): Product[];
export declare function searchProducts(query: string): Product[];
export declare function getRandomProducts(excludeId: string, count?: number): Product[];
export declare function formatPrice(price: number): string;
export declare function calculateAverageRating(ratings: number[]): number;
export declare function generateStarRating(rating: number, maxStars?: number): string;
export {};
//# sourceMappingURL=script.d.ts.map