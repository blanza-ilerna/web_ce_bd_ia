document.addEventListener('DOMContentLoaded', () => {
    // initialize copy buttons
    initCopyButtons();
});

function initCopyButtons() {
    // Select all code blocks that don't already have a copy button
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]');

    codeBlocks.forEach((pre) => {
        // Create container wrapper for positioning if not exists
        if (!pre.parentNode.classList.contains('code-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            wrapper.style.position = 'relative';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
        }

        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copiar';
        button.title = 'Copiar al portapapeles';

        // Inline styles for the button (can be moved to CSS later)
        Object.assign(button.style, {
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            padding: '0.25rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: '10'
        });

        // Hover effect
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        // Click handler
        button.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code.innerText;

            try {
                await navigator.clipboard.writeText(text);

                // Success feedback
                const originalText = button.textContent;
                button.textContent = '¡Copiado!';
                button.style.background = '#4CAF50';
                button.style.borderColor = '#4CAF50';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'rgba(255, 255, 255, 0.1)';
                    button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                button.textContent = 'Error';
                button.style.background = '#f44336';
            }
        });

        pre.parentNode.appendChild(button);
    });
}
