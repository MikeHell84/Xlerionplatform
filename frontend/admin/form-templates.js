// frontend/admin/form-templates.js

/**
 * Este módulo centraliza la generación de campos de formulario para cada tipo de sección.
 * Cada función devuelve el HTML correspondiente a los campos de un formulario específico.
 * Esto reemplaza el gran bloque `switch` en admin.js, haciendo el código más modular y fácil de mantener.
 */

const getSuggestion = (text) => `<p class="form-suggestion">💡 <strong>Consejo:</strong> ${text}</p>`;

const seoFields = (langCode) => `
    <details class="seo-details">
        <summary>Campos de SEO (Opcional)</summary>
        <div class="form-group">
            <label for="field-seo-title-${langCode}">Meta Título SEO</label>
            <input type="text" id="field-seo-title-${langCode}" name="seo_meta_title" data-lang="${langCode}" placeholder="Título para buscadores (Google, etc.)">
            <p class="form-suggestion">Si se deja en blanco, se usará el título del post.</p>
        </div>
        <div class="form-group">
            <label for="field-seo-description-${langCode}">Meta Descripción SEO</label>
            <textarea id="field-seo-description-${langCode}" name="seo_meta_description" data-lang="${langCode}" rows="3" placeholder="Descripción corta y atractiva para buscadores."></textarea>
            <p class="form-suggestion">Si se deja en blanco, se podría usar un extracto del contenido o la descripción SEO global.</p>
        </div>
    </details>
`;

const blog = (langCode) => `
    ${getSuggestion('Escribe títulos claros y atractivos. Usa la imagen destacada para captar la atención y organiza el contenido con subtítulos y listas.')}
    <div class="form-group">
        <label for="field-title">Título del Artículo</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-image">URL de la Imagen Destacada</label>
        <input type="text" id="field-image-${langCode}" name="featured_image_url" data-lang="${langCode}" placeholder="https://ejemplo.com/imagen.jpg">
    </div>
    <div class="form-group">
        <label for="field-content">Contenido (formato enriquecido)</label> 
        <textarea id="field-content-${langCode}" name="content" data-lang="${langCode}" rows="12" required></textarea>
    </div>
    <div class="form-group">
        <label for="field-category">Categoría</label>
        <input type="text" id="field-category-${langCode}" name="category" data-lang="${langCode}" placeholder="Ej: Desarrollo Web, Noticias">
    </div>
    <div class="form-group">
        <label for="field-tags">Etiquetas (separadas por coma)</label>
        <input type="text" id="field-tags-${langCode}" name="tags" data-lang="${langCode}" placeholder="marketing, seo, javascript">
    </div>
    <div class="form-group">
        <label for="field-author">Autor</label>
        <input type="text" id="field-author-${langCode}" name="author" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const servicios = (langCode) => `
    ${getSuggestion('Sé claro y conciso. Destaca los beneficios clave que el cliente obtendrá y finaliza con una llamada a la acción clara como "Cotizar" o "Saber más".')}
    <div class="form-group">
        <label for="field-name">Nombre del Servicio</label> 
        <input type="text" id="field-name-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-short-description">Descripción Corta</label>
        <textarea id="field-short-description-${langCode}" name="short_description" data-lang="${langCode}" rows="3" placeholder="Un resumen atractivo de lo que ofreces." required></textarea>
    </div>
    <div class="form-group">
        <label for="field-image">URL de la Imagen Representativa</label> 
        <input type="text" id="field-image-${langCode}" name="image_url" data-lang="${langCode}" placeholder="https://ejemplo.com/imagen.jpg">
    </div>
    <div class="form-group">
        <label for="field-benefits">Beneficios (uno por línea)</label>
        <textarea id="field-benefits-${langCode}" name="benefits" data-lang="${langCode}" rows="5"></textarea>
    </div>
    <div class="form-group">
        <label for="field-price">Precio (si aplica, ej: 99.99 o "Consultar")</label>
        <input type="text" id="field-price-${langCode}" name="price" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-cta-text">Texto del Botón de Contacto</label>
        <input type="text" id="field-cta-text-${langCode}" name="cta_text" data-lang="${langCode}" placeholder="Cotizar ahora">
    </div>
    <div class="form-group">
        <label for="field-cta-link">Enlace del Botón (ej: /contacto)</label>
        <input type="text" id="field-cta-link-${langCode}" name="cta_link" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const proyectos = (langCode) => `
    ${getSuggestion('Muestra tu mejor trabajo. Describe el desafío y la solución que aportaste. Una buena galería visual es clave para impresionar a potenciales clientes.')}
    <div class="form-group">
        <label for="field-title">Nombre del Proyecto</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-client">Cliente</label>
        <input type="text" id="field-client-${langCode}" name="client" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-year">Año de Ejecución</label>
        <input type="number" id="field-year-${langCode}" name="year" data-lang="${langCode}" placeholder="2024">
    </div>
    <div class="form-group">
        <label for="field-tech">Tecnologías Utilizadas</label>
        <input type="text" id="field-tech-${langCode}" name="technologies" data-lang="${langCode}" placeholder="Node.js, React, MySQL...">
    </div>
    <div class="form-group">
        <label for="field-description">Descripción Detallada</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="8"></textarea>
    </div>
    <div class="form-group">
        <label for="field-gallery">Galería de Imágenes/Video (URLs, una por línea)</label> 
        <textarea id="field-gallery-${langCode}" name="gallery_urls" data-lang="${langCode}" rows="5"></textarea>
    </div>
    ${seoFields(langCode)}
`;

