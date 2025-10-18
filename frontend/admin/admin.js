// frontend/admin/admin.js
import { initializeAllModules } from './modules/init.js';
import { checkAuth } from './modules/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa todos los manejadores de eventos y la UI básica.
    initializeAllModules();

    // 2. Comprueba la autenticación y arranca el panel si el usuario está logueado.
    // Toda la lógica de login/dashboard ahora está dentro de checkAuth.
    await checkAuth();
});