/**
 * Copy Code Button Functionality for Prism.js Code Blocks
 * Curso de Especialización en Inteligencia Artificial y Big Data - ILERNA
 * Author: Bjlanza
 */

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los bloques de código con Prism
    const codeBlocks = document.querySelectorAll('pre code[class*="language-"]');

    codeBlocks.forEach(function(codeBlock) {
        // Crear el contenedor del botón
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'code-copy-container';

        // Crear el botón de copiar
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            <span>Copiar</span>
        `;
        copyButton.setAttribute('aria-label', 'Copiar código');
        copyButton.setAttribute('title', 'Copiar código');

        // Obtener el elemento pre padre
        const preElement = codeBlock.parentElement;

        // Insertar el botón antes del elemento pre
        preElement.parentNode.insertBefore(buttonContainer, preElement);
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(preElement);

        // Funcionalidad de copiar
        copyButton.addEventListener('click', function() {
            // Obtener el texto del código (sin formato HTML)
            const codeText = codeBlock.textContent || codeBlock.innerText;

            // Copiar al portapapeles
            navigator.clipboard.writeText(codeText).then(function() {
                // Cambiar el estado del botón a "copiado"
                copyButton.classList.add('copied');
                copyButton.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>¡Copiado!</span>
                `;

                // Restaurar el botón después de 2 segundos
                setTimeout(function() {
                    copyButton.classList.remove('copied');
                    copyButton.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                            <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        </svg>
                        <span>Copiar</span>
                    `;
                }, 2000);
            }).catch(function(err) {
                console.error('Error al copiar el código:', err);

                // Fallback: seleccionar el texto manualmente
                const range = document.createRange();
                range.selectNodeContents(codeBlock);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                try {
                    document.execCommand('copy');
                    copyButton.textContent = '¡Copiado!';
                    setTimeout(function() {
                        copyButton.textContent = 'Copiar';
                    }, 2000);
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                }

                selection.removeAllRanges();
            });
        });
    });
});
