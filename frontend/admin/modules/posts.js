// frontend/admin/modules/posts.js
import { postsApi, sectionsApi, i18nApi } from '../api.js';
import { formTemplates } from '../form-templates.js';

// --- DOM Element Cache ---
const createPostForm = document.getElementById('create-post-form');
const postsListContainer = document.getElementById('posts-list');
const sectionSelect = document.getElementById('post-section');
const dynamicFieldsContainer = document.getElementById('dynamic-post-fields');
const postIdField = document.getElementById('post-id');
const postFormTitle = document.getElementById('post-form-title');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const paginationContainer = document.getElementById('posts-pagination');
const showAllPostsBtn = document.getElementById('show-all-posts-btn');
const postsSectionTitle = document.getElementById('posts-section-title');
const searchPostsForm = document.getElementById('search-posts-form');
const searchPostsInput = document.getElementById('search-posts-input');
const exportPostsBtn = document.getElementById('export-posts-btn');

let availableLanguages = []; // Caché para los idiomas

/**
 * Carga los posts desde el backend y los muestra en la lista.
 * @param {number} [page=1] - El número de página a cargar.
 * @param {number|null} [sectionId=null] - El ID de la sección para filtrar posts.
 * @param {string|null} [searchTerm=null] - Término de búsqueda para filtrar por título.
 */
export async function loadPosts(page = 1, sectionId = null, searchTerm = null) {
    if (!postsListContainer) return;
    try {
        const { posts, currentPage, totalPages } = await postsApi.getAll(page, sectionId, searchTerm);
        postsListContainer.innerHTML = `
            <ul class="item-list">
                ${posts.map(p => {
                    let statusText = p.status;
                    let statusClass = `status-${p.status}`;
                    if (p.status === 'scheduled' && p.publish_at) {
                        statusText = `Programado para ${new Date(p.publish_at).toLocaleString()}`;
                        statusClass = 'status-scheduled';
                    }
                    return `
                    <li>
                        <span>${p.title} <span class="post-status ${statusClass}">${statusText}</span></span>
                        <div class="item-actions">
                            <button class="edit-btn" data-id="${p.id}" style="background-color: #ffc107;">Editar</button>
                            <button class="delete-btn" data-id="${p.id}" style="background-color: #dc3545;">Eliminar</button>
                        </div>
                    </li>`;
                }).join('')}
            </ul>`;
        renderPagination(currentPage, totalPages, sectionId, searchTerm);
    } catch (error) {
        postsListContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

/**
 * Carga las secciones en el menú desplegable del formulario de posts.
 */
export async function populateSectionDropdown(languages) {
    if (!sectionSelect) return;
    availableLanguages = languages || [];
    try {
        const sections = await sectionsApi.getAll();
        sectionSelect.innerHTML = '<option value="" disabled selected>Selecciona una sección</option>';
        sections.forEach(section => {
            if (section.status === 'active') { // Solo mostrar secciones activas
                const option = document.createElement('option');
                option.value = section.id;
                option.textContent = section.name;
                sectionSelect.appendChild(option);
            }
        });
    } catch (error) {
        sectionSelect.innerHTML = `<option value="">${error.message}</option>`;
    }
}

/**
 * Inicializa todos los manejadores de eventos para la gestión de posts.
 */
export function initPostsManager(languages) {
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleSavePost);
    }
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', resetPostForm);
    }
    if (postsListContainer) {
        postsListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) handleEditPost(e.target.dataset.id);
            if (e.target.classList.contains('delete-btn')) handleDeletePost(e.target.dataset.id);
        });
    }
    if (sectionSelect) {
        sectionSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            generatePostFormFields(selectedOption.text, languages);
        });
    }
    if (showAllPostsBtn) {
        showAllPostsBtn.addEventListener('click', () => {
            if (postsSectionTitle) postsSectionTitle.textContent = 'Todos los Posts';
            showAllPostsBtn.style.display = 'none';
            loadPosts(1, null);
        });
    }
    if (searchPostsForm) {
        searchPostsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchPostsInput.value.trim();
            loadPosts(1, null, searchTerm);
        });
    }
    if (exportPostsBtn) {
        exportPostsBtn.addEventListener('click', () => {
            const exportUrl = `${postsApi.getExportUrl()}`;
            // Abrir la URL de exportación en una nueva pestaña para iniciar la descarga
            window.open(exportUrl, '_blank');
        });
    }
}

// --- Funciones de Ayuda (Helpers) ---

async function handleSavePost(e) {
    e.preventDefault();
    const postId = postIdField.value;
    const isUpdating = postId !== '';

    // Guardar contenido de TinyMCE si existe
    const contentField = document.querySelector('#dynamic-post-fields textarea[name="content"]');
    if (contentField && tinymce.get(contentField.id)) {
        tinymce.get(contentField.id).save();
    }

    // Recopilar datos multilingües
    const postData = {};
    availableLanguages.forEach(lang => {
        const langCode = lang.code;
        const fieldsInLang = document.querySelectorAll(`#dynamic-post-fields [data-lang="${langCode}"]`);
        fieldsInLang.forEach(field => {
            const name = field.getAttribute('name');
            if (!postData[name]) {
                postData[name] = {};
            }
            postData[name][langCode] = field.value;
        });
    });

    // El título ahora es un objeto JSON
    const title = postData.title;
    delete postData.title; // El título se envía por separado

    const section_id = sectionSelect.value;
    const publish_at = document.getElementById('publish_at').value;
    let status = e.submitter ? e.submitter.value : 'published';

    if (status === 'published' && publish_at && new Date(publish_at) > new Date()) {
        status = 'scheduled';
    }

    const body = { title, post_data: postData, section_id, status };
    if (publish_at) body.publish_at = publish_at;

    try {
        isUpdating ? await postsApi.update(postId, body) : await postsApi.create(body);
        resetPostForm();
        loadPosts();
        alert(`¡Post ${isUpdating ? 'actualizado' : 'guardado'} con éxito!`);
    } catch (error) {
        alert(error.message);
    }
}

async function handleEditPost(id) {
    try {
        const post = await postsApi.getById(id);
        sectionSelect.value = post.section_id;
        sectionSelect.dispatchEvent(new Event('change')); // Genera el formulario correcto

        // Esperar un ciclo para que el DOM se actualice con los nuevos campos
        setTimeout(() => {
            postIdField.value = post.id;
            if (post.publish_at) {
                const date = new Date(post.publish_at);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                document.getElementById('publish_at').value = date.toISOString().slice(0, 16);
            }

            fillDynamicForm(post.title, post.post_data);

            if (postFormTitle) postFormTitle.textContent = 'Editar Post';
            if (cancelEditBtn) cancelEditBtn.style.display = 'inline-block';
            createPostForm.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    } catch (error) {
        alert(error.message);
    }
}

async function handleDeletePost(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
        try {
            await postsApi.delete(id);
            loadPosts();
        } catch (error) {
            alert(error.message);
        }
    }
}

function resetPostForm() {
    if (createPostForm) createPostForm.reset();
    const contentField = document.querySelector('#dynamic-post-fields textarea[name="content"]');
    if (contentField && tinymce.get(contentField.id)) {
        tinymce.remove(`#${contentField.id}`);
    }
    if (dynamicFieldsContainer) dynamicFieldsContainer.innerHTML = '';
    if (postIdField) postIdField.value = '';
    if (postFormTitle) postFormTitle.textContent = 'Crear Nuevo Post';
    if (cancelEditBtn) cancelEditBtn.style.display = 'none';
}

function generatePostFormFields(sectionName, languages) {
    if (!dynamicFieldsContainer) return;
    dynamicFieldsContainer.innerHTML = '';

    // Usar los idiomas pasados como argumento
    availableLanguages = languages || [];

    const templateFunction = formTemplates[sectionName] || formTemplates['default'];
    // Generar campos para cada idioma
    let fullFormHtml = '';
    availableLanguages.forEach(lang => {
        fullFormHtml += `<fieldset class="language-fieldset">`;
        fullFormHtml += `<legend>${lang.name}</legend>`;
        fullFormHtml += templateFunction(lang.code); // Pasar el código de idioma a la plantilla
        fullFormHtml += `</fieldset>`;
    });

    dynamicFieldsContainer.innerHTML = fullFormHtml;
    initializeTinyMCE();
}


function initializeTinyMCE() {
    const contentField = document.querySelector('#dynamic-post-fields textarea[name="content"]');
    if (contentField) {
        if (tinymce.get(contentField.id)) tinymce.remove(`#${contentField.id}`);
        tinymce.init({
            selector: `#${contentField.id}`,
            plugins: 'code table lists image link',
            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | indent outdent | bullist numlist | code | table | link image',
            height: 400,
        });
    }
}

function fillDynamicForm(titleData, postData) {
    const allData = { title: titleData, ...postData };

    for (const fieldName in allData) {
        const fieldData = allData[fieldName];
        if (typeof fieldData === 'object' && fieldData !== null) {
            // Es un campo multilingüe (JSON)
            for (const langCode in fieldData) {
                const value = fieldData[langCode];
                const field = document.querySelector(`#dynamic-post-fields [name="${fieldName}"][data-lang="${langCode}"]`);
                if (field) {
                    const editor = tinymce.get(field.id);
                    if (editor) {
                        editor.on('init', () => editor.setContent(value || ''));
                        if (editor.initialized) editor.setContent(value || '');
                    } else {
                        field.value = value;
                    }
                }
            }
        } 
        // Aquí se podría añadir lógica para campos no multilingües si los hubiera
    }
}


function renderPagination(currentPage, totalPages, sectionId, searchTerm) {
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }
    paginationContainer.innerHTML = `
        <button class="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span>Página ${currentPage} de ${totalPages}</span>
        <button class="next-page" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
    `;
    document.querySelector('.prev-page')?.addEventListener('click', () => loadPosts(currentPage - 1, sectionId, searchTerm));
    document.querySelector('.next-page')?.addEventListener('click', () => loadPosts(currentPage + 1, sectionId, searchTerm));
}