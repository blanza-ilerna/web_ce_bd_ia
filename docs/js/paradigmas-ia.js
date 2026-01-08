// JavaScript para Paradigmas de Inteligencia Artificial

/**
 * Función para copiar código al portapapeles
 * @param {string} elementId - ID del elemento que contiene el código
 */
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    const textArea = document.createElement('textarea');
    textArea.value = codeElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    // Obtener el botón que activó el evento
    const button = event.target;
    button.textContent = '✅ ¡Copiado!';
    button.classList.add('copied');

    // Restaurar el estado original después de 2 segundos
    setTimeout(() => {
        button.textContent = '📋 Copiar';
        button.classList.remove('copied');
    }, 2000);
}

/**
 * Inicialización cuando se carga el DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Paradigmas de IA - Documento cargado correctamente');

    // Aquí se pueden añadir más inicializaciones si es necesario
    // Por ejemplo: animaciones, eventos de scroll, etc.
});