const testimonios = (langCode) => `
    ${getSuggestion('Los testimonios con foto y cargo generan más confianza. Pide a tus clientes un comentario específico sobre el valor que les aportaste.')}
    <div class="form-group">
        <label for="field-author-name">Nombre del Cliente</label> 
        <input type="text" id="field-author-name-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-author-role">Cargo/Empresa</label>
        <input type="text" id="field-author-role-${langCode}" name="author_role" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-photo">URL de la Foto</label>
        <input type="text" id="field-photo-${langCode}" name="photo_url" data-lang="${langCode}" placeholder="https://ejemplo.com/foto.jpg">
    </div>
    <div class="form-group">
        <label for="field-comment">Comentario</label> 
        <textarea id="field-comment-${langCode}" name="comment" data-lang="${langCode}" rows="5" required></textarea>
    </div>
    <div class="form-group">
        <label for="field-rating">Calificación (opcional, de 1 a 5)</label>
        <input type="number" id="field-rating-${langCode}" name="rating" data-lang="${langCode}" min="1" max="5" step="0.5" placeholder="4.5">
    </div>
    ${seoFields(langCode)}
`;

const galeria = (langCode) => `
    ${getSuggestion('Ideal para mostrar eventos, productos o instalaciones. Agrupa las imágenes por categorías para facilitar la navegación.')}
    <div class="form-group">
        <label for="field-title">Título de la Galería</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="3"></textarea>
    </div>
    <div class="form-group">
        <label for="field-media">Imágenes/Videos (URLs, una por línea)</label> 
        <textarea id="field-media-${langCode}" name="media_urls" data-lang="${langCode}" rows="8" required></textarea>
    </div>
    <div class="form-group">
        <label for="field-category">Categorías o Etiquetas (separadas por coma)</label>
        <input type="text" id="field-category-${langCode}" name="category" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const contacto = (langCode) => `
    ${getSuggestion('Facilita que te contacten. Asegúrate de que el teléfono y el correo sean correctos. El mapa ayuda a los clientes a encontrarte físicamente.')}
    <div class="form-group">
        <label for="field-title">Título (ej: "Información de Contacto")</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" value="Información de Contacto" required>
    </div>
    <div class="form-group">
        <label for="field-phone">Teléfono y Correo Directo</label>
        <input type="tel" id="field-phone-${langCode}" name="phone" data-lang="${langCode}" placeholder="+1 (555) 123-4567">
        <input type="email" id="field-email-${langCode}" name="direct_email" data-lang="${langCode}" placeholder="contacto@empresa.com" style="margin-top: 5px;">
    </div>
    <div class="form-group">
        <label for="field-address">Dirección</label>
        <textarea id="field-address-${langCode}" name="address" data-lang="${langCode}" rows="2"></textarea>
    </div>
    <div class="form-group">
        <label for="field-map">Mapa de Ubicación (código de inserción de Google Maps)</label> 
        <textarea id="field-map-${langCode}" name="map_embed" data-lang="${langCode}" rows="4" placeholder='<iframe src="..."></iframe>'></textarea>
    </div>
    <div class="form-group">
        <label for="field-hours">Horarios de Atención</label>
        <textarea id="field-hours-${langCode}" name="opening_hours" data-lang="${langCode}" rows="3"></textarea>
    </div>
    <p><em>Nota: El formulario de contacto (nombre, correo, mensaje) se gestiona automáticamente.</em></p>
    ${seoFields(langCode)}
