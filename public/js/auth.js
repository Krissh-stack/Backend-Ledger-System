// public/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');

    // Toggle Forms
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        loginForm.classList.remove('flex');
        registerForm.classList.remove('hidden');
        registerForm.classList.add('flex');
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        registerForm.classList.remove('flex');
        loginForm.classList.remove('hidden');
        loginForm.classList.add('flex');
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Connecting...';
        btn.disabled = true;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Login failed');
            
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = '/dashboard.html', 1000);
        } catch (err) {
            showToast(err.message, 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    // Handle Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Creating...';
        btn.disabled = true;

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Registration failed');
            
            showToast('Account created successfully! Redirecting...', 'success');
            setTimeout(() => window.location.href = '/dashboard.html', 1000);
        } catch (err) {
            showToast(err.message, 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
});

// Toast functionality
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    // Icon based on type
    let icon = '';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '❌';
    else if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    toast.className = `toast show ${type} fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#e8eaed] text-[#202124] px-6 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.8)] font-medium text-sm flex items-center gap-2 z-50 transition-all`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Google Sign-In Callback
async function handleCredentialResponse(response) {
    try {
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Google Auth failed');
        
        showToast('Google Sign-In successful!', 'success');
        setTimeout(() => window.location.href = '/dashboard.html', 1000);
    } catch (err) {
        showToast(err.message, 'error');
    }
}
window.handleCredentialResponse = handleCredentialResponse;
