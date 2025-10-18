// frontend/admin/modules/activityLog.js
import { activityLogApi } from '../api.js';

const logListContainer = document.getElementById('activity-log-list');
const paginationContainer = document.getElementById('activity-log-pagination');

/**
 * Carga y muestra el registro de actividad.
 * @param {number} [page=1] - La página de resultados a mostrar.
 */
export async function loadActivityLog(page = 1) {
    if (!logListContainer) return;

    try {
        const { logs, currentPage, totalPages } = await activityLogApi.getLog(page);

        if (logs.length === 0) {
            logListContainer.innerHTML = '<p>No hay actividad registrada todavía.</p>';
            return;
        }

        logListContainer.innerHTML = `
            <table class="activity-log-table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Acción</th>
                        <th>Detalles</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map(log => `
                        <tr>
                            <td>${log.user_name || 'N/A'}</td>
                            <td><span class="log-action">${log.action.replace(/_/g, ' ')}</span></td>
                            <td>${log.details || '-'}</td>
                            <td>${new Date(log.created_at).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        renderPagination(currentPage, totalPages);
    } catch (error) {
        logListContainer.innerHTML = `<p class="error-message">Error al cargar el registro: ${error.message}</p>`;
    }
}

function renderPagination(currentPage, totalPages) {
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }
    paginationContainer.innerHTML = `
        <button class="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span>Página ${currentPage} de ${totalPages}</span>
        <button class="next-page" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
    `;
    document.querySelector('#activity-log-pagination .prev-page')?.addEventListener('click', () => loadActivityLog(currentPage - 1));
    document.querySelector('#activity-log-pagination .next-page')?.addEventListener('click', () => loadActivityLog(currentPage + 1));
}