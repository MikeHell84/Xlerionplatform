// frontend/admin/modules/auth.js
import { authApi, usersApi } from '../api.js';
import { loadInitialData } from './init.js';

// --- DOM Element Cache ---
const loginContainer = document.getElementById('login-container');
const forgotPasswordContainer = document.getElementById('forgot-password-container');
const resetPasswordContainer = document.getElementById('reset-password-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const userRoleElements = document.querySelectorAll('.user-role');

const adminOnlyNavItems = ['nav-users', 'nav-backups', 'nav-seo', 'nav-email', 'nav-cache', 'nav-i18n', 'nav-activity-log'];
const editorOnlyNavItems = []; // Por si se necesita en el futuro

const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLoginLink1 = document.getElementById('back-to-login-link1');
const backToLoginLink2 = document.getElementById('back-to-login-link2');

/**
 * Comprueba si hay un token de autenticación válido y arranca el panel.
 */
export async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        showLogin();
        handleRouting(); // Manejar rutas de reseteo incluso si no hay sesión
        return false;
    }

    try {
        // Validar el token contra el backend y obtener datos frescos del usuario.
        const user = await usersApi.getMe();
        localStorage.setItem('userRole', user.role); // Asegurarse de que el rol está actualizado
        showDashboard(user);
        return true; // Autenticación exitosa
    } catch (error) {
        console.error('Fallo de autenticación:', error.message);
        localStorage.clear();
        showLogin();
        handleRouting(); // Manejar rutas de reseteo incluso si no hay sesión
        return false;
    }
}

/**
 * Inicializa los manejadores de eventos para la autenticación.
 */
export function initAuth() {
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotPassword();
    });
    if (backToLoginLink1) backToLoginLink1.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });
    if (backToLoginLink2) backToLoginLink2.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });
    if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    if (resetPasswordForm) resetPasswordForm.addEventListener('submit', handleResetPassword);

    // Listener para cambios en el hash de la URL
    window.addEventListener('hashchange', handleRouting);
}

function hideAllAuthContainers() {
    if (loginContainer) loginContainer.style.display = 'none';
    if (forgotPasswordContainer) forgotPasswordContainer.style.display = 'none';
    if (resetPasswordContainer) resetPasswordContainer.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
}

async function handleLogin(e) {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const data = await authApi.login(email, password);
        localStorage.setItem('token', data.token);
        // Después de guardar el token, recargamos para que checkAuth haga la validación completa.
        window.location.reload();
    } catch (error) {
        loginError.textContent = error.message;
    }
}

function handleLogout() {
    localStorage.clear();
    window.location.hash = ''; // Limpiar el hash para evitar bucles
    window.location.reload();
}

export function showLogin() {
    hideAllAuthContainers();
    if (loginContainer) loginContainer.style.display = 'flex';
}

function showDashboard(user) {
    if (!user) return showLogin();
    // El rol se obtiene de la llamada a /api/users/me
    const userRole = localStorage.getItem('userRole') || user.role;
    userRoleElements.forEach(el => el.textContent = userRole);
    updateUIForRole(user.role);

    hideAllAuthContainers();
    if (dashboardContainer) dashboardContainer.style.display = 'grid';

    loadInitialData(); // Iniciar la carga de datos solo DESPUÉS de mostrar el dashboard.
}

export function updateUIForRole(role) {
    if (role !== 'admin') {
        adminOnlyNavItems.forEach(id => {
            document.getElementById(id)?.remove();
        });
    }
}

function showForgotPassword() {
    hideAllAuthContainers();
    if (forgotPasswordContainer) forgotPasswordContainer.style.display = 'flex';
}

function showResetPassword(token) {
    hideAllAuthContainers();
    if (resetPasswordContainer) {
        resetPasswordContainer.style.display = 'flex';
        document.getElementById('reset-token').value = token;
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const messageEl = document.getElementById('forgot-message');
    try {
        const data = await authApi.forgotPassword(email);
        messageEl.textContent = data.message;
        messageEl.className = 'info-message success';
    } catch (error) {
        messageEl.textContent = error.message;
        messageEl.className = 'info-message error';
    }
}

async function handleResetPassword(e) {
    e.preventDefault();
    const token = document.getElementById('reset-token').value;
    const password = document.getElementById('reset-password-input').value;
    const confirmPassword = document.getElementById('reset-password-confirm').value;
    const messageEl = document.getElementById('reset-message');

    if (password !== confirmPassword) {
        messageEl.textContent = 'Las contraseñas no coinciden.';
        messageEl.className = 'info-message error';
        return;
    }

    try {
        const data = await authApi.resetPassword(token, password);
        messageEl.textContent = data.message;
        messageEl.className = 'info-message success';
        setTimeout(() => {
            window.location.hash = '#login';
            showLogin();
        }, 3000);
    } catch (error) {
        messageEl.textContent = error.message;
        messageEl.className = 'info-message error';
    }
}

function handleRouting() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split('?')[1]);
    const token = params.get('token');

    if (hash.startsWith('#reset-password') && token) {
        showResetPassword(token);
    } else if (hash === '#forgot-password') {
        showForgotPassword();
    }
    // La lógica de mostrar login por defecto ya la maneja checkAuth
}