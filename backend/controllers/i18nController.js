// backend/controllers/i18nController.js
import { pool } from '../config/db.js';
import cache from '../services/cacheService.js';

const clearTranslationCache = (lang) => {
    cache.clear(`translations_${lang}`);
};

export const getLanguages = async (req, res) => {
    try {
        const [languages] = await pool.query('SELECT * FROM languages ORDER BY name ASC');
        res.json(languages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching languages.' });
    }
};

export const addLanguage = async (req, res) => {
    const { code, name } = req.body;
    if (!code || !name) {
        return res.status(400).json({ message: 'Code and name are required.' });
    }
    try {
        await pool.query('INSERT INTO languages (code, name) VALUES (?, ?)', [code, name]);
        res.status(201).json({ message: 'Language added successfully.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Language code already exists.' });
        }
        res.status(500).json({ message: 'Error adding language.' });
    }
};

export const deleteLanguage = async (req, res) => {
    const { code } = req.params;
    try {
        const [lang] = await pool.query('SELECT is_default FROM languages WHERE code = ?', [code]);
        if (lang.length > 0 && lang[0].is_default) {
            return res.status(400).json({ message: 'Cannot delete the default language.' });
        }
        await pool.query('DELETE FROM languages WHERE code = ?', [code]);
        clearTranslationCache(code);
        res.json({ message: 'Language deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting language.' });
    }
};

export const getTranslations = async (req, res) => {
    const { lang } = req.params;
    try {
        const [translations] = await pool.query('SELECT translation_key, translation_value FROM translations WHERE lang_code = ?', [lang]);
        const translationObject = translations.reduce((acc, item) => {
            acc[item.translation_key] = item.translation_value;
            return acc;
        }, {});
        res.json(translationObject);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching translations.' });
    }
};

export const updateTranslations = async (req, res) => {
    const { lang } = req.params;
    const translations = req.body; // Expects an object like { key1: 'value1', key2: 'value2' }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const queries = Object.entries(translations).map(([key, value]) => {
            return connection.query(
                `INSERT INTO translations (lang_code, translation_key, translation_value)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE translation_value = ?`,
                [lang, key, value, value]
            );
        });

        await Promise.all(queries);

        await connection.commit();
        clearTranslationCache(lang);
        res.json({ message: 'Translations updated successfully.' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Error updating translations.' });
    } finally {
        connection.release();
    }
};