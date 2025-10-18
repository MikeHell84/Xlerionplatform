// frontend/admin/api.js

// Durante el desarrollo con live-server, apuntamos directamente al backend en el puerto 3000.
const API_URL = `http://localhost:3000/api`;

/**
 * Wrapper para fetch que maneja la autenticación y errores 401.
 * Si se recibe un 401, recarga la página para forzar el login.
 * @param {string} endpoint - El endpoint de la API (ej. '/posts').
 * @param {object} options - Opciones para fetch.
 * @returns {Promise<any>} Los datos JSON de la respuesta.
 */
export async function fetchApi(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // No establecer Content-Type si el body es FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (response.status === 401) {
        localStorage.removeItem('token');
        alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        window.location.reload(); // Forzar recarga para mostrar el login
        throw new Error('Sesión expirada');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Error en la petición a ${endpoint}`);
    }

    return data;
}

export const authApi = {
    login: (email, password) => fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }).then(res => res.json().then(data => {
        if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
        return data;
    })),
    forgotPassword: (email) => fetchApi('/users/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    }),
    resetPassword: (token, password) => fetchApi('/users/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
    }),
};

export const settingsApi = {
    get: () => fetchApi('/settings'),
    update: (settings) => fetchApi('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
    }),
    restore: () => fetchApi('/settings/restore', { method: 'POST' }),
    uploadLogo: (formData) => fetchApi('/settings/upload-logo', {
        method: 'POST',
        body: formData,
    }),
    uploadHeroImage: (formData) => fetchApi('/settings/upload-hero', {
        method: 'POST',
        body: formData,
    }),
};

export const postsApi = {
    getAll: (page = 1, sectionId = null, searchTerm = null) => {
        const params = new URLSearchParams({ page });
        if (sectionId) params.append('section_id', sectionId);
        if (searchTerm) params.append('search', searchTerm);
        
        const url = `/posts?${params.toString()}`;
        return fetchApi(url);
    },
    getById: (id) => fetchApi(`/posts/${id}`),
    create: (data) => fetchApi('/posts', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => fetchApi(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id) => fetchApi(`/posts/${id}`, { method: 'DELETE' }),
    // La descarga no usa fetchApi porque es una descarga de archivo directa
    getExportUrl: () => `${API_URL}/export/posts?token=${localStorage.getItem('token')}`,
};

export const sectionsApi = {
    getAll: () => fetchApi('/sections'),
    save: (id, data) => {
        const isUpdating = id && id !== '';
        const method = isUpdating ? 'PUT' : 'POST'; // Usar PUT para actualizar
        const endpoint = isUpdating ? `/sections/${id}` : '/sections';
        return fetchApi(endpoint, {
            method,
            body: JSON.stringify(data),
        });
    }
};

export const commentsApi = {
    getAll: () => fetchApi('/comments'),
    approve: (id) => fetchApi(`/comments/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'approved' }) }),
    delete: (id) => fetchApi(`/comments/${id}`, { method: 'DELETE' }),
};

export const socialLinksApi = {
    getAll: () => fetchApi('/social-links'),
    save: (id, data) => {
        const isUpdating = !!id;
        const method = isUpdating ? 'PUT' : 'POST';
        const endpoint = isUpdating ? `/social-links/${id}` : '/social-links';
        return fetchApi(endpoint, {
            method,
            body: JSON.stringify(data),
        });
    },
    delete: (id) => fetchApi(`/social-links/${id}`, { method: 'DELETE' }),
};

export const contentBlocksApi = {
    getAll: () => fetchApi('/content-blocks'),
    getById: (id) => fetchApi(`/content-blocks/${id}`),
    create: (formData) => fetchApi('/content-blocks', {
        method: 'POST',
        body: formData,
    }),
    update: (id, formData) => fetchApi(`/content-blocks/${id}`, {
        method: 'PUT',
        body: formData,
    }),
    delete: (id) => fetchApi(`/content-blocks/${id}`, { method: 'DELETE' }),
    updateOrder: (order) => fetchApi('/content-blocks/order', {
        method: 'PUT',
        body: JSON.stringify({ order }),
    }),
};

export const usersApi = {
    getMe: () => fetchApi('/users/me'), // Añadimos el nuevo método
    getAll: () => fetchApi('/users'),
    create: (data) => fetchApi('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => fetchApi(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id) => fetchApi(`/users/${id}`, { method: 'DELETE' }),
};

export const backupApi = {
    getAll: () => fetchApi('/backups'),
    create: () => fetchApi('/backups', { method: 'POST' }),
    delete: (filename) => fetchApi(`/backups/${filename}`, { method: 'DELETE' }),
    restore: (formData) => fetchApi('/backups/restore', {
        method: 'POST',
        body: formData,
    }),
    // La descarga no usa fetchApi porque es una descarga de archivo directa
    getDownloadUrl: (filename) => `${API_URL}/backups/${filename}?token=${localStorage.getItem('token')}`,
};

export const seoApi = {
    generateSitemap: () => fetchApi('/seo/sitemap', { method: 'POST' }),
};

export const emailSettingsApi = {
    get: () => fetchApi('/email-settings'),
    update: (settings) => fetchApi('/email-settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
    }),
    sendTest: () => fetchApi('/email-settings/test', { method: 'POST' }),
};

export const cacheApi = {
    clearAll: () => fetchApi('/cache/clear-all', { method: 'POST' }),
    clearSpecific: (prefixes) => fetchApi('/cache/clear-specific', {
        method: 'POST',
        body: JSON.stringify({ prefixes }),
    }),
};

export const i18nApi = {
    getLanguages: () => fetchApi('/i18n/languages'),
    addLanguage: (data) => fetchApi('/i18n/languages', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    deleteLanguage: (code) => fetchApi(`/i18n/languages/${code}`, { method: 'DELETE' }),
    getTranslations: (langCode) => fetchApi(`/i18n/translations/${langCode}`),
    updateTranslations: (langCode, translations) => fetchApi(`/i18n/translations/${langCode}`, {
        method: 'PUT',
        body: JSON.stringify(translations),
    }),
};

export const activityLogApi = {
    getLog: (page = 1) => fetchApi(`/activity-log?page=${page}`),
};