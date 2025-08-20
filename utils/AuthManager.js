const AuthManager = {
    isAuthenticated: () => {
        const currentUser = localStorage.getItem('currentUser');
        return !!currentUser; // Returns true if a user is logged in
    },
    getCurrentUser: () => {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    },
    login: (email) => {
        localStorage.setItem('currentUser', JSON.stringify({ email }));
    },
    logout: () => {
        localStorage.removeItem('currentUser');
    },
};
export default AuthManager;
//# sourceMappingURL=AuthManager.js.map