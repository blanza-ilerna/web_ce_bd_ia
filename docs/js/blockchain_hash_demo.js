/**
 * blockchain_hash_demo.js
 * Demostración interactiva de hashes criptográficos usando SubtleCrypto (Web API nativa).
 * No requiere librerías externas.
 */

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function runHashDemo() {
    const inputEl  = document.getElementById('hash-input');
    const outputEl = document.getElementById('hash-output');
    const badgeEl  = document.getElementById('hash-badge');

    const text = inputEl.value;

    if (!text) {
        outputEl.textContent = '—';
        badgeEl.textContent  = '';
        return;
    }

    const hash = await sha256(text);
    outputEl.textContent = hash;

    // Animación de aparición
    outputEl.classList.remove('hash-animate');
    void outputEl.offsetWidth; // reflow para reiniciar animación
    outputEl.classList.add('hash-animate');

    badgeEl.textContent = `${hash.length * 4} bits (${hash.length / 2} bytes) → SHA-256`;
}

// Escuchar cambios en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('hash-input');
    if (inputEl) {
        inputEl.addEventListener('input', runHashDemo);
        // Comparador
        const input2El = document.getElementById('hash-input-2');
        if (input2El) {
            input2El.addEventListener('input', runComparison);
        }
    }
});

async function runComparison() {
    const v1 = document.getElementById('hash-input').value;
    const v2 = document.getElementById('hash-input-2').value;
    const result = document.getElementById('compare-result');

    if (!v1 || !v2) {
        result.innerHTML = '&larr; Escribe en ambos campos para comparar';
        result.className = 'compare-neutral';
        return;
    }

    const h1 = await sha256(v1);
    const h2 = await sha256(v2);

    document.getElementById('hash-output').textContent   = h1;
    document.getElementById('hash-output-2').textContent = h2;

    if (h1 === h2) {
        result.innerHTML = '✅ Los hashes son <strong>idénticos</strong>: misma entrada.';
        result.className = 'compare-equal';
    } else {
        // Calcular diferencia en caracteres
        let diff = 0;
        for (let i = 0; i < h1.length; i++) {
            if (h1[i] !== h2[i]) diff++;
        }
        result.innerHTML = `⚡ Los hashes son <strong>completamente distintos</strong> (${diff} de ${h1.length} caracteres difieren) — efecto avalancha.`;
        result.className = 'compare-different';
    }
}
