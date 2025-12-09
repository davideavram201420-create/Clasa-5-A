// Admin Login Script
const CORRECT_PASSWORD = "Davr1889?!";

// Get DOM elements
const loginForm = document.getElementById('adminLoginForm');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const togglePasswordBtn = document.getElementById('togglePassword');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Update icon
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
    eyeIcon.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Handle form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const enteredPassword = passwordInput.value;

    // Clear previous error
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    // Validate password
    if (enteredPassword === CORRECT_PASSWORD) {
        // Success - show modal
        showSuccessModal();
    } else {
        // Error - show error message
        showError('Parolă incorectă! Vă rugăm să încercați din nou.');
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Show success modal
function showSuccessModal() {
    successModal.classList.add('show');

    // Store login status in sessionStorage
    sessionStorage.setItem('adminLoggedIn', 'true');
    sessionStorage.setItem('loginTime', new Date().toISOString());

    // Redirect to index.html after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Close modal and redirect
closeModalBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Close modal on background click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModalBtn.click();
    }
});

// Check if already logged in
window.addEventListener('load', () => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('loginTime');

    if (isLoggedIn && loginTime) {
        // Check if login is still valid (within 2 hours)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);

        if (hoursSinceLogin < 2) {
            // Still logged in - redirect to main page
            window.location.href = 'index.html';
        } else {
            // Session expired
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('loginTime');
        }
    }
});
