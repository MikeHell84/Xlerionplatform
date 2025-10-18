// frontend/admin/modules/comments.js
import { commentsApi } from '../api.js';

const commentsModerationList = document.getElementById('comments-moderation-list');

/**
 * Carga los comentarios para moderación desde el backend y los renderiza.
 */
export async function loadCommentsForModeration() {
    if (!commentsModerationList) return;
    try {
        const comments = await commentsApi.getAll();
        commentsModerationList.innerHTML = '';

        if (comments.length === 0) {
            commentsModerationList.innerHTML = '<p>No hay comentarios para moderar.</p>';
            return;
        }

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            // Usamos el status para la clase y el color del borde
            commentDiv.className = `comment-moderation-item ${comment.status}`;
            commentDiv.innerHTML = `
                <p><strong>${comment.author_name}</strong> comentó en "<em>${comment.post_title}</em>":</p>
                <p>${comment.content}</p>
                <p class="comment-meta">Estado: ${comment.status}</p>
                <div class="comment-actions">
                    ${comment.status !== 'approved' ? `<button class="approve-comment-btn" data-id="${comment.id}" style="background-color: #28a745;">Aprobar</button>` : ''}
                    <button class="delete-comment-btn" data-id="${comment.id}" style="background-color: #dc3545;">Eliminar</button>
                </div>
            `;
            commentsModerationList.appendChild(commentDiv);
        });
    } catch (error) {
        commentsModerationList.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

/**
 * Inicializa los manejadores de eventos para la moderación de comentarios.
 */
export function initCommentsManager() {
    if (!commentsModerationList) return;

    commentsModerationList.addEventListener('click', async (e) => {
        const target = e.target;
        const commentId = target.dataset.id;

        if (target.classList.contains('approve-comment-btn')) {
            await commentsApi.approve(commentId);
            loadCommentsForModeration(); // Recargar la lista
        }
        if (target.classList.contains('delete-comment-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
                await commentsApi.delete(commentId);
                loadCommentsForModeration(); // Recargar la lista
            }
        }
    });
}