/**
 * Interactive Complexity Graph for Big O Notation
 * Curso de Especialización en Inteligencia Artificial y Big Data - ILERNA
 * Author: Bjlanza
 */

// Configuración del gráfico
const config = {
    width: 700,
    height: 450,
    padding: { top: 50, right: 100, bottom: 60, left: 60 },
    maxN: 1000,
    complexities: {
        o1: { name: 'O(1)', color: '#2d8a3e', calc: (n) => 1, enabled: true },
        ologn: { name: 'O(log n)', color: '#49B9CE', calc: (n) => Math.log2(n), enabled: true },
        on: { name: 'O(n)', color: '#1e7e9c', calc: (n) => n, enabled: true },
        onlogn: { name: 'O(n log n)', color: '#8A7AAF', calc: (n) => n * Math.log2(n), enabled: true },
        on2: { name: 'O(n²)', color: '#d9534f', calc: (n) => n * n, enabled: true },
        o2n: { name: 'O(2ⁿ)', color: '#a94442', calc: (n) => Math.min(Math.pow(2, n), 1000000), enabled: true }
    }
};

// Elementos del DOM
const slider = document.getElementById('nSlider');
const nValueSpan = document.getElementById('nValue');
const svg = document.getElementById('complexityGraph');
const tooltip = document.getElementById('tooltip');

// Función para calcular posición Y en el gráfico
function getY(value, maxValue) {
    const graphHeight = config.height - config.padding.top - config.padding.bottom;
    const ratio = value / maxValue;
    return config.padding.top + graphHeight * (1 - ratio);
}

// Función para calcular posición X en el gráfico
function getX(n) {
    const graphWidth = config.width - config.padding.left - config.padding.right;
    const ratio = n / config.maxN;
    return config.padding.left + graphWidth * ratio;
}

// Formatear números grandes
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return Math.round(num).toString();
}

// Dibujar el gráfico
function drawGraph(currentN) {
    // Limpiar SVG
    svg.innerHTML = '';

    // Calcular valor máximo para escalar el gráfico
    let maxValue = 1;
    Object.entries(config.complexities).forEach(([key, comp]) => {
        if (!comp.enabled) return;
        const value = comp.calc(currentN);
        if (value > maxValue) maxValue = value;
    });

    // Añadir un 10% de margen en el eje Y
    maxValue = maxValue * 1.1;

    // Dibujar ejes
    const axisX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axisX.setAttribute('x1', config.padding.left);
    axisX.setAttribute('y1', config.height - config.padding.bottom);
    axisX.setAttribute('x2', config.width - config.padding.right);
    axisX.setAttribute('y2', config.height - config.padding.bottom);
    axisX.setAttribute('stroke', '#333333');
    axisX.setAttribute('stroke-width', '2');
    svg.appendChild(axisX);

    const axisY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axisY.setAttribute('x1', config.padding.left);
    axisY.setAttribute('y1', config.padding.top);
    axisY.setAttribute('x2', config.padding.left);
    axisY.setAttribute('y2', config.height - config.padding.bottom);
    axisY.setAttribute('stroke', '#333333');
    axisY.setAttribute('stroke-width', '2');
    svg.appendChild(axisY);

    // Etiqueta eje X
    const labelX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelX.setAttribute('x', config.width - config.padding.right - 20);
    labelX.setAttribute('y', config.height - config.padding.bottom + 40);
    labelX.setAttribute('font-size', '14');
    labelX.setAttribute('font-weight', 'bold');
    labelX.setAttribute('fill', '#333333');
    labelX.setAttribute('font-family', 'Montserrat');
    labelX.textContent = 'Tamaño (n)';
    svg.appendChild(labelX);

    // Etiqueta eje Y
    const labelY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelY.setAttribute('x', 15);
    labelY.setAttribute('y', config.padding.top - 10);
    labelY.setAttribute('font-size', '14');
    labelY.setAttribute('font-weight', 'bold');
    labelY.setAttribute('fill', '#333333');
    labelY.setAttribute('font-family', 'Montserrat');
    labelY.textContent = 'Operaciones';
    svg.appendChild(labelY);

    // Dibujar curvas
    Object.entries(config.complexities).forEach(([key, comp]) => {
        if (!comp.enabled) return;

        const points = [];
        for (let n = 1; n <= config.maxN; n += 5) {
            const value = comp.calc(n);
            const x = getX(n);
            const y = getY(value, maxValue);
            points.push(`${x},${y}`);
        }

        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points.join(' '));
        polyline.setAttribute('stroke', comp.color);
        polyline.setAttribute('stroke-width', '3');
        polyline.setAttribute('fill', 'none');
        svg.appendChild(polyline);

        // Etiqueta de la curva
        const lastX = getX(config.maxN);
        const lastY = getY(comp.calc(config.maxN), maxValue);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', lastX + 10);
        label.setAttribute('y', lastY + 5);
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('fill', comp.color);
        label.setAttribute('font-family', 'Montserrat');
        label.textContent = comp.name;
        svg.appendChild(label);
    });

    // Línea vertical en n actual
    const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    verticalLine.setAttribute('x1', getX(currentN));
    verticalLine.setAttribute('y1', config.padding.top);
    verticalLine.setAttribute('x2', getX(currentN));
    verticalLine.setAttribute('y2', config.height - config.padding.bottom);
    verticalLine.setAttribute('stroke', '#FF6B6B');
    verticalLine.setAttribute('stroke-width', '2');
    verticalLine.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(verticalLine);

    // Círculos en la intersección
    Object.entries(config.complexities).forEach(([key, comp]) => {
        if (!comp.enabled) return;

        const value = comp.calc(currentN);
        const x = getX(currentN);
        const y = getY(value, maxValue);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', comp.color);
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '2');
        circle.style.cursor = 'pointer';

        circle.addEventListener('mouseenter', function(e) {
            this.setAttribute('r', '8');
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - 40) + 'px';
            tooltip.innerHTML = `<strong>${comp.name}</strong><br>n = ${currentN}<br>Operaciones: ${formatNumber(value)}`;
        });

        circle.addEventListener('mouseleave', function() {
            this.setAttribute('r', '6');
            tooltip.style.display = 'none';
        });

        svg.appendChild(circle);
    });
}

// Actualizar valores mostrados
function updateValues(n) {
    document.getElementById('val_o1').textContent = '1';
    document.getElementById('val_ologn').textContent = Math.round(Math.log2(n));
    document.getElementById('val_on').textContent = formatNumber(n);
    document.getElementById('val_onlogn').textContent = formatNumber(n * Math.log2(n));
    document.getElementById('val_on2').textContent = formatNumber(n * n);

    const exp = Math.pow(2, n);
    document.getElementById('val_o2n').textContent = n > 20 ? '∞' : formatNumber(exp);
}

// Event listeners
slider.addEventListener('input', function() {
    const n = parseInt(this.value);
    nValueSpan.textContent = n;
    updateValues(n);
    drawGraph(n);
});

// Checkboxes
['o1', 'ologn', 'on', 'onlogn', 'on2', 'o2n'].forEach(key => {
    document.getElementById('check_' + key).addEventListener('change', function() {
        config.complexities[key].enabled = this.checked;
        const n = parseInt(slider.value);
        drawGraph(n);
    });
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    updateValues(100);
    drawGraph(100);
});