`;

const sobreNosotros = (langCode) => `
    ${getSuggestion('Humaniza tu marca. Cuenta tu historia, presenta a tu equipo y comparte tus valores. Esto crea una conexión emocional con tus visitantes.')}
    <div class="form-group">
        <label for="field-title">Título (ej: "Nuestra Historia")</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" value="Sobre Nosotros" required>
    </div>
    <div class="form-group">
        <label for="field-history">Historia de la Empresa</label>
        <textarea id="field-history-${langCode}" name="history" data-lang="${langCode}" rows="6"></textarea>
    </div>
    <div class="form-group">
        <label for="field-mission">Misión y Visión</label>
        <textarea id="field-mission-${langCode}" name="mission_vision" data-lang="${langCode}" rows="4"></textarea>
    </div>
    <div class="form-group">
        <label for="field-values">Valores Corporativos (uno por línea)</label>
        <textarea id="field-values-${langCode}" name="values" data-lang="${langCode}" rows="4"></textarea>
    </div>
    <div class="form-group">
        <label for="field-image">URL de Imagen del Equipo o Instalaciones</label> 
        <input type="text" id="field-image-${langCode}" name="institutional_image_url" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const preguntasFrecuentes = (langCode) => `
    ${getSuggestion('Ahorra tiempo respondiendo las dudas más comunes de tus clientes. Agrupa las preguntas por categorías para una mejor organización.')}
    <div class="form-group">
        <label for="field-question">Pregunta</label> 
        <input type="text" id="field-question-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-answer">Respuesta</label> 
        <textarea id="field-answer-${langCode}" name="answer" data-lang="${langCode}" rows="5" required></textarea>
    </div>
    <div class="form-group">
        <label for="field-category">Categoría (opcional)</label>
        <input type="text" id="field-category-${langCode}" name="category" data-lang="${langCode}" placeholder="Ej: Pagos, Envíos">
    </div>
    <div class="form-group">
        <label for="field-author">Autor (opcional)</label>
        <input type="text" id="field-author-${langCode}" name="author" data-lang="${langCode}" placeholder="Ej: Equipo de Soporte">
    </div>
    ${seoFields(langCode)}
`;

const equipo = (langCode) => `
    ${getSuggestion('Presenta a las personas detrás de tu proyecto. Una foto profesional y una biografía breve que destaque su experiencia son ideales.')}
    <div class="form-group">
        <label for="field-name">Nombre del Miembro</label> 
        <input type="text" id="field-name-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-role">Cargo</label>
        <input type="text" id="field-role-${langCode}" name="role" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-photo">URL de la Foto</label>
        <input type="text" id="field-photo-${langCode}" name="photo_url" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-bio">Biografía Corta</label>
        <textarea id="bio-${langCode}" name="biography" data-lang="${langCode}" rows="4"></textarea>
    </div>
    <div class="form-group">
        <label for="field-social">Redes Sociales (URLs, una por línea)</label>
        <textarea id="field-social-${langCode}" name="social_links" data-lang="${langCode}" rows="3"></textarea>
    </div>
    ${seoFields(langCode)}
`;

