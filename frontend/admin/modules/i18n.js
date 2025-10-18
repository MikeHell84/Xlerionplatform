// frontend/admin/modules/i18n.js
import { i18nApi } from '../api.js';

const languagesList = document.getElementById('languages-list');
const addLangForm = document.getElementById('add-language-form');
const langCodeInput = document.getElementById('lang-code-input');
const langNameInput = document.getElementById('lang-name-input');
const langSelect = document.getElementById('select-language-for-translation');
const translationsContainer = document.getElementById('translations-container');
const translationsForm = document.getElementById('translations-form');
const saveTranslationsBtn = document.getElementById('save-translations-btn');

export async function loadLanguages() {
    if (!languagesList) return [];
    try {
        const languages = await i18nApi.getLanguages();
        if (!languagesList) return languages; // Devolver si el elemento no está en la página
        languagesList.innerHTML = `
            <ul class="item-list">
                ${languages.map(lang => `
                    <li>
                        <span>${lang.name} (<code>${lang.code}</code>) ${lang.is_default ? '<strong>- Por defecto</strong>' : ''}</span>
                        <div class="item-actions">
                            ${!lang.is_default ? `<button class="delete-lang-btn" data-code="${lang.code}" style="background-color: #dc3545;">Eliminar</button>` : ''}
                        </div>
                    </li>
                `).join('')}
            </ul>`;

        // Poblar el dropdown de traducciones
        langSelect.innerHTML = languages.map(lang => `<option value="${lang.code}">${lang.name}</option>`).join('');
        if (languages.length > 0) {
            loadTranslationsForLanguage(languages[0].code);
        }
        return languages;
    } catch (error) {
        languagesList.innerHTML = `<p class="error-message">${error.message}</p>`;
        return [];
    }
}

async function loadTranslationsForLanguage(langCode) {
    if (!translationsContainer) return;
    translationsContainer.innerHTML = '<p>Cargando...</p>';
    try {
        const translations = await i18nApi.getTranslations(langCode);
        let formHTML = '';
        for (const [key, value] of Object.entries(translations)) {
            formHTML += `
                <div class="form-group">
                    <label for="trans-${key}">${key}</label>
                    <input type="text" id="trans-${key}" name="${key}" value="${value}">
                </div>`;
        }
        translationsContainer.innerHTML = formHTML;
        saveTranslationsBtn.style.display = 'block';
    } catch (error) {
        translationsContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
        saveTranslationsBtn.style.display = 'none';
    }
}

async function handleAddLanguage(e) {
    e.preventDefault();
    const code = langCodeInput.value.trim();
    const name = langNameInput.value.trim();
    if (!code || !name) return;

    try {
        await i18nApi.addLanguage({ code, name });
        addLangForm.reset();
        loadLanguages();
    } catch (error) {
        alert(error.message);
    }
}

async function handleDeleteLanguage(code) {
    if (confirm(`¿Estás seguro de eliminar el idioma '${code}'? Se borrarán todas sus traducciones.`)) {
        try {
            await i18nApi.deleteLanguage(code);
            loadLanguages();
        } catch (error) {
            alert(error.message);
        }
    }
}

async function handleSaveTranslations(e) {
    e.preventDefault();
    const langCode = langSelect.value;
    const formData = new FormData(translationsForm);
    const translations = Object.fromEntries(formData.entries());

    saveTranslationsBtn.disabled = true;
    saveTranslationsBtn.textContent = 'Guardando...';
    try {
        await i18nApi.updateTranslations(langCode, translations);
        alert('Traducciones guardadas con éxito.');
    } catch (error) {
        alert(error.message);
    } finally {
        saveTranslationsBtn.disabled = false;
        saveTranslationsBtn.textContent = 'Guardar Traducciones';
    }
}

export function initI18nManager(languages) {
    if (!addLangForm || !languages) return;

    addLangForm.addEventListener('submit', handleAddLanguage);
    translationsForm.addEventListener('submit', handleSaveTranslations);
    langSelect.addEventListener('change', (e) => loadTranslationsForLanguage(e.target.value));

    languagesList.addEventListener('click', e => {
        if (e.target.classList.contains('delete-lang-btn')) {
            handleDeleteLanguage(e.target.dataset.code);
        }
    });

    // Usar los idiomas ya cargados para poblar la UI
    if (languagesList) {
        languagesList.innerHTML = `
            <ul class="item-list">
                ${languages.map(lang => `
                    <li>
                        <span>${lang.name} (<code>${lang.code}</code>) ${lang.is_default ? '<strong>- Por defecto</strong>' : ''}</span>
                        <div class="item-actions">
                            ${!lang.is_default ? `<button class="delete-lang-btn" data-code="${lang.code}" style="background-color: #dc3545;">Eliminar</button>` : ''}
                        </div>
                    </li>
                `).join('')}
            </ul>`;
        langSelect.innerHTML = languages.map(lang => `<option value="${lang.code}">${lang.name}</option>`).join('');
        if (languages.length > 0) loadTranslationsForLanguage(languages[0].code);
    }
}