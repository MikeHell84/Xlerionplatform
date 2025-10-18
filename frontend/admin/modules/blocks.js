// frontend/admin/modules/blocks.js
import { contentBlocksApi, i18nApi } from '../api.js';

// --- DOM Element Cache ---
const listContainer = document.getElementById('content-blocks-list');
const contentBlockForm = document.getElementById('content-block-form');
const blockIdField = document.getElementById('content-block-id');
const blockTypeSelect = document.getElementById('content-block-type');
const formTitle = document.getElementById('content-block-form-title');
const saveBtn = document.getElementById('save-content-block-btn');
const cancelBtn = document.getElementById('cancel-content-block-edit-btn');
const multilingualFieldsContainer = document.getElementById('multilingual-block-fields');

let availableLanguages = [];

/**
 * Carga los bloques de contenido en el panel.
 */
export async function loadContentBlocks() {
    if (!listContainer) return;
    try {
        const blocks = await contentBlocksApi.getAll();
        listContainer.innerHTML = '';
        blocks.forEach(block => {
            const blockEl = document.createElement('div');
            blockEl.className = 'sortable-item';
            blockEl.dataset.id = block.id;
            blockEl.innerHTML = `
                <span>
                    <i class="drag-handle fas fa-grip-vertical"></i>
                    <strong>${block.title || 'Bloque sin título'}</strong> (${block.type}) - ${block.is_active ? 'Activo' : 'Inactivo'}
                </span>
                <div class="item-actions">
                    <button class="edit-block-btn" data-id="${block.id}" style="background-color: #ffc107;">Editar</button>
                    <button class="delete-block-btn" data-id="${block.id}" style="background-color: #dc3545;">Eliminar</button>
                </div>
            `;
            listContainer.appendChild(blockEl);
        });
        initializeSortable();
    } catch (error) {
        listContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

/**
 * Inicializa los manejadores de eventos para la gestión de bloques.
 */
export function initBlocksManager(languages) {
    if (!contentBlockForm) return;

    availableLanguages = languages || [];

    contentBlockForm.addEventListener('submit', handleSaveBlock);
    cancelBtn.addEventListener('click', resetContentBlockForm);
    blockTypeSelect.addEventListener('change', () => updateFormUIForBlockType(blockTypeSelect.value));

    listContainer.addEventListener('click', e => {
        if (e.target.classList.contains('edit-block-btn')) {
            handleEditContentBlock(e.target.dataset.id);
        }
        if (e.target.classList.contains('delete-block-btn')) {
            handleDeleteContentBlock(e.target.dataset.id);
        }
    });

    // Lógica para añadir/eliminar items de FAQ
    document.getElementById('faq-items-container')?.addEventListener('click', e => {
        if (e.target.id === 'add-faq-item-btn') addFaqItem();
        if (e.target.classList.contains('remove-faq-item-btn')) e.target.closest('.faq-item').remove();
    });

    // Lógica para el editor de columnas
    document.getElementById('column-count-select')?.addEventListener('change', e => {
        generateColumnTextareas(e.target.value);
    });

    // Lógica para eliminar imágenes de la galería en la previsualización
    document.getElementById('gallery-preview')?.addEventListener('click', e => {
        if (e.target.classList.contains('remove-gallery-image-btn')) {
            e.target.closest('.gallery-preview-item').remove();
        }
    });

    // Lógica para eliminar la imagen única
    document.getElementById('image-preview-container')?.addEventListener('click', e => {
        if (e.target.id === 'remove-single-image-btn') {
            const container = document.getElementById('image-preview-container');
            container.innerHTML = '';
            container.dataset.imageUrl = '';
        }
    });
}

// --- Funciones de Ayuda (Helpers) ---

async function handleSaveBlock(e) {
    e.preventDefault();
    const id = blockIdField.value;
    const formData = new FormData();
    const blockType = blockTypeSelect.value;

    // Recopilar datos multilingües
    const title = {};
    const content = {};
    const cta_text = {};

    availableLanguages.forEach(lang => {
        const langCode = lang.code;
        title[langCode] = document.querySelector(`[name="title"][data-lang="${langCode}"]`)?.value || '';
        content[langCode] = document.querySelector(`[name="content"][data-lang="${langCode}"]`)?.value || '';
        cta_text[langCode] = document.querySelector(`[name="cta_text"][data-lang="${langCode}"]`)?.value || '';
    });

    formData.append('type', blockType);
    formData.append('title', JSON.stringify(title));
    formData.append('content', JSON.stringify(content));
    formData.append('cta_text', JSON.stringify(cta_text));

    formData.append('cta_link', document.getElementById('content-block-cta-link').value);
    formData.append('is_active', document.getElementById('content-block-is-active').checked ? 1 : 0);
    formData.append('background_color', document.getElementById('content-block-bg-color').value);
    formData.append('text_color', document.getElementById('content-block-text-color').value);

    // Asegurarse de enviar la URL de la imagen existente si no se sube una nueva
    const existingImageUrl = document.getElementById('image-preview-container').dataset.imageUrl;
    formData.append('existing_image_url', existingImageUrl || '');


    // Archivos de imagen
    const imageInput = document.getElementById('content-block-image');
    if (imageInput.files.length > 0) {
        // El backend espera un solo archivo con el nombre 'image'
        formData.append('image', imageInput.files[0]);
    }

    try {
        id ? await contentBlocksApi.update(id, formData) : await contentBlocksApi.create(formData);
        resetContentBlockForm();
        loadContentBlocks();
    } catch (error) {
        alert(error.message);
    }
}

async function handleEditContentBlock(id) {
    try {
        const block = await contentBlocksApi.getById(id); // Asumiendo que existe getById
        resetContentBlockForm(); // Limpiar antes de llenar

        blockIdField.value = block.id;
        blockTypeSelect.value = block.type;
        updateFormUIForBlockType(block.type, block); // Ajustar UI y rellenar datos

        document.getElementById('content-block-cta-link').value = block.cta_link;
        document.getElementById('content-block-is-active').checked = block.is_active;
        document.getElementById('content-block-bg-color').value = block.background_color || '#ffffff';
        document.getElementById('content-block-text-color').value = block.text_color || '#212529';

        // Llenar contenido específico
        if (block.type === 'accordion') JSON.parse(block.content || '[]').forEach(faq => addFaqItem(faq.question, faq.answer));

        // Manejar imagen única
        const imagePreviewContainer = document.getElementById('image-preview-container');
        if (block.image_url) {
            imagePreviewContainer.dataset.imageUrl = block.image_url;
            imagePreviewContainer.innerHTML = `<div class="image-preview-item"><img src="http://localhost:3000${block.image_url}" alt="Imagen actual"><button type="button" id="remove-single-image-btn">×</button></div>`;
        }

        formTitle.textContent = 'Editar Bloque';
        saveBtn.textContent = 'Guardar Cambios';
        cancelBtn.style.display = 'inline-block';
        contentBlockForm.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert(`Error al cargar el bloque para editar: ${error.message}`);
    }
}

async function handleDeleteContentBlock(id) {
    if (confirm('¿Estás seguro de eliminar este bloque?')) {
        try {
            await contentBlocksApi.delete(id);
            loadContentBlocks();
        } catch (error) {
            alert(error.message);
        }
    }
}

function resetContentBlockForm() {
    contentBlockForm.reset();
    blockIdField.value = '';
    formTitle.textContent = 'Añadir Nuevo Bloque';
    saveBtn.textContent = 'Añadir Bloque';
    cancelBtn.style.display = 'none';
    multilingualFieldsContainer.innerHTML = '';
    document.getElementById('gallery-preview').innerHTML = '';
    document.getElementById('image-preview-container').innerHTML = '';
    document.getElementById('image-preview-container').dataset.imageUrl = '';
    document.getElementById('faq-items-container').innerHTML = '<label>Preguntas y Respuestas</label><button type="button" id="add-faq-item-btn" style="margin-bottom: 10px;">Añadir Pregunta</button>';
    generateColumnTextareas(document.getElementById('column-count-select').value);
    updateFormUIForBlockType(blockTypeSelect.value);
}

function initializeSortable() {
    if (listContainer) {
        new Sortable(listContainer, {
            animation: 150,
            handle: '.drag-handle',
            onEnd: async function (evt) {
                const order = Array.from(evt.target.children).map(item => item.dataset.id);
                try {
                    await contentBlocksApi.updateOrder(order);
                } catch (error) {
                    alert('No se pudo guardar el nuevo orden.');
                    loadContentBlocks(); // Recargar para revertir
                }
            }
        });
    }
}

// --- Funciones de UI específicas para tipos de bloques ---

function updateFormUIForBlockType(type, blockData = null) {
    multilingualFieldsContainer.innerHTML = ''; // Limpiar campos anteriores

    const fields = {
        image: document.getElementById('content-block-image').parentElement,
        faq: document.getElementById('faq-items-container'),
        columns: document.getElementById('columns-editor-container'),
        divisor: document.getElementById('divisor-settings-container'),
        spacer: document.getElementById('spacer-settings-container'),
    };

    // Ocultar todo por defecto
    Object.values(fields).forEach(f => { if(f) f.style.display = 'none'; });
    document.getElementById('content-block-cta-link').parentElement.style.display = 'block';

    // Mostrar campos según el tipo
    const show = (keys) => keys.forEach(key => { if(fields[key]) fields[key].style.display = 'block'; });

    let requiredFields = [];

    switch (type) {
        case 'text': requiredFields = ['title', 'content']; break;
        case 'image_left':
        case 'image_right': requiredFields = ['title', 'content', 'cta_text']; show(['image']); break;
        case 'cta': requiredFields = ['title', 'content', 'cta_text']; break;
        case 'gallery': requiredFields = ['title', 'content']; show(['image']); document.getElementById('content-block-image').multiple = true; break;
        case 'youtube': requiredFields = ['title', 'content']; break; // cta_link se usa para la URL del video
        case 'testimonial': requiredFields = ['title', 'content']; show(['image']); break;
        case 'accordion': requiredFields = ['title']; show(['faq']); break;
        case 'columns': requiredFields = ['title']; show(['columns']); break;
        case 'card': requiredFields = ['title', 'content', 'cta_text']; show(['image']); break;
        case 'counter': requiredFields = ['title', 'content']; break;
        case 'divisor': requiredFields = ['title']; show(['divisor']); break;
        case 'spacer': show(['spacer']); break;
        default: requiredFields = ['title', 'content']; break;
    }

    generateMultilingualFields(requiredFields, blockData);
}

function generateMultilingualFields(fieldNames, blockData) {
    let html = '';
    availableLanguages.forEach(lang => {
        html += `<fieldset class="language-fieldset"><legend>${lang.name}</legend>`;
        fieldNames.forEach(fieldName => {
            const value = blockData && blockData[fieldName] ? (blockData[fieldName][lang.code] || '') : '';
            const label = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (fieldName === 'content') {
                html += `
                    <div class="form-group">
                        <label for="${fieldName}-${lang.code}">${label}</label>
                        <textarea id="${fieldName}-${lang.code}" name="${fieldName}" data-lang="${lang.code}" rows="5">${value}</textarea>
                    </div>`;
            } else {
                html += `
                    <div class="form-group">
                        <label for="${fieldName}-${lang.code}">${label}</label>
                        <input type="text" id="${fieldName}-${lang.code}" name="${fieldName}" data-lang="${lang.code}" value="${value}">
                    </div>`;
            }
        });
        html += `</fieldset>`;
    });
    multilingualFieldsContainer.innerHTML = html;
}

function addFaqItem(question = '', answer = '') {
    const container = document.getElementById('faq-items-container');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'faq-item';
    itemDiv.innerHTML = `<input type="text" class="faq-question" placeholder="Pregunta" value="${question}"><textarea class="faq-answer" rows="3" placeholder="Respuesta">${answer}</textarea><button type="button" class="remove-faq-item-btn">Eliminar</button>`;
    container.appendChild(itemDiv);
}

function getFaqData() {
    const items = [];
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question').value;
        const answer = item.querySelector('.faq-answer').value;
        if (question && answer) items.push({ question, answer });
    });
    return JSON.stringify(items);
}

function generateColumnTextareas(count, contents = []) {
    const container = document.getElementById('column-textareas-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
    for (let i = 0; i < count; i++) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'column-editor-item';
        itemDiv.innerHTML = `<label>Columna ${i + 1}</label><textarea class="column-content-textarea" placeholder="Contenido...">${contents[i] || ''}</textarea>`;
        container.appendChild(itemDiv);
    }
}

function getColumnsData() {
    const columnCount = document.getElementById('column-count-select').value;
    const columns = Array.from(document.querySelectorAll('.column-content-textarea')).map(textarea => ({ content: textarea.value }));
    return JSON.stringify({ columnCount: parseInt(columnCount, 10), columns });
}

function getGalleryData() {
    return JSON.stringify(Array.from(document.querySelectorAll('.gallery-preview-item')).map(item => item.dataset.path));
}

function getDivisorData() {
    return JSON.stringify({
        style: document.getElementById('divisor-style').value,
        thickness: parseInt(document.getElementById('divisor-thickness').value, 10)
    });
}

function getSpacerData() {
    return JSON.stringify({
        height: parseInt(document.getElementById('spacer-height').value, 10)
    });
}