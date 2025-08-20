declare const AuthManager: {
    isAuthenticated: () => boolean;
    getCurrentUser: () => {
        email: string;
    } | null;
    login: (email: string) => void;
    logout: () => void;
};
export default AuthManager;
//# sourceMappingURL=AuthManager.d.ts.map