const eventos = (langCode) => `
    ${getSuggestion('Proporciona toda la información clave: qué, cuándo y dónde. Una imagen atractiva y un enlace claro para el registro son esenciales.')}
    <div class="form-group">
        <label for="field-event-name">Nombre del Evento</label> 
        <input type="text" id="field-event-name-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-datetime">Fecha y Hora</label>
        <input type="datetime-local" id="field-datetime-${langCode}" name="event_date" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-location">Lugar</label>
        <input type="text" id="field-location-${langCode}" name="location" data-lang="${langCode}" placeholder="Ej: Online o dirección física">
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="6"></textarea>
    </div>
    <div class="form-group">
        <label for="field-image">URL de Imagen Destacada</label> 
        <input type="text" id="field-image-${langCode}" name="image_url" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-register-link">Enlace para Registro</label>
        <input type="url" id="field-register-link-${langCode}" name="register_link" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const recursos = (langCode) => `
    ${getSuggestion('Ofrece valor a tus usuarios con guías, plantillas o whitepapers. Asegúrate de que el título sea descriptivo y el enlace de descarga funcione correctamente.')}
    <div class="form-group">
        <label for="field-resource-name">Nombre del Recurso/Archivo</label> 
        <input type="text" id="field-resource-name-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-type">Tipo</label>
        <select id="field-type-${langCode}" name="resource_type" data-lang="${langCode}">
            <option value="document">Documento (PDF, DOCX)</option>
            <option value="video">Video</option>
            <option value="link">Enlace Externo</option>
        </select>
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="4"></textarea>
    </div>
    <div class="form-group">
        <label for="field-link">URL del Archivo o Enlace</label>
        <input type="url" id="field-link-${langCode}" name="file_url" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-category">Categoría</label>
        <input type="text" id="field-category-${langCode}" name="category" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const noticias = (langCode) => `
    ${getSuggestion('Similar a un blog, pero enfocado en anuncios o novedades de la empresa. Mantén un tono informativo y profesional.')}
    <div class="form-group">
        <label for="field-title">Título de la Noticia</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-image">URL de Imagen Destacada</label> 
        <input type="text" id="field-image-${langCode}" name="featured_image_url" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-content">Contenido</label>
        <textarea id="field-content-${langCode}" name="content" data-lang="${langCode}" rows="10" required></textarea>
    </div>
    <div class="form-group">
        <label for="field-category">Categoría</label>
        <input type="text" id="field-category-${langCode}" name="category" data-lang="${langCode}" placeholder="Ej: Lanzamientos, Corporativo">
    </div>
    ${seoFields(langCode)}
`;

const clientes = (langCode) => `
    ${getSuggestion('Muestra los logos de los clientes con los que has trabajado para generar prueba social. Un breve testimonio puede añadir aún más valor.')}
    <div class="form-group">
        <label for="field-client-name">Nombre del Cliente</label> 
        <input type="text" id="field-client-name-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-logo">URL del Logo</label>
        <input type="text" id="field-logo-${langCode}" name="logo_url" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-testimonial">Testimonio (opcional)</label>
        <textarea id="field-testimonial-${langCode}" name="testimonial" data-lang="${langCode}" rows="4"></textarea>
    </div>
    ${seoFields(langCode)}
`;

const integraciones = (langCode) => `
    ${getSuggestion('Describe la integración y su propósito. Usa el campo de configuración para guardar claves de API, webhooks u otros datos necesarios.')}
    <div class="form-group">
        <label for="field-integration-name">Nombre de la Integración</label> 
        <input type="text" id="field-integration-name-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="4"></textarea>
    </div>
    <div class="form-group">
        <label for="field-status">Estado</label>
        <select id="field-status-${langCode}" name="integration_status" data-lang="${langCode}">
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
        </select>
    </div>
    <div class="form-group">
        <label for="field-config">Configuración Específica (JSON)</label>
        <textarea id="field-config-${langCode}" name="config" data-lang="${langCode}" rows="6" placeholder='{ "api_key": "tu_clave", "endpoint": "https://..." }'></textarea>
    </div>
    ${seoFields(langCode)}
`;

const tutoriales = (langCode) => `
    ${getSuggestion('Crea tutoriales paso a paso. Un video es muy efectivo. Organiza los tutoriales por categoría para que los usuarios encuentren lo que buscan.')}
    <div class="form-group">
        <label for="field-title">Título del Tutorial</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="4"></textarea>
    </div>
    <div class="form-group">
        <label for="field-media-url">URL del Video o Documento</label>
        <input type="url" id="field-media-url-${langCode}" name="media_url" data-lang="${langCode}" placeholder="https://youtube.com/watch?v=... o /docs/guia.pdf" required>
    </div>
    <div class="form-group">
        <label for="field-category">Categoría</label>
        <input type="text" id="field-category-${langCode}" name="category" data-lang="${langCode}" placeholder="Ej: Primeros Pasos, Avanzado">
    </div>
    ${seoFields(langCode)}
`;

