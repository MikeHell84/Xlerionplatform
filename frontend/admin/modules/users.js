// frontend/admin/modules/users.js
import { usersApi } from '../api.js';

const usersList = document.getElementById('users-list');
const userForm = document.getElementById('user-form');
const userIdField = document.getElementById('user-id');
const userNameField = document.getElementById('user-name');
const userEmailField = document.getElementById('user-email');
const userPasswordField = document.getElementById('user-password');
const userFormTitle = document.getElementById('user-form-title');
const userRoleField = document.getElementById('user-role');
const saveUserBtn = document.getElementById('save-user-btn');
const cancelUserEditBtn = document.getElementById('cancel-user-edit-btn');

export async function loadUsers() {
    if (!usersList) return;
    try {
        const users = await usersApi.getAll();
        usersList.innerHTML = `
            <ul class="item-list">
                ${users.map(user => `
                    <li>
                        <span>${user.name} (${user.email}) - <strong>${user.role}</strong></span>
                        <div class="item-actions">
                            <button class="edit-user-btn" data-id="${user.id}" style="background-color: #ffc107;">Editar</button>
                            <button class="delete-user-btn" data-id="${user.id}" style="background-color: #dc3545;">Eliminar</button>
                        </div>
                    </li>
                `).join('')}
            </ul>`;
    } catch (error) {
        usersList.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

async function handleSaveUser(e) {
    e.preventDefault();
    const id = userIdField.value;
    const name = userNameField.value;
    const email = userEmailField.value;
    const password = userPasswordField.value;
    const role = userRoleField.value;

    const userData = { name, email, role };
    if (password) {
        userData.password = password;
    }

    try {
        id ? await usersApi.update(id, userData) : await usersApi.create(userData);
        resetUserForm();
        loadUsers();
    } catch (error) {
        alert(error.message);
    }
}

async function handleEditUser(id) {
    try {
        const users = await usersApi.getAll(); // No hay getById, así que filtramos
        const user = users.find(u => u.id == id);
        if (user) {
            userIdField.value = user.id;
            userNameField.value = user.name;
            userEmailField.value = user.email;
            userPasswordField.value = '';
            userRoleField.value = user.role;

            userFormTitle.textContent = 'Editar Usuario';
            saveUserBtn.textContent = 'Guardar Cambios';
            cancelUserEditBtn.style.display = 'inline-block';
            userForm.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        alert(error.message);
    }
}

async function handleDeleteUser(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
            await usersApi.delete(id);
            loadUsers();
        } catch (error) {
            alert(error.message);
        }
    }
}

function resetUserForm() {
    userForm.reset();
    userIdField.value = '';
    userFormTitle.textContent = 'Añadir Nuevo Usuario';
    saveUserBtn.textContent = 'Añadir Usuario';
    cancelUserEditBtn.style.display = 'none';
}

export function initUsersManager() {
    if (!userForm) return;
    userForm.addEventListener('submit', handleSaveUser);
    cancelUserEditBtn.addEventListener('click', resetUserForm);

    usersList.addEventListener('click', e => {
        if (e.target.classList.contains('edit-user-btn')) handleEditUser(e.target.dataset.id);
        if (e.target.classList.contains('delete-user-btn')) handleDeleteUser(e.target.dataset.id);
    });
}