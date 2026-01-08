// JavaScript común para todas las lecciones - iLERNA
// Curso de Especialización en Inteligencia Artificial y Big Data

/**
 * Función para copiar código al portapapeles
 * @param {string} elementId - ID del elemento que contiene el código
 */
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) {
        console.error('Elemento no encontrado:', elementId);
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = codeElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();

    try {
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
    } catch (err) {
        console.error('Error al copiar:', err);
        document.body.removeChild(textArea);
    }
}

/**
 * Smooth scroll para enlaces internos
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Añade animación de entrada a las secciones cuando son visibles
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

/**
 * Muestra un botón para volver arriba cuando se hace scroll
 */
function initBackToTop() {
    // Crear botón si no existe
    let backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.title = 'Volver arriba';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #49B9CE;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(73, 185, 206, 0.3);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(backToTopBtn);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mostrar/ocultar según scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
}

/**
 * Resalta código con Prism.js si está disponible
 */
function initCodeHighlighting() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

/**
 * Inicialización cuando se carga el DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lección iLERNA - Documento cargado correctamente');

    // Inicializar funcionalidades
    initSmoothScroll();
    initScrollAnimations();
    initBackToTop();
    initCodeHighlighting();

    // Log para debug
    console.log('Todas las funcionalidades inicializadas');
});

/**
 * Utilidades adicionales
 */
const LeccionUtils = {
    /**
     * Formatea un número con separador de miles
     */
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    /**
     * Trunca un texto a una longitud específica
     */
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    /**
     * Genera un ID único
     */
    generateId: function(prefix = 'id') {
        return prefix + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Exportar para uso global
window.LeccionUtils = LeccionUtils;