const comunidad = (langCode) => `
    ${getSuggestion('Define claramente el propósito de tu comunidad y sus reglas. Un botón de llamada a la acción visible es clave para que los usuarios se unan.')}
    <div class="form-group">
        <label for="field-title">Nombre del Grupo o Foro</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="3"></textarea>
    </div>
    <div class="form-group">
        <label for="field-image-url">URL de Imagen o Ícono</label>
        <input type="text" id="field-image-url-${langCode}" name="image_url" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-rules">Reglas de Participación (una por línea)</label>
        <textarea id="field-rules-${langCode}" name="rules" data-lang="${langCode}" rows="5"></textarea>
    </div>
    <div class="form-group">
        <label for="field-join-button-text">Texto del Botón para Unirse</label>
        <input type="text" id="field-join-button-text-${langCode}" name="join_button_text" data-lang="${langCode}" placeholder="Unirse al grupo">
    </div>
    <div class="form-group">
        <label for="field-join-button-link">Enlace del Botón</label>
        <input type="url" id="field-join-button-link-${langCode}" name="join_button_link" data-lang="${langCode}" placeholder="https://discord.gg/...">
    </div>
    ${seoFields(langCode)}
`;

const soporteTecnico = (langCode) => `
    ${getSuggestion('Esta sección es para gestionar tickets de soporte como si fueran posts. Cada "post" es un ticket.')}
    <div class="form-group">
        <label for="field-title">Título del Ticket</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-description">Descripción del Problema</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="6"></textarea>
    </div>
    <div class="form-group">
        <label for="field-status">Estado</label>
        <select id="field-status-${langCode}" name="ticket_status" data-lang="${langCode}">
            <option value="abierto">Abierto</option>
            <option value="en-progreso">En Progreso</option>
            <option value="cerrado">Cerrado</option>
        </select>
    </div>
    <div class="form-group">
        <label for="field-priority">Prioridad</label>
        <select id="field-priority-${langCode}" name="priority" data-lang="${langCode}">
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
        </select>
    </div>
    <div class="form-group">
        <label for="field-assigned-user">Usuario Asignado</label>
        <input type="text" id="field-assigned-user-${langCode}" name="assigned_user" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const documentacion = (langCode) => `
    ${getSuggestion('Escribe documentación clara y estructurada. Usa títulos, listas y bloques de código para que sea fácil de seguir.')}
    <div class="form-group">
        <label for="field-title">Título del Documento</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-content">Contenido (formato enriquecido)</label> 
        <textarea id="field-content-${langCode}" name="content" data-lang="${langCode}" rows="15"></textarea>
    </div>
    <div class="form-group">
        <label for="field-category">Categoría</label>
        <input type="text" id="field-category-${langCode}" name="category" data-lang="${langCode}" placeholder="Ej: API, Frontend, Guías">
    </div>
    <p><em>Nota: La fecha de actualización se registra automáticamente al guardar.</em></p>
    ${seoFields(langCode)}
`;

const marketplace = (langCode) => `
    ${getSuggestion('Vende tus productos o servicios. Usa una imagen de alta calidad y una descripción clara. El botón de acción debe ser directo, como "Comprar" o "Contactar".')}
    <div class="form-group">
        <label for="field-title">Nombre del Producto/Servicio</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-image-url">URL de la Imagen</label>
        <input type="text" id="field-image-url-${langCode}" name="image_url" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-price">Precio</label>
        <input type="text" id="field-price-${langCode}" name="price" data-lang="${langCode}" placeholder="Ej: 49.99">
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="6"></textarea>
    </div>
    <div class="form-group">
        <label for="field-button-text">Texto del Botón</label>
        <input type="text" id="field-button-text-${langCode}" name="button_text" data-lang="${langCode}" placeholder="Comprar Ahora">
    </div>
    <div class="form-group">
        <label for="field-button-link">Enlace del Botón</label>
        <input type="url" id="field-button-link-${langCode}" name="button_link" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const catalogo = (langCode) => `
    ${getSuggestion('Presenta tus productos de forma clara. Una buena imagen y una descripción concisa son clave. Organiza por categorías.')}
    <div class="form-group">
        <label for="field-title">Nombre del Ítem</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-image-url">URL de la Imagen</label>
        <input type="text" id="field-image-url-${langCode}" name="image_url" data-lang="${langCode}">
    </div>
    <div class="form-group">
        <label for="field-price">Precio</label>
        <input type="text" id="field-price-${langCode}" name="price" data-lang="${langCode}" placeholder="Ej: 19.99 o Consultar">
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="4"></textarea>
    </div>
    <div class="form-group">
        <label for="field-category">Categoría</label>
        <input type="text" id="field-category-${langCode}" name="category" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const enlacesUtiles = (langCode) => `
    ${getSuggestion('Comparte enlaces a otros sitios, herramientas o recursos que sean de interés para tus visitantes.')}
    <div class="form-group">
        <label for="field-title">Título del Enlace</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-url">URL</label>
        <input type="url" id="field-url-${langCode}" name="url" data-lang="${langCode}" required placeholder="https://ejemplo.com">
    </div>
    <div class="form-group">
        <label for="field-description">Descripción</label>
        <textarea id="field-description-${langCode}" name="description" data-lang="${langCode}" rows="3"></textarea>
    </div>
    ${seoFields(langCode)}
