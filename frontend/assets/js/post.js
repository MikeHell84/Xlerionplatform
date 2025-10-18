document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api/public'; // Usar URL absoluta para desarrollo
    const postContainer = document.getElementById('post-container');
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    /**
     * Carga y muestra un único post basado en el ID de la URL.
     */
    async function loadSinglePost() {
        // Obtener el ID del post desde los parámetros de la URL (ej: ?id=123)
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (!postId) {
            postContainer.innerHTML = '<p class="error-message">No se ha especificado un ID de post.</p>';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
            if (!response.ok) throw new Error('El post no fue encontrado o no se pudo cargar.');

            const post = await response.json();

            // Actualizar el título de la página
            document.title = post.title;

            const postDate = new Date(post.created_at).toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // Generar el HTML estructurado y mostrarlo
            postContainer.innerHTML = renderStructuredPost(post, postDate);

            // Una vez cargado el post, cargar sus comentarios
            loadComments(postId);
        } catch (error) {
            postContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    }

    /**
     * Renderiza el contenido de un post de forma estructurada según su sección.
     * @param {object} post - El objeto del post con post_data y section_name.
     * @param {string} postDate - La fecha de publicación formateada.
     * @returns {string} El HTML generado para el post.
     */
    function renderStructuredPost(post, postDate) {
        const data = post.post_data || {};
        let contentHtml = '';

        switch (post.section_name) {
            case 'Inicio':
                const quickLinks = data.quick_links ? data.quick_links.split('\n').map(link => {
                    const [text, url] = link.split('|');
                    if (text && url) {
                        return `<a href="${url.trim()}" class="button">${text.trim()}</a>`;
                    }
                    return '';
                }).join('') : '';
                contentHtml = `
                    <h3 class="home-subtitle">${data.subtitle || ''}</h3>
                    ${data.welcome_content ? `<div class="home-welcome-content">${data.welcome_content}</div>` : ''}
                    ${quickLinks ? `<div class="home-quick-links">${quickLinks}</div>` : ''}
                `;
                break;

            case 'Blog':
                contentHtml = `
                    <div class="post-meta-tags">
                        ${data.category ? `<span class="tag category-tag">${data.category}</span>` : ''}
                        ${data.tags ? data.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : ''}
                    </div>
                    <div class="post-content">${data.content || ''}</div>
                `;
                break;

            case 'Servicios':
                const benefits = data.benefits ? data.benefits.split('\n').map(b => `<li>${b}</li>`).join('') : '';
                contentHtml = `
                    <p class="service-description">${data.short_description || ''}</p>
                    ${benefits ? `<h3>Beneficios</h3><ul class="service-benefits">${benefits}</ul>` : ''}
                    ${data.price ? `<div class="service-price"><strong>Precio:</strong> ${data.price}</div>` : ''}
                `;
                break;

            case 'Portafolio':
            case 'Proyectos':
                contentHtml = `
                    <div class="project-details">
                        <p><strong>Cliente:</strong> ${data.client || 'No especificado'}</p>
                        <p><strong>Año:</strong> ${data.year || 'No especificado'}</p>
                        <p><strong>Tecnologías:</strong> ${data.technologies || 'No especificadas'}</p>
                    </div>
                    <hr>
                    <div class="post-content">${data.description || ''}</div>
                `;
                break;

            case 'Testimonios':
                contentHtml = `
                    ${data.photo_url ? `<img src="${data.photo_url}" alt="Foto de ${post.title}" class="testimonial-photo">` : ''}
                    <blockquote class="testimonial-quote">
                        <p>"${data.comment || ''}"</p>
                        <footer>
                            — ${post.title || 'Anónimo'}
                            ${data.author_role ? `, <cite>${data.author_role}</cite>` : ''}
                        </footer>
                    </blockquote>
                    ${data.rating ? `<div class="testimonial-rating">Calificación: ${'★'.repeat(Math.floor(data.rating))}${'☆'.repeat(5 - Math.floor(data.rating))}</div>` : ''}
                `;
                // Para testimonios, el título principal puede ser el nombre del autor
                post.title = `Testimonio de ${post.title}`;
                break;

            case 'Galería':
                const mediaItems = data.media_urls ? data.media_urls.split('\n').map(url => {
                    return `<div class="gallery-item"><img src="${url.trim()}" alt="${post.title}"></div>`;
                }).join('') : '';
                contentHtml = `
                    <p class="gallery-description">${data.description || ''}</p>
                    <div class="gallery-grid">${mediaItems}</div>
                `;
                break;

            case 'Contacto':
                contentHtml = `
                    <div class="contact-info-block">
                        ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ''}
                        ${data.direct_email ? `<p><strong>Email:</strong> <a href="mailto:${data.direct_email}">${data.direct_email}</a></p>` : ''}
                        ${data.address ? `<p><strong>Dirección:</strong> ${data.address}</p>` : ''}
                        ${data.opening_hours ? `<h3>Horarios</h3><p>${data.opening_hours.replace(/\n/g, '<br>')}</p>` : ''}
                    </div>
                    ${data.map_embed ? `<div class="map-container">${data.map_embed}</div>` : ''}
                `;
                break;

            case 'Sobre Nosotros':
                const values = data.values ? data.values.split('\n').map(v => `<li>${v}</li>`).join('') : '';
                contentHtml = `
                    ${data.institutional_image_url ? `<img src="${data.institutional_image_url}" alt="Sobre Nosotros" class="about-us-image">` : ''}
                    ${data.history ? `<h3>Nuestra Historia</h3><p>${data.history}</p>` : ''}
                    ${data.mission_vision ? `<h3>Misión y Visión</h3><p>${data.mission_vision}</p>` : ''}
                    ${values ? `<h3>Nuestros Valores</h3><ul class="values-list">${values}</ul>` : ''}
                `;
                break;

            case 'Preguntas y Respuestas':
            case 'Preguntas Frecuentes':
                contentHtml = `
                    ${data.author ? `<p class="faq-author">Respondido por: <strong>${data.author}</strong></p>` : ''}
                    <div class="faq-answer">${data.answer || ''}</div>
                `;
                break;

            case 'Equipo':
                const socialLinks = data.social_links ? data.social_links.split('\n').map(link => {
                    const url = link.trim();
                    if (!url) return '';
                    let iconClass = 'fas fa-link'; // Icono por defecto
                    if (url.includes('linkedin')) iconClass = 'fab fa-linkedin';
                    if (url.includes('twitter')) iconClass = 'fab fa-twitter';
                    if (url.includes('github')) iconClass = 'fab fa-github';
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" title="${url}"><i class="${iconClass}"></i></a>`;
                }).join('') : '';
                contentHtml = `
                    <div class="team-member-card">
                        ${data.photo_url ? `<img src="${data.photo_url}" alt="Foto de ${post.title}" class="team-member-photo">` : ''}
                        <div class="team-member-info">
                            <h3 class="team-member-role">${data.role || ''}</h3>
                            <p class="team-member-bio">${data.biography || ''}</p>
                            ${socialLinks ? `<div class="team-member-social">${socialLinks}</div>` : ''}
                        </div>
                    </div>
                `;
                break;

            case 'Eventos':
                const eventDate = data.event_date ? new Date(data.event_date).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' }) : '';
                contentHtml = `
                    ${data.image_url ? `<img src="${data.image_url}" alt="${post.title}" class="event-image">` : ''}
                    <div class="event-details">
                        ${eventDate ? `<p><strong><i class="fas fa-calendar-alt"></i> Cuándo:</strong> ${eventDate}</p>` : ''}
                        ${data.location ? `<p><strong><i class="fas fa-map-marker-alt"></i> Dónde:</strong> ${data.location}</p>` : ''}
                    </div>
                    <div class="post-content">${data.description || ''}</div>
                    ${data.register_link ? `<a href="${data.register_link}" class="button event-register-btn" target="_blank" rel="noopener noreferrer">Registrarse Ahora</a>` : ''}
                `;
                break;

            case 'Recursos':
            case 'Descargas':
                let buttonText = 'Ver Recurso';
                let iconClass = 'fas fa-link';
                if (data.resource_type === 'document') {
                    buttonText = 'Descargar Documento';
                    iconClass = 'fas fa-file-pdf';
                } else if (data.resource_type === 'video') {
                    buttonText = 'Ver Video';
                    iconClass = 'fas fa-video';
                }
                contentHtml = `
                    <p class="resource-description">${data.description || ''}</p>
                    ${data.category ? `<p class="resource-category"><strong>Categoría:</strong> ${data.category}</p>` : ''}
                    ${data.file_url ? `<a href="${data.file_url}" class="button resource-button" target="_blank" rel="noopener noreferrer"><i class="${iconClass}"></i> ${buttonText}</a>` : ''}
                `;
                break;

            case 'Clientes':
                contentHtml = `
                    <div class="client-card">
                        ${data.logo_url ? `<img src="${data.logo_url}" alt="Logo de ${post.title}" class="client-logo">` : ''}
                        ${data.testimonial ? `<blockquote class="client-testimonial">"${data.testimonial}"</blockquote>` : ''}
                    </div>
                `;
                break;

            case 'Noticias':
                contentHtml = `
                    ${data.featured_image_url ? `<img src="${data.featured_image_url}" alt="${post.title}" class="news-image">` : ''}
                    ${data.category ? `<p class="news-category"><strong>Categoría:</strong> ${data.category}</p>` : ''}
                    <div class="post-content">${data.content || ''}</div>
                `;
                break;

            case 'Integraciones':
                contentHtml = `
                    <p class="integration-description">${data.description || ''}</p>
                    <div class="integration-status"><strong>Estado:</strong> <span class="status-${data.integration_status || 'inactive'}">${data.integration_status || 'Inactivo'}</span></div>
                    ${data.config ? `<h3>Configuración</h3><pre class="integration-config"><code>${data.config}</code></pre>` : ''}
                `;
                break;

            case 'Tutoriales':
                contentHtml = `
                    <p class="tutorial-description">${data.description || ''}</p>
                    ${data.category ? `<p class="tutorial-category"><strong>Categoría:</strong> ${data.category}</p>` : ''}
                    ${data.media_url ? `<a href="${data.media_url}" class="button tutorial-button" target="_blank" rel="noopener noreferrer"><i class="fas fa-play-circle"></i> Ver Tutorial</a>` : ''}
                `;
                break;

            case 'Comunidad':
                const rules = data.rules ? data.rules.split('\n').map(rule => `<li>${rule}</li>`).join('') : '';
                contentHtml = `
                    <div class="community-header">
                        ${data.image_url ? `<img src="${data.image_url}" alt="${post.title}" class="community-icon">` : ''}
                        <p class="community-description">${data.description || ''}</p>
                    </div>
                    ${rules ? `<h3>Reglas de Participación</h3><ul class="community-rules">${rules}</ul>` : ''}
                    ${data.join_button_link ? `<a href="${data.join_button_link}" class="button join-community-btn" target="_blank" rel="noopener noreferrer">${data.join_button_text || 'Unirse'}</a>` : ''}
                `;
                break;

            case 'Soporte Técnico':
                contentHtml = `
                    <div class="ticket-details">
                        <div class="ticket-detail-item">
                            <strong>Estado:</strong> <span class="ticket-status status-${data.ticket_status || 'abierto'}">${data.ticket_status || 'Abierto'}</span>
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Prioridad:</strong> <span class="ticket-priority priority-${data.priority || 'baja'}">${data.priority || 'Baja'}</span>
                        </div>
                        <div class="ticket-detail-item">
                            <strong>Asignado a:</strong> ${data.assigned_user || 'N/A'}
                        </div>
                    </div>
                    <h3>Descripción del Problema</h3>
                    <div class="post-content">${data.description || ''}</div>
                `;
                break;

            case 'Documentación':
                contentHtml = `
                    ${data.category ? `<p class="doc-category"><strong>Categoría:</strong> ${data.category}</p>` : ''}
                    <div class="post-content">${data.content || ''}</div>
                `;
                post.title = `Documentación: ${post.title}`;
                break;

            case 'Marketplace':
            case 'Catálogo':
                contentHtml = `
                    <div class="product-card">
                        ${data.image_url ? `<img src="${data.image_url}" alt="${post.title}" class="product-image">` : ''}
                        <div class="product-info">
                            ${data.category ? `<p class="product-category">${data.category}</p>` : ''}
                            <p class="product-description">${data.description || ''}</p>
                            ${data.price ? `<div class="product-price">${data.price}</div>` : ''}
                            ${data.button_link ? `<a href="${data.button_link}" class="button product-button" target="_blank" rel="noopener noreferrer">${data.button_text || 'Ver más'}</a>` : ''}
                        </div>
                    </div>
                `;
                break;

            case 'Enlaces Útiles':
                contentHtml = `
                    <p class="link-description">${data.description || ''}</p>
                    ${data.url ? `<a href="${data.url}" class="button link-button" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Visitar Enlace</a>` : ''}
                `;
                break;

            case 'Encuestas':
                const questions = data.questions ? data.questions.split('\n').map((q, index) => {
                    const options = data.options ? (data.options.split('\n')[index] || '').split(';').map(opt => `<label><input type="radio" name="q${index}" value="${opt.trim()}"> ${opt.trim()}</label>`).join('') : '';
                    return `<div class="survey-question"><h4>${q}</h4><div class="survey-options">${options}</div></div>`;
                }).join('') : '';
                contentHtml = `
                    <form class="survey-form">
                        ${questions}
                        <button type="submit" class="button">Enviar Encuesta</button>
                    </form>
                `;
                break;

            case 'Formularios':
                const fields = data.dynamic_fields ? data.dynamic_fields.split('\n').map(field => {
                    const [name, type, required] = field.split('|');
                    if (!name || !type) return '';
                    const reqAttr = required === 'true' ? 'required' : '';
                    const inputEl = type === 'textarea'
                        ? `<textarea name="${name.trim()}" ${reqAttr}></textarea>`
                        : `<input type="${type.trim()}" name="${name.trim()}" ${reqAttr}>`;
                    return `<div class="form-group"><label>${name.trim().replace(/_/g, ' ')}</label>${inputEl}</div>`;
                }).join('') : '';
                contentHtml = `
                    <form class="dynamic-form">${fields}<button type="submit" class="button">Enviar</button></form>
                `;
                break;

            default:
                // Comportamiento por defecto para secciones no especificadas
                contentHtml = `<div class="post-content">${post.content || ''}</div>`;
                break;
        }

        // Estructura principal que envuelve el contenido dinámico
        return `
            <article class="structured-post type-${post.section_name?.toLowerCase() || 'default'}">
                <h2>${post.title}</h2>
                <p class="post-meta">Publicado el ${postDate}</p>
                <div class="structured-content-body">
                    ${contentHtml}
                </div>
            </article>
        `;
    }

    /**
     * Carga y muestra los comentarios de un post.
     * @param {string} postId - El ID del post.
     */
    async function loadComments(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
            const comments = await response.json();
            commentsList.innerHTML = ''; // Limpiar lista

            if (comments.length === 0) {
                commentsList.innerHTML = '<p>Aún no hay comentarios. ¡Sé el primero!</p>';
                return;
            }

            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item';
                commentDiv.innerHTML = `
                    <p><strong>${comment.author_name}</strong> dijo:</p>
                    <p>${comment.content}</p>
                `;
                commentsList.appendChild(commentDiv);
            });
        } catch (error) {
            commentsList.innerHTML = '<p>No se pudieron cargar los comentarios.</p>';
        }
    }

    // Manejar el envío del formulario de comentarios
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        const author_name = document.getElementById('author_name').value;
        const content = document.getElementById('comment_content').value;

        try {
            await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author_name, content })
            });
            commentForm.reset();
            loadComments(postId); // Recargar comentarios
        } catch (error) {
            alert('Hubo un error al enviar tu comentario.');
        }
    });

    loadSinglePost();
});