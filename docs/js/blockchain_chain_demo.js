/**
 * blockchain_chain_demo.js
 * Demo interactivo: Encadenamiento de hashes con SHA-256 real.
 * Permite al usuario "manipular" el bloque 1 y ver cómo se rompe la cadena.
 */

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Estado inicial de los bloques
const BLOCKS_INITIAL = [
    { id: 1, label: 'BLOQUE #1', txs: 'Alice → Bob: 10€\nBob → Carlos: 5€\nCarlos → Diana: 3€', genesis: true },
    { id: 2, label: 'BLOQUE #2', txs: 'Diana → Eva: 7€\nEva → Fran: 2€', genesis: false },
    { id: 3, label: 'BLOQUE #3', txs: 'Fran → Gema: 4€\nGema → Hector: 1€', genesis: false },
];

let blockData = JSON.parse(JSON.stringify(BLOCKS_INITIAL));
let hashes = [];

async function computeChain() {
    hashes = [];
    const prevHash = '0'.repeat(64); // hash génesis

    for (let i = 0; i < blockData.length; i++) {
        const prev = i === 0 ? prevHash : hashes[i - 1];
        const content = prev + blockData[i].txs;
        hashes.push(await sha256(content));
    }
}

async function renderChain() {
    await computeChain();

    for (let i = 0; i < blockData.length; i++) {
        const prev = i === 0 ? '0'.repeat(64) : hashes[i - 1];
        const blockEl = document.getElementById(`block-${blockData[i].id}`);
        if (!blockEl) continue;

        const isModified = blockData[i].txs !== BLOCKS_INITIAL[i].txs;
        // Detect chain break: does prev hash match?
        const chainBroken = i > 0 && hashes[i - 1] !== computedPrevHashes[i];

        blockEl.querySelector('.block-tx').textContent = blockData[i].txs;
        blockEl.querySelector('.hash-prev-value').textContent = short(prev);
        blockEl.querySelector('.hash-self-value').textContent  = short(hashes[i]);

        blockEl.classList.toggle('block-modified', isModified);
        blockEl.querySelector('.status-badge').textContent    = isModified ? '⚠️ MODIFICADO' : '✅ VÁLIDO';
        blockEl.querySelector('.status-badge').className      = 'status-badge ' + (isModified ? 'status-error' : 'status-ok');
    }

    renderArrows();
}

// Recalcula los hashes "esperados" sin modificaciones para detectar la rotura
let computedPrevHashes = [];

async function renderChainFull() {
    // Calcular hashes originales para detectar rotura
    let cleanHashes = [];
    const prevHash = '0'.repeat(64);
    for (let i = 0; i < BLOCKS_INITIAL.length; i++) {
        const prev = i === 0 ? prevHash : cleanHashes[i - 1];
        const content = prev + BLOCKS_INITIAL[i].txs;
        cleanHashes.push(await sha256(content));
    }

    // Calcular hashes actuales
    hashes = [];
    for (let i = 0; i < blockData.length; i++) {
        const prev = i === 0 ? prevHash : hashes[i - 1];
        const content = prev + blockData[i].txs;
        hashes.push(await sha256(content));
    }

    for (let i = 0; i < blockData.length; i++) {
        const prev  = i === 0 ? prevHash : hashes[i - 1];
        const blockEl = document.getElementById(`block-${blockData[i].id}`);
        if (!blockEl) continue;

        const isModified = blockData[i].txs !== BLOCKS_INITIAL[i].txs;
        // chain is broken if the computed hash differs from the original path
        const brokenChain = isModified || (i > 0 && hashes[i-1] !== cleanHashes[i-1]);

        blockEl.querySelector('.block-tx').textContent         = blockData[i].txs;
        blockEl.querySelector('.hash-prev-value').textContent  = short(prev);
        blockEl.querySelector('.hash-self-value').textContent  = short(hashes[i]);

        const isInvalid = brokenChain;
        blockEl.classList.toggle('block-tampered', isInvalid);
        blockEl.classList.toggle('block-valid', !isInvalid);
        blockEl.querySelector('.status-badge').textContent = isInvalid ? '⚠️ INVÁLIDO' : '✅ VÁLIDO';
        blockEl.querySelector('.status-badge').className   = 'status-badge ' + (isInvalid ? 'status-error' : 'status-ok');
    }

    renderArrows();
}

function renderArrows() {
    for (let i = 1; i < blockData.length; i++) {
        const arrowEl = document.getElementById(`arrow-${i}`);
        if (!arrowEl) continue;
        // Check if chain is intact
        const prevBlockModified = document.getElementById(`block-${blockData[i-1].id}`)?.classList.contains('block-tampered');
        arrowEl.classList.toggle('arrow-broken', prevBlockModified);
    }
}

function short(hash) {
    return hash.substring(0, 12) + '...' + hash.substring(hash.length - 6);
}

async function tamperBlock() {
    blockData[0].txs = 'Alice → Bob: 10€\nBob → Carlos: 5€\nCarlos → HACKER: 999€'; // manipulación
    await renderChainFull();
    document.getElementById('btn-tamper').style.display = 'none';
    document.getElementById('btn-restore').style.display = 'inline-flex';

    const msg = document.getElementById('chain-status-msg');
    if (msg) {
        msg.textContent = '⛔ Cadena rota: el Bloque #1 ha sido manipulado. Los bloques posteriores son inválidos.';
        msg.className = 'chain-status-error';
    }
}

async function restoreChain() {
    blockData = JSON.parse(JSON.stringify(BLOCKS_INITIAL));
    await renderChainFull();
    document.getElementById('btn-restore').style.display = 'none';
    document.getElementById('btn-tamper').style.display = 'inline-flex';

    const msg = document.getElementById('chain-status-msg');
    if (msg) {
        msg.textContent = '✅ Cadena íntegra: todos los bloques están correctamente enlazados.';
        msg.className = 'chain-status-ok';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderChainFull();
    document.getElementById('btn-tamper')?.addEventListener('click', tamperBlock);
    document.getElementById('btn-restore')?.addEventListener('click', restoreChain);
});