`;

const encuestas = (langCode) => `
    ${getSuggestion('Crea encuestas para recopilar la opinión de tus usuarios. Define preguntas claras y opciones de respuesta concisas.')}
    <div class="form-group">
        <label for="field-title">Título de la Encuesta</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-questions">Preguntas (una por línea)</label>
        <textarea id="field-questions-${langCode}" name="questions" data-lang="${langCode}" rows="5"></textarea>
    </div>
    <div class="form-group">
        <label for="field-options">Opciones de Respuesta (para cada pregunta, separadas por ';'. Ej: Sí;No;Quizás)</label>
        <textarea id="field-options-${langCode}" name="options" data-lang="${langCode}" rows="5"></textarea>
    </div>
    <p><em>Nota: Los resultados se visualizarán en un panel separado.</em></p>
    ${seoFields(langCode)}
`;

const formularios = (langCode) => `
    ${getSuggestion('Crea formularios personalizados. Define los campos usando el formato: nombre_campo|Tipo (text, email, textarea)|Requerido (true/false). Uno por línea.')}
    <div class="form-group">
        <label for="field-title">Nombre del Formulario</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-dynamic-fields">Campos Dinámicos</label>
        <textarea id="field-dynamic-fields-${langCode}" name="dynamic_fields" data-lang="${langCode}" rows="8" placeholder="nombre|text|true\nemail|email|true\nmensaje|textarea|true"></textarea>
    </div>
    <div class="form-group">
        <label for="field-notification-email">Email para Notificaciones</label>
        <input type="email" id="field-notification-email-${langCode}" name="notification_email" data-lang="${langCode}" placeholder="tu@email.com">
    </div>
    ${seoFields(langCode)}
`;

const defaultForm = (langCode) => `
    ${getSuggestion('Esta es una sección genérica. Asegúrate de que el título sea descriptivo y el contenido esté bien estructurado.')}
    <div class="form-group">
        <label for="field-title">Título</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required>
    </div>
    <div class="form-group">
        <label for="field-content">Contenido</label>
        <textarea id="field-content-${langCode}" name="content" data-lang="${langCode}" rows="10"></textarea>
    </div>
    <div class="form-group">
        <label for="field-image">URL de Imagen</label>
        <input type="text" id="field-image-${langCode}" name="image_url" data-lang="${langCode}">
    </div>
    ${seoFields(langCode)}
`;

const inicio = (langCode) => `
    ${getSuggestion('Esta es la página principal. Define un título y subtítulo impactantes. Usa la sección de bienvenida para contarle a tus visitantes quién eres y qué haces.')}
    <div class="form-group">
        <label for="field-title">Título Principal</label> 
        <input type="text" id="field-title-${langCode}" name="title" data-lang="${langCode}" required placeholder="Ej: Bienvenido a Mi Sitio Web">
    </div>
    <div class="form-group">
        <label for="field-subtitle">Subtítulo o Eslogan</label> 
        <input type="text" id="field-subtitle-${langCode}" name="subtitle" data-lang="${langCode}" placeholder="Ej: Soluciones creativas para un mundo digital">
    </div>
    <div class="form-group">
        <label for="field-featured-media">URL de Imagen o Video Destacado</label> 
        <input type="text" id="field-featured-media-${langCode}" name="featured_media_url" data-lang="${langCode}" placeholder="https://ejemplo.com/imagen.jpg o video.mp4">
    </div>
    <div class="form-group">
        <label for="field-welcome-content">Sección de Bienvenida (texto enriquecido)</label> 
        <textarea id="field-welcome-content-${langCode}" name="welcome_content" data-lang="${langCode}" rows="10"></textarea>
    </div>
    <div class="form-group">
        <label for="field-quick-links">Enlaces Rápidos (uno por línea, formato: Texto del enlace | /ruta)</label>
        <textarea id="field-quick-links-${langCode}" name="quick_links" data-lang="${langCode}" rows="5" placeholder="Ver Proyectos | /proyectos\nContáctanos | /contacto"></textarea>
    </div>
    ${seoFields(langCode)}
