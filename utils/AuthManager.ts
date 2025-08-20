const AuthManager = {
    isAuthenticated: (): boolean => {
        const currentUser = localStorage.getItem('currentUser');
        return !!currentUser; // Returns true if a user is logged in
    },
    getCurrentUser: (): { email: string } | null => {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    },
    login: (email: string): void => {
        localStorage.setItem('currentUser', JSON.stringify({ email }));
    },
    logout: (): void => {
        localStorage.removeItem('currentUser');
    },
};

export default AuthManager;