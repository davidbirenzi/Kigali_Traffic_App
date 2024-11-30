// Utility function to hash password
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

// Get form elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');

// Toggle between login and signup forms
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Signup validation
signupBtn.addEventListener('click', () => {
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Basic validations
    if (!email) {
        alert('Please enter an email address');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[email]) {
        alert('Email already exists. Please log in.');
        return;
    }

    // Hash and store user
    const hashedPassword = hashPassword(password);
    users[email] = hashedPassword;
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully!');
    
    // Switch to login form
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login functionality
loginBtn.addEventListener('click', () => {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();

    // Validate inputs
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // Check credentials
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const hashedInputPassword = hashPassword(password);

    if (users[email] && users[email] === hashedInputPassword) {
        // Successful login
        sessionStorage.setItem('loggedInUser', email);
        alert('Login successful!');
        // Redirect to main page or dashboard
        window.location.href = 'index.html'; // Change to your main page
    } else {
        alert('Invalid email or password');
    }
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // If already logged in, redirect to dashboard
        window.location.href = 'index.html'; // Change to your main page
    }
});