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

// Custom popup function
function showPopup(title, message, type = 'info') {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupIcon = document.getElementById('popup-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupButton = document.getElementById('popup-button');

    // Set icon based on type
    popupIcon.className = 'popup-icon';
    if (type === 'success') {
        popupIcon.textContent = '✓';
        popupIcon.classList.add('success');
        popupButton.className = 'popup-button success';
    } else if (type === 'error') {
        popupIcon.textContent = '✕';
        popupIcon.classList.add('error');
        popupButton.className = 'popup-button error';
    } else if (type === 'warning') {
        popupIcon.textContent = '⚠';
        popupIcon.classList.add('warning');
        popupButton.className = 'popup-button';
    } else {
        popupIcon.textContent = 'ℹ';
        popupButton.className = 'popup-button';
    }

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    // Show popup
    popupOverlay.classList.add('show');

    // Handle button click
    const closePopup = () => {
        popupOverlay.classList.remove('show');
        popupButton.removeEventListener('click', closePopup);
    };

    popupButton.addEventListener('click', closePopup);

    // Close on overlay click
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
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
        showPopup('Error', 'Please enter an email address', 'error');
        return;
    }

    if (password.length < 6) {
        showPopup('Error', 'Password must be at least 6 characters long', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showPopup('Error', 'Passwords do not match', 'error');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[email]) {
        showPopup('Account Exists', 'Email already exists. Please log in.', 'warning');
        return;
    }

    // Hash and store user
    const hashedPassword = hashPassword(password);
    users[email] = hashedPassword;
    localStorage.setItem('users', JSON.stringify(users));

    showPopup('Success', 'Account created successfully!', 'success');
    
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
        showPopup('Error', 'Please enter both email and password', 'error');
        return;
    }

    // Admin hardcoded credentials
    if (email === 'admin@kigali.com' && password === 'admin123') {
        sessionStorage.setItem('loggedInUser', JSON.stringify({ email, role: 'admin' }));
        showPopup('Welcome Admin!', 'Login successful! Redirecting to admin dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1200);
        return;
    }

    // Check credentials for normal users
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const hashedInputPassword = hashPassword(password);

    if (users[email] && users[email] === hashedInputPassword) {
        // Successful login
        sessionStorage.setItem('loggedInUser', JSON.stringify({ email, role: 'user' }));
        showPopup('Welcome Back!', 'Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    } else {
        showPopup('Login Failed', 'Invalid email or password', 'error');
    }
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        try {
            const user = JSON.parse(loggedInUser);
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
                return;
            }
        } catch (e) {}
        window.location.href = 'index.html';
        return;
    }

    // Add Enter key functionality for login form
    loginEmailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    loginPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    // Add Enter key functionality for signup form
    signupEmailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            signupBtn.click();
        }
    });

    signupPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            signupBtn.click();
        }
    });

    confirmPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            signupBtn.click();
        }
    });
});