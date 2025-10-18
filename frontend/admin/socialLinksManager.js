// frontend/admin/socialLinksManager.js
import { socialLinksApi } from './api.js';

const socialLinkForm = document.getElementById('social-link-form');
const listContainer = document.getElementById('social-links-list');

export async function loadSocialLinks() {
    if (!listContainer) return;
    try {
        const links = await socialLinksApi.getAll();
        listContainer.innerHTML = `
            <ul class="item-list">
                ${links.map(link => `
                    <li>
                        <span><i class="${link.icon_class}"></i> ${link.name}</span>
                        <div class="item-actions">
                            <button class="edit-social-link-btn" data-id="${link.id}" style="background-color: #ffc107;">Editar</button>
                            <button class="delete-social-link-btn" data-id="${link.id}" style="background-color: #dc3545;">Eliminar</button>
                        </div>
                    </li>
                `).join('')}
            </ul>`;
    } catch (error) {
        listContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

async function handleSaveSocialLink(e) {
    e.preventDefault();
    const id = document.getElementById('social-link-id').value;
    const name = document.getElementById('social-link-name').value;
    const url = document.getElementById('social-link-url').value;
    const icon_class = document.getElementById('social-link-icon').value;

    try {
        await socialLinksApi.save(id, { name, url, icon_class });
        resetSocialLinkForm();
        loadSocialLinks();
    } catch (error) {
        alert(error.message);
    }
}

async function handleEditSocialLink(id) {
    try {
        const links = await socialLinksApi.getAll();
        const link = links.find(l => l.id == id);

        if (link) {
            document.getElementById('social-link-id').value = link.id;
            document.getElementById('social-link-name').value = link.name;
            document.getElementById('social-link-url').value = link.url;
            document.getElementById('social-link-icon').value = link.icon_class;

            document.getElementById('social-link-form-title').textContent = 'Editar Enlace Social';
            document.getElementById('save-social-link-btn').textContent = 'Guardar Cambios';
            document.getElementById('cancel-social-link-edit-btn').style.display = 'inline-block';
            socialLinkForm.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        alert(error.message);
    }
}

async function handleDeleteSocialLink(id) {
    if (!confirm('¿Estás seguro de eliminar este enlace?')) return;
    try {
        await socialLinksApi.delete(id);
        loadSocialLinks();
    } catch (error) {
        alert('Error al eliminar el enlace.');
    }
}

function resetSocialLinkForm() {
    socialLinkForm.reset();
    document.getElementById('social-link-id').value = '';
    document.getElementById('social-link-form-title').textContent = 'Añadir Nuevo Enlace Social';
    document.getElementById('save-social-link-btn').textContent = 'Añadir Enlace';
    document.getElementById('cancel-social-link-edit-btn').style.display = 'none';
}

export function initSocialLinksManager() {
    if (!socialLinkForm) return;

    socialLinkForm.addEventListener('submit', handleSaveSocialLink);

    listContainer.addEventListener('click', e => {
        if (e.target.classList.contains('edit-social-link-btn')) {
            handleEditSocialLink(e.target.dataset.id);
        }
        if (e.target.classList.contains('delete-social-link-btn')) {
            handleDeleteSocialLink(e.target.dataset.id);
        }
    });

    document.getElementById('cancel-social-link-edit-btn')?.addEventListener('click', resetSocialLinkForm);
}