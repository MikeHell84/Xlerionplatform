// backend/services/aiService.js
const OLLAMA_API_URL = process.env.OLLAMA_API_URL;

/**
 * Envía una consulta a la IA de Ollama y devuelve la respuesta.
 * @param {string} model - El nombre del modelo a utilizar (ej. "llama3").
 * @param {string} prompt - El texto que se enviará a la IA.
 * @returns {Promise<string>} La respuesta generada por la IA.
 */
async function queryOllama(model, prompt) {
  if (!OLLAMA_API_URL) {
    throw new Error("La URL de la API de Ollama (OLLAMA_API_URL) no está configurada en .env");
  }

  try {
    // Importación dinámica de axios para compatibilidad con módulos ES
    const axios = (await import('axios')).default;

    console.log(`Enviando consulta a Ollama con el modelo ${model}...`);
    const response = await axios.post(
      OLLAMA_API_URL,
      {
        model: model,
        prompt: prompt,
        stream: false, // Queremos la respuesta completa, no en streaming
      },
      {
        // Esta cabecera es necesaria para saltar la página de advertencia de ngrok.
        headers: { 'ngrok-skip-browser-warning': 'any-value' },
      }
    );

    // La respuesta de Ollama contiene el texto en la propiedad `response` del JSON.
    return response.data.response;
  } catch (error) {
    console.error('❌ Error al comunicarse con la API de Ollama:', error.message);
    // Puedes personalizar el manejo de errores, por ejemplo, devolviendo un mensaje genérico.
    throw new Error('No se pudo obtener una respuesta del servicio de IA.');
  }
}

/**
 * Genera un resumen inteligente de un texto utilizando la IA.
 * @param {string} content - El contenido a resumir.
 * @returns {Promise<string>} El resumen generado.
 */
async function generateSmartSummary(content) {
  const prompt = `Por favor, genera un resumen conciso y atractivo de 1 o 2 frases para el siguiente texto, optimizado para ser mostrado en la portada de un sitio web:\n\n"${content}"`;
  
  // Usamos un modelo específico que puede estar corriendo en Ollama, como 'llama3'
  return await queryOllama('llama3', prompt);
}

module.exports = {
  queryOllama,
  generateSmartSummary,
};
