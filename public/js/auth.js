import { auth } from './app.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const authNav = document.getElementById('authNav');
const userNav = document.getElementById('userNav');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// Authentication State Listener
if (auth) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (authNav) authNav.classList.add('hidden');
            if (userNav) userNav.classList.remove('hidden');
            
            // Redirect from login/register if already authenticated
            if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // User is signed out
            if (authNav) authNav.classList.remove('hidden');
            if (userNav) userNav.classList.add('hidden');
            
            // Redirect to login if trying to access protected pages (to be implemented)
            // if (window.location.pathname.includes('dashboard.html')) {
            //     window.location.href = 'login.html';
            // }
        }
    });
}

// Helper to show errors
const showError = (element, message) => {
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
};

// Registration Handler
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!auth) {
            showError(registerError, "Firebase is not configured yet.");
            return;
        }

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const submitBtn = document.getElementById('registerSubmitBtn');
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
            registerError.classList.add('hidden');

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update profile with display name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            console.log("Registered user:", userCredential.user);
            window.location.href = 'dashboard.html'; // Or 'index.html'

        } catch (error) {
            console.error("Registration error:", error);
            let errorMessage = "An error occurred during registration.";
            if (error.code === 'auth/email-already-in-use') errorMessage = "Email is already in use.";
            if (error.code === 'auth/weak-password') errorMessage = "Password is too weak.";
            showError(registerError, errorMessage);
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
}

// Login Handler
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!auth) {
            showError(loginError, "Firebase is not configured yet.");
            return;
        }

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = document.getElementById('loginSubmitBtn');
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
            loginError.classList.add('hidden');

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in user:", userCredential.user);
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error("Login error:", error);
            let errorMessage = "Invalid email or password.";
            showError(loginError, errorMessage);
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });
}

// Logout Handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            console.log("User signed out");
            // If on a protected page, state listener will redirect
            // Otherwise, we can force a redirect here:
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("Error signing out:", error);
        }
    });
}
