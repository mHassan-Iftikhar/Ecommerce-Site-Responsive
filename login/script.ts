import { AuthManager } from '../script.js';

const email = document.getElementById('email') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const login = document.getElementById('login');
const error = document.getElementById('error-message') as HTMLSpanElement;

// Admin credentials
const ADMIN_EMAIL = 'hassan@admin.panel';
const ADMIN_PASSWORD = '1234567890';

function validation() {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    error.style.display = "none";
    error.textContent = "";

    if (emailValue === "" || passwordValue === "") {
        error.textContent = "All fields are required";
        error.style.display = "block";
        return;
    }

    // Check for admin login
    if (emailValue === ADMIN_EMAIL && passwordValue === ADMIN_PASSWORD) {
        const adminData = {
            id: 'admin',
            username: 'Admin',
            email: ADMIN_EMAIL,
            loginTime: new Date().toISOString()
        };
        AuthManager.setAuth(adminData);
        error.style.display = 'none';
        window.location.href = "../admin/index.html";
        return;
    }

    // Check for regular user login
    let usersArray = JSON.parse(localStorage.getItem("user") || "[]");
    const userExist = usersArray.find((user: any) => user.email === emailValue && user.password === passwordValue);

    if (!userExist) {
        error.textContent = "Invalid email or password";
        error.style.display = "block";
        error.style.color = "red";
        return;
    } else {
        // Store the logged in user data with token
        const userData = {
            id: userExist.id || Date.now(),
            username: userExist.username,
            email: userExist.email,
            loginTime: new Date().toISOString()
        };
        
        // Use AuthManager to set authentication
        AuthManager.setAuth(userData);
        
        error.textContent = '';
        error.style.display = 'none';
        window.location.href = "../index.html";
        return;
    }
}

login?.addEventListener('click', (e) => {
    e.preventDefault();
    validation();
});