`;

export const formTemplates = {
    'Inicio': inicio,
    'Blog': blog,
    'Servicios': servicios,
    'Proyectos': proyectos,
    'Portafolio': proyectos, // Alias
    'Testimonios': testimonios,
    'Galería': galeria,
    'Contacto': contacto,
    'Sobre Nosotros': sobreNosotros,
    'Preguntas Frecuentes': preguntasFrecuentes,
    'Preguntas y Respuestas': preguntasFrecuentes, // Alias
    'Equipo': equipo,
    'Eventos': eventos,
    'Agenda': eventos, // Alias
    'Recursos': recursos,
    'Descargas': recursos, // Alias
    'Noticias': noticias,
    'Clientes': clientes,
    'Tutoriales': tutoriales,
    'Comunidad': comunidad,
    'Soporte Técnico': soporteTecnico,
    'Documentación': documentacion,
    'Integraciones': integraciones,
    'Marketplace': marketplace,
    'Catálogo': catalogo,
    'Encuestas': encuestas,
    'Formularios': formularios,
    'Enlaces Útiles': enlacesUtiles,
    // Secciones que no generan posts individuales o son manejadas por otros paneles
    'Panel de Control': () => `<p>El Panel de Control es una vista general del dashboard y no se edita como una página de contenido.</p>`,
    'Registro de Actividad': () => `<p>El Registro de Actividad es un log automático del sistema y no se gestiona como contenido.</p>`,
    'Estadísticas': () => `<p>Las Estadísticas se visualizan en el dashboard principal y en paneles dedicados, no se editan como una página.</p>`,
    'Configuración': () => `<p>La configuración general del sitio se gestiona en los paneles "Apariencia: Configuración Visual" y otros módulos específicos.</p>`,
    'Integración con IA': () => `<p>La configuración de las integraciones con IA se gestiona en un panel dedicado.</p>`,
    'Panel de Usuario': () => `<p>La gestión de usuarios y perfiles se realiza en un panel dedicado.</p>`,
    'Mapa del Sitio': () => `<p>El Mapa del Sitio se genera automáticamente y no se edita como una página de contenido.</p>`,
    'Mensajes': () => `<p>La gestión de Mensajes se realiza en un panel dedicado, no como una página de contenido.</p>`,
    'Notificaciones': () => `<p>Las Notificaciones son alertas del sistema y no se gestionan como contenido de página.</p>`,
    'Personalización Visual': () => `<p>La personalización visual (colores, fuentes, etc.) se gestiona en el panel "Apariencia: Configuración Visual".</p>`,
    'Resumen Inteligente': () => `<p>El Resumen Inteligente es una funcionalidad automática de la IA que se aplica a cada post y no se gestiona como una sección.</p>`,
    'IA Asistente': () => `<p>La configuración del Asistente de IA se gestiona en otro panel.</p>`,
    'Roles y Permisos': () => `<p>La gestión de roles y permisos se realiza en un panel de seguridad dedicado.</p>`,
    'Historial de Cambios': () => `<p>El historial de cambios es un log automático del sistema y no se gestiona como contenido.</p>`,
    'Panel de Moderación': () => `<p>La moderación de contenido (como comentarios) se realiza en su panel específico "Interacción: Moderar Comentarios".</p>`,
    'Panel de Traducción': () => `<p>La gestión de traducciones se realiza en un panel de internacionalización dedicado.</p>`,
    'Panel de Accesibilidad': () => `<p>La configuración de accesibilidad se gestiona en un panel dedicado.</p>`,
    'default': defaultForm
};