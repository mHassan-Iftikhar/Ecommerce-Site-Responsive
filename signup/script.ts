// Import authentication manager
import { AuthManager } from '../script.js';
import { Toast } from '../utils/toast.js';

const username = document.getElementById('username') as HTMLInputElement;
const email = document.getElementById('email') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const signup = document.getElementById('signup') as HTMLAnchorElement;
const error = document.getElementById('error-message') as HTMLSpanElement;

// Debug logging
console.log('Signup script loaded');
console.log('Username element:', username);
console.log('Email element:', email);
console.log('Password element:', password);
console.log('Signup button element:', signup);
console.log('Error element:', error);

function validation() {
    console.log('Validation function called');
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    console.log('Form values:', { usernameValue, emailValue, passwordValue });

    // Reset error state
    error.style.display = 'none';
    error.textContent = '';

    let usersArray = JSON.parse(localStorage.getItem("user") || "[]");
    const userExist = usersArray.some((user: any) => user.email === emailValue);

    if (!usernameValue || !emailValue || !passwordValue) {
        error.textContent = 'Please fill in all fields';
        error.style.display = 'block';
        return;
    } else if (userExist) {
        error.textContent = 'User already registered!';
        error.style.display = 'block';
        return;
    } else if (passwordValue.length < 6) {
        error.textContent = 'Password must be at least 6 characters';
        error.style.display = 'block';
        return;
    } else {
        const userData = {
            id: Date.now(),
            username: usernameValue,
            email: emailValue,
            password: passwordValue
        };
        usersArray.push(userData);
        localStorage.setItem("user", JSON.stringify(usersArray));

        // Automatically log in the user after signup
        const loginData = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            loginTime: new Date().toISOString()
        };
        
        AuthManager.setAuth(loginData);

        error.textContent = '';
        error.style.display = 'none';
        Toast.success('Signup successful! You are now logged in.');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        return;
    }
}

// Add click event listener to signup button
if (signup) {
    console.log('Adding click event listener to signup button');
    signup.addEventListener('click', (e) => {
        console.log('Signup button clicked!');
        e.preventDefault();
        validation();
    });
} else {
    console.error('Signup button not found!');
}