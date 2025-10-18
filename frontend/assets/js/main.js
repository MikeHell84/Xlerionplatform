// frontend/assets/js/main.js

// Determina la URL base de la API. Si estamos en live-server (otro puerto),
// apunta a localhost:3000. Si no, usa una ruta relativa, ya que la API
// y el frontend se sirven desde el mismo origen.
const isDevelopment = ['localhost', '127.0.0.1'].includes(window.location.hostname) && window.location.port !== '3000';

const API_BASE_URL = isDevelopment
    ? 'http://localhost:3000/api/public'
    : '/api/public';

export const ASSET_BASE_URL = isDevelopment
    ? 'http://localhost:3000'
    : '';

/**
 * Muestra un mensaje de error en la consola y opcionalmente en la UI.
 * @param {string} message - El mensaje de error a mostrar.
 * @param {Error} [error] - El objeto de error original.
 */
function handleError(message, error) {
    console.error(message, error);
    // Podrías añadir una notificación en la UI aquí si lo deseas.
}

/**
 * Aplica las configuraciones visuales del sitio obtenidas de la API.
 * @param {object} settings - El objeto de configuraciones.
 */
function applySiteSettings(settings) {
    const root = document.documentElement;

    // Colores para el tema claro (por defecto)
    root.style.setProperty('--primary-color', settings.primary_color || '#007bff');
    root.style.setProperty('--secondary-color', settings.secondary_color || '#6c757d');
    root.style.setProperty('--background-color', settings.background_color || '#ffffff');
    root.style.setProperty('--text-color', settings.text_color || '#212529');

    // Colores para el tema oscuro (se aplicarán con CSS cuando data-theme="dark")
    root.style.setProperty('--primary-color-dark', settings.primary_color_dark || '#4dabf7');
    root.style.setProperty('--secondary-color-dark', settings.secondary_color_dark || '#868e96');
    root.style.setProperty('--background-color-dark', settings.background_color_dark || '#121212');
    root.style.setProperty('--text-color-dark', settings.text_color_dark || '#e9ecef');

    // Configuraciones generales
    document.documentElement.style.setProperty('--border-radius', `${settings.border_radius || 8}px`);
    document.body.style.fontFamily = settings.font_family || 'sans-serif';

    document.title = settings.site_title || 'Mi Sitio Web';

    const logoImg = document.getElementById('site-logo');
    if (logoImg && settings.site_logo) {
        // La ruta ya viene correcta desde el backend (ej: /uploads/logo.png).
        // No es necesario añadir el host, el navegador lo resolverá correctamente.
        logoImg.src = `${ASSET_BASE_URL}${settings.site_logo}`;
        logoImg.alt = settings.site_title || 'Logo';
    }

    const footerText = document.getElementById('footer-text');
    if (footerText) {
        // Construir el texto del footer a partir de los campos individuales
        const year = settings.footer_copyright_year || new Date().getFullYear();
        const company = settings.footer_company_name || 'Mi Sitio Web';
        // Usar el texto antiguo como fallback si los nuevos campos no existen
        const fullText = settings.footer_company_name ? `© ${year} ${company}. Todos los derechos reservados.` : settings.footer_text;
        footerText.textContent = fullText;
    }

    const heroSection = document.getElementById('hero-section');
    if (heroSection && settings.hero_background_image) {
        // La ruta ya viene correcta desde el backend (ej: /uploads/hero.jpg).
        // El navegador construirá la URL completa automáticamente.
        heroSection.style.backgroundImage = `url('${ASSET_BASE_URL}${settings.hero_background_image}')`;
    }

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && settings.hero_title) {
        heroTitle.textContent = settings.hero_title;
    }

    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle && settings.hero_subtitle) {
        heroSubtitle.textContent = settings.hero_subtitle;
    }
}

/**
 * Carga y aplica las configuraciones generales del sitio.
 */
async function loadSiteSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const settings = await response.json();
        applySiteSettings(settings);
    } catch (error) {
        handleError('Error al cargar la configuración del sitio:', error);
    }
}

/**
 * Carga y construye el menú de navegación principal.
 */
async function loadMenu() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const sections = await response.json();

        const menuNav = document.getElementById('main-menu');
        if (menuNav) {
            // No limpiar, para mantener el enlace "Inicio" si existe
            let menuItems = '';
            sections.forEach(section => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `/section/${section.slug}`; // Usamos un prefijo para identificar rutas de sección
                a.textContent = section.name; // El nombre ya viene en el idioma correcto
                li.appendChild(a);
                menuNav.appendChild(li);
            });
        }
    } catch (error) {
        handleError('Error al cargar el menú:', error);
    }
}

/**
 * Carga y muestra los bloques de contenido de la página principal.
 */
async function loadHomepageContent() {
    try {
        const response = await fetch(`${API_BASE_URL}/content-blocks`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blocks = await response.json();

        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = ''; // Limpiar cualquier contenido previo como "Cargando..."
            if (blocks.length === 0) {
                mainContent.innerHTML = '<p>No hay contenido para mostrar. Por favor, agregue bloques desde el panel de administración.</p>';
                return;
            }

            // Crear un contenedor de cuadrícula para los bloques
            const gridContainer = document.createElement('div');
            gridContainer.className = 'grid-container';

            blocks.forEach(block => {
                // Aquí asumimos una estructura de bloque simple.
                // Esto se puede expandir para manejar diferentes 'tipos' de bloques.
                const blockDiv = document.createElement('section');
                blockDiv.className = 'content-block';
                blockDiv.style.backgroundColor = block.background_color || 'transparent';
                blockDiv.style.color = block.text_color || 'inherit';

                // El contenido y título son JSON, necesitamos la traducción correcta.
                // Por ahora, asumimos 'es' como idioma por defecto.
                const title = block.title ? (block.title.es || Object.values(block.title)[0]) : '';
                const content = block.content ? (block.content.es || Object.values(block.content)[0]) : '';
                const ctaText = block.cta_text ? (block.cta_text.es || Object.values(block.cta_text)[0]) : '';

                let html;

                // Lógica específica para cada tipo de bloque
                switch (block.type) {
                    case 'gallery':
                        html = `<h2>${title}</h2>`;
                        if (content) html += `<div>${content}</div>`;
                        
                        // Asumimos que la URL de la imagen principal contiene un JSON con las rutas de la galería
                        try {
                            const images = JSON.parse(block.image_url || '[]');
                            if (images.length > 0) {
                                html += '<div class="gallery-grid">';
                                images.forEach(imgSrc => { // imgSrc ya es una ruta como /uploads/image.png
                                    html += `<div class="gallery-item"><img src="${ASSET_BASE_URL}${imgSrc}" alt="Imagen de la galería"></div>`;
                                });
                                html += '</div>';
                            }
                        } catch (e) {
                            console.error('Error al parsear las imágenes de la galería:', e);
                        }
                        break;

                    default: // Comportamiento por defecto para otros bloques
                        html = '';
                        if (block.image_url) {
                            // La ruta ya es correcta, no necesita el prefijo del host.
                            html += `<img src="${ASSET_BASE_URL}${block.image_url}" alt="${title}" class="block-image">`;
                        }
                        if (title) html += `<h2>${title}</h2>`;
                        if (content) html += `<div>${content}</div>`;
                        if (ctaText && block.cta_link) {
                            html += `<a href="${block.cta_link}" class="cta-button">${ctaText}</a>`;
                        }
                        break;
                }
                
                blockDiv.innerHTML = html;
                gridContainer.appendChild(blockDiv);
            });
            mainContent.appendChild(gridContainer);
        }
    } catch (error) {
        handleError('Error al cargar el contenido de la página principal:', error);
    }
}

/**
 * Carga y muestra los posts de una sección específica.
 * @param {string} slug - El slug de la sección.
 */
async function loadSectionContent(slug) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.innerHTML = '<p>Cargando posts...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/sections/${slug}/posts`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const posts = await response.json();

        if (posts.length === 0) {
            mainContent.innerHTML = `<p>No hay publicaciones en esta sección todavía.</p>`;
            return;
        }

        // Asumimos que el primer post nos da el nombre de la sección
        const sectionName = posts[0]?.section_name || slug;
        let html = `<h1>${sectionName}</h1>`;

        posts.forEach(post => {
            // Asumimos 'es' como idioma por defecto para los campos JSON
            const title = post.title ? (post.title.es || Object.values(post.title)[0]) : 'Sin título';
            const summary = post.smart_summary || 'No hay resumen disponible.';

            html += `
                <article class="post-summary">
                    <h2><a href="/post/${post.post_slug}">${title}</a></h2>
                    <p>${summary}</p>
                    <small>Publicado: ${new Date(post.created_at).toLocaleDateString()}</small>
                </article>
            `;
        });
        mainContent.innerHTML = html;

    } catch (error) {
        handleError(`Error al cargar el contenido de la sección ${slug}:`, error);
        mainContent.innerHTML = `<p>No se pudo cargar el contenido de esta sección.</p>`;
    }
}

/**
 * Carga y muestra el detalle completo de un post.
 * @param {string} slug - El slug del post.
 */
async function loadPostDetail(slug) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.innerHTML = '<p>Cargando post...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Post no encontrado.');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const post = await response.json();

        // Asumimos 'es' como idioma por defecto para los campos JSON
        const title = post.title ? (post.title.es || Object.values(post.title)[0]) : 'Sin título';
        const content = post.post_data?.content ? (post.post_data.content.es || Object.values(post.post_data.content)[0]) : '<p>Contenido no disponible.</p>';

        let html = `
            <article class="post-full">
                <header class="post-header">
                    <h1>${title}</h1>
                    <div class="post-meta">
                        <span>Publicado: ${new Date(post.created_at).toLocaleDateString()}</span>
                        <span>en <a href="/section/${post.section_slug}">${post.section_name}</a></span>
                    </div>
                </header>
                <div class="post-content">
                    ${content}
                </div>
            </article>
        `;
        mainContent.innerHTML = html;

    } catch (error) {
        handleError(`Error al cargar el detalle del post ${slug}:`, error);
        mainContent.innerHTML = `<p>${error.message}</p>`;
    }
}

/**
 * Carga y muestra los enlaces a redes sociales en el pie de página.
 */
async function loadSocialLinks() {
    const container = document.querySelector('.site-footer .social-links');
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/social-links`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const links = await response.json();

        if (links.length > 0) {
            const html = links.map(link => `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.name}">
                    <i class="${link.icon_class}"></i>
                </a>
            `).join('');
            container.innerHTML = html;
        } else {
            container.innerHTML = ''; // No mostrar nada si no hay enlaces
        }
    } catch (error) {
        handleError('Error al cargar los enlaces sociales:', error);
    }
}
/**
 * Enrutador simple que decide qué contenido cargar basado en la URL.
 */
function router() {
    const path = window.location.pathname;

    if (path.startsWith('/post/')) {
        const slug = path.split('/')[2];
        loadPostDetail(slug);
    } else if (path.startsWith('/section/')) {
        const slug = path.split('/')[2];
        loadSectionContent(slug);
    } else {
        // Ruta por defecto (homepage)
        loadHomepageContent();
    }
}

/**
 * Intercepta los clics en los enlaces internos para usar el router sin recargar la página.
 */
function handleNavigation(event) {
    const anchor = event.target.closest('a');
    if (anchor && anchor.hostname === window.location.hostname) {
        event.preventDefault(); // Evitar la recarga de la página
        window.history.pushState({}, '', anchor.href); // Cambiar la URL en la barra de direcciones
        router(); // Cargar el nuevo contenido
    }
}

/**
 * Inicializa el interruptor para cambiar entre tema claro y oscuro.
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Función para aplicar el tema
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Obtener tema guardado o preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    // Manejador de clic
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}


/**
 * Función de inicialización que se ejecuta cuando el DOM está listo.
 */
function initializeFrontend() {
    // Cargar todo en paralelo para un mejor rendimiento
    Promise.all([
        loadSiteSettings(),
        loadMenu(),
        loadSocialLinks() // <-- AÑADIMOS LA CARGA DE ENLACES SOCIALES
    ]).catch(error => {
        handleError('Ocurrió un error durante la inicialización del frontend.', error);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = '<p>Error al cargar el sitio. Por favor, intente recargar la página.</p>';
        }
    }).finally(() => {
        // Una vez cargado lo básico, ejecutar el enrutador para la ruta actual
        router();
    });

    // Manejar la navegación del historial (botones de atrás/adelante del navegador)
    window.addEventListener('popstate', router);

    // Manejar los clics en los enlaces para la navegación SPA
    document.addEventListener('click', handleNavigation);

    // Inicializar componentes de UI adicionales
    initThemeToggle();
}

// Ejecutar la inicialización cuando el documento esté completamente cargado.
document.addEventListener('DOMContentLoaded', initializeFrontend);