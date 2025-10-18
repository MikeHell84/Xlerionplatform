// frontend/admin/modules/dashboard.js
import { fetchApi } from '../api.js';
let viewsChartInstance = null;
let postsByCategoryChartInstance = null;
let commentsByPostChartInstance = null;
let chartsLoaded = false;

/**
 * Carga las estadísticas del dashboard desde el backend.
 */
export async function loadDashboardStats() {
    const statsPostsEl = document.getElementById('stats-posts');
    const statsCommentsEl = document.getElementById('stats-comments');
    const statsSectionsEl = document.getElementById('stats-sections');

    // Si los elementos de estadísticas no existen en el DOM, no hacemos nada.
    if (!statsPostsEl || !statsCommentsEl || !statsSectionsEl) {
        return;
    }

    try {
        const stats = await fetchApi('/dashboard/stats');
        statsPostsEl.textContent = stats.postCount;
        statsCommentsEl.textContent = stats.commentCount;
        statsSectionsEl.textContent = stats.sectionCount;
    } catch (error) {
        console.error('Error al cargar las estadísticas del dashboard:', error);
    }
}

/**
 * Carga los datos de visitas y renderiza el gráfico.
 */
export async function loadViewsChart() {
    const ctx = document.getElementById('viewsChart');
    if (!ctx) return;

    const container = ctx.closest('.chart-container');
    try {
        const viewsData = await fetchApi('/dashboard/views-over-time');

        const labels = viewsData.map(d => d.date);
        const data = viewsData.map(d => d.views);

        // Destruir el gráfico anterior si existe para evitar conflictos al recargar
        if (viewsChartInstance) {
            viewsChartInstance.destroy();
        }

        viewsChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Visitas por día',
                    data: data,
                    fill: true,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar los datos del gráfico de visitas:', error);
    } finally {
        container.classList.remove('is-loading');
    }
}

/**
 * Carga los datos de posts por categoría y renderiza el gráfico.
 */
export async function loadPostsByCategoryChart() {
    const ctx = document.getElementById('postsByCategoryChart');
    if (!ctx) return;

    const container = ctx.closest('.chart-container');
    try {
        const statsData = await fetchApi('/dashboard/posts-by-category');

        if (statsData.length === 0) {
            ctx.parentElement.innerHTML += '<p>No hay datos de categorías para mostrar.</p>';
            return;
        }

        const labels = statsData.map(d => d.category);
        const data = statsData.map(d => d.count);

        if (postsByCategoryChartInstance) {
            postsByCategoryChartInstance.destroy();
        }

        postsByCategoryChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Posts',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            }
        });
    } catch (error) {
        console.error('Error al cargar los datos del gráfico de categorías:', error);
    } finally {
        container.classList.remove('is-loading');
    }
}

/**
 * Carga los datos de comentarios por post y renderiza el gráfico.
 */
export async function loadCommentsByPostChart() {
    const ctx = document.getElementById('commentsByPostChart');
    if (!ctx) return;

    const container = ctx.closest('.chart-container');
    try {
        const statsData = await fetchApi('/dashboard/comments-by-post');

        if (statsData.length === 0) {
            ctx.parentElement.innerHTML += '<p>No hay comentarios para mostrar.</p>';
            return;
        }

        const labels = statsData.map(d => d.title);
        const data = statsData.map(d => d.commentCount);

        if (commentsByPostChartInstance) {
            commentsByPostChartInstance.destroy();
        }

        commentsByPostChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Comentarios',
                    data: data,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Hace que el gráfico sea de barras horizontales
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar los datos del gráfico de comentarios por post:', error);
    } finally {
        container.classList.remove('is-loading');
    }
}

/**
 * Carga todos los gráficos del dashboard, solo si no han sido cargados antes.
 */
export async function loadDashboardCharts() {
    if (chartsLoaded) return;

    await Promise.all([
        loadViewsChart(),
        loadPostsByCategoryChart(),
        loadCommentsByPostChart()
    ]);

    chartsLoaded = true;
}

/**
 * Refresca todos los datos del dashboard (estadísticas y gráficos).
 */
export async function refreshDashboardData() {
    const refreshBtn = document.getElementById('refresh-dashboard-btn');
    if (refreshBtn) refreshBtn.classList.add('is-loading');

    // Mostrar esqueletos de carga para los gráficos
    document.querySelectorAll('.charts-grid .chart-container').forEach(container => {
        container.classList.add('is-loading');
    });

    // Forzar la recarga de los gráficos
    chartsLoaded = false; 

    try {
        await Promise.all([
            loadDashboardStats(),
            loadDashboardCharts()
        ]);
    } finally {
        if (refreshBtn) refreshBtn.classList.remove('is-loading');
    }
}