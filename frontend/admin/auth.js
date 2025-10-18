// frontend/admin/modules/auth.js
import { authApi } from '../api.js';

const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

async function handleLogin(e) {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const data = await authApi.login(email, password);
        localStorage.setItem('authToken', data.token);
        window.location.reload(); // Recargar para un estado limpio y seguro
    } catch (error) {
        loginError.textContent = error.message;
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    window.location.reload(); // Recargar para limpiar el estado
}

export function checkAuth() {
    if (localStorage.getItem('authToken')) {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        return true;
    } else {
        loginContainer.style.display = 'block';
        dashboardContainer.style.display = 'none';
        return false;
    }
}

export function initAuth() {
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
}