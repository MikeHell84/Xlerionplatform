document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api/public'; // Usar URL absoluta para desarrollo
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Enviando...';
            formStatus.style.color = 'var(--secondary-color)';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Error en el servidor.');
                }

                formStatus.textContent = result.message;
                formStatus.style.color = 'green';
                contactForm.reset();

            } catch (error) {
                formStatus.textContent = error.message;
                formStatus.style.color = 'red';
            }
        });
    }
});