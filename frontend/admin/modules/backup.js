// frontend/admin/modules/backup.js
import { backupApi } from '../api.js';

const backupsList = document.getElementById('backups-list');
const restoreForm = document.getElementById('restore-backup-form');
const createBackupBtn = document.getElementById('create-backup-btn');

export async function loadBackups() {
    if (!backupsList) return;
    try {
        const backups = await backupApi.getAll();
        if (backups.length === 0) {
            backupsList.innerHTML = '<p>No hay copias de seguridad creadas.</p>';
            return;
        }

        backupsList.innerHTML = `
            <ul class="item-list">
                ${backups.map(backup => `
                    <li>
                        <span>
                            <strong>${backup.filename}</strong>
                            <small>(${(backup.size / 1024).toFixed(2)} KB) - ${new Date(backup.createdAt).toLocaleString()}</small>
                        </span>
                        <div class="item-actions">
                            <a href="${backupApi.getDownloadUrl(backup.filename)}" download class="button-like" style="background-color: #17a2b8;">Descargar</a>
                            <button class="delete-backup-btn" data-filename="${backup.filename}" style="background-color: #dc3545;">Eliminar</button>
                        </div>
                    </li>
                `).join('')}
            </ul>`;
    } catch (error) {
        backupsList.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

async function handleCreateBackup() {
    createBackupBtn.disabled = true;
    createBackupBtn.textContent = 'Creando...';
    try {
        const result = await backupApi.create();
        alert(result.message);
        loadBackups();
    } catch (error) {
        alert(error.message);
    } finally {
        createBackupBtn.disabled = false;
        createBackupBtn.textContent = 'Crear Nueva Copia de Seguridad';
    }
}

async function handleDeleteBackup(filename) {
    if (confirm(`¿Estás seguro de que quieres eliminar la copia de seguridad "${filename}"? Esta acción no se puede deshacer.`)) {
        try {
            const result = await backupApi.delete(filename);
            alert(result.message);
            loadBackups();
        } catch (error) {
            alert(error.message);
        }
    }
}

async function handleRestoreBackup(e) {
    e.preventDefault();
    const fileInput = document.getElementById('backup-file-input');
    if (fileInput.files.length === 0) {
        alert('Por favor, selecciona un archivo .sql para restaurar.');
        return;
    }

    if (!confirm('¡ADVERTENCIA!\n\nEstás a punto de reemplazar TODA la base de datos con el contenido de este archivo. Esta acción es IRREVERSIBLE.\n\n¿Estás completamente seguro de que quieres continuar?')) {
        return;
    }

    const formData = new FormData();
    formData.append('backupFile', fileInput.files[0]);

    const restoreBtn = document.getElementById('restore-backup-btn');
    restoreBtn.disabled = true;
    restoreBtn.textContent = 'Restaurando...';

    try {
        const result = await backupApi.restore(formData);
        alert(result.message);
        window.location.reload(); // Recargar para reflejar el estado restaurado
    } catch (error) {
        alert(error.message);
    } finally {
        restoreBtn.disabled = false;
        restoreBtn.textContent = 'Restaurar Base de Datos';
    }
}

export function initBackupManager() {
    if (!createBackupBtn) return;
    createBackupBtn.addEventListener('click', handleCreateBackup);

    backupsList.addEventListener('click', e => {
        if (e.target.classList.contains('delete-backup-btn')) {
            handleDeleteBackup(e.target.dataset.filename);
        }
    });

    restoreForm.addEventListener('submit', handleRestoreBackup);
}