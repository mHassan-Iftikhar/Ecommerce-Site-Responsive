import { AuthManager } from '../script.js';

// DOM elements
const navButtons = document.querySelectorAll(".navButtons") as NodeListOf<HTMLDivElement>;
const userSections = document.querySelectorAll(".userSection") as NodeListOf<HTMLDivElement>;
const logoutBtns = document.querySelectorAll(".logoutBtn") as NodeListOf<HTMLButtonElement>;
const contactForm = document.getElementById("contactForm") as HTMLFormElement;

// Function to check if user is logged in
function checkUserLoginStatus(): boolean {
    return AuthManager.isAuthenticated();
}

// Function to update UI based on login status
function updateUIForLoginStatus(): void {
    const isLoggedIn = checkUserLoginStatus();

    navButtons.forEach((nav) => {
        nav.style.display = isLoggedIn ? 'none' : '';
    });

    userSections.forEach((section) => {
        section.style.display = isLoggedIn ? '' : 'none';
    });

    // Show admin panel if user is admin
    const adminPanel = document.querySelector('.adminPanel') as HTMLElement;
    if (adminPanel) {
        const currentUser = AuthManager.getCurrentUser();
        adminPanel.style.display = (currentUser && currentUser.email === 'hassan@admin.com') ? '' : 'none';
    }
}

// Function to handle form submission
function handleFormSubmit(e: Event): void {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Store contact message in localStorage (in a real app, this would be sent to a server)
    const contactMessage = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
        status: 'Pending'
    };

    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    existingMessages.push(contactMessage);
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));

    // Show success message
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
}

// Function to show notifications
function showNotification(message: string, type: 'success' | 'error'): void {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Function to handle logout
function logout(): void {
    AuthManager.clearAuth();
    updateUIForLoginStatus();
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 100);
}

// Add logout event listener
logoutBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});

// Add form submit event listener
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateUIForLoginStatus();
});
