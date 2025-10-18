// frontend/admin/modules/init.js
import { initSectionsManager, loadSections, updateMenuPreview } from './sections.js';
import { initPostsManager, loadPosts, populateSectionDropdown } from './posts.js';
import { initBlocksManager, loadContentBlocks } from './blocks.js';
import { initAppearanceManager, loadSettings } from './appearance.js';
import { initCommentsManager, loadCommentsForModeration } from './comments.js';
import { initSocialLinksManager } from '../socialLinksManager.js';
import { loadDashboardStats } from './dashboard.js';
import { initAuth } from './auth.js';

export function initializeAllModules() {
    // Inicializadores de eventos y UI
    initializeTabs();
    initializeThemeToggle();
    initAuth();
    initSectionsManager();
    initPostsManager();
    initBlocksManager();
    initAppearanceManager();
    initCommentsManager();
    initSocialLinksManager();
    initializeColorPickers();
}

export async function loadInitialData() {

