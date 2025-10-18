// frontend/admin/modules/emailSettings.js
import { emailSettingsApi } from '../api.js';

const emailForm = document.getElementById('email-settings-form');
const testEmailBtn = document.getElementById('send-test-email-btn');

export async function loadEmailSettings() {
    if (!emailForm) return;
    try {
        const settings = await emailSettingsApi.get();
        Object.keys(settings).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = settings[key];
                } else {
                    input.value = settings[key] || '';
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar la configuración de email:', error);
    }
}

async function handleSaveEmailSettings(e) {
    e.preventDefault();
    const formData = new FormData(emailForm);
    const settings = Object.fromEntries(formData.entries());
    // FormData no incluye checkboxes no marcados, así que lo manejamos manualmente.
    settings.smtp_secure = document.getElementById('smtp_secure').checked;

    try {
        await emailSettingsApi.update(settings);
        alert('Configuración de email guardada con éxito.');
    } catch (error) {
        alert(error.message);
    }
}

async function handleSendTestEmail() {
    testEmailBtn.disabled = true;
    testEmailBtn.textContent = 'Enviando...';
    try {
        const result = await emailSettingsApi.sendTest();
        alert(result.message);
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        testEmailBtn.disabled = false;
        testEmailBtn.textContent = 'Enviar Email de Prueba';
    }
}

export function initEmailSettingsManager() {
    if (emailForm) emailForm.addEventListener('submit', handleSaveEmailSettings);
    if (testEmailBtn) testEmailBtn.addEventListener('click', handleSendTestEmail);
}