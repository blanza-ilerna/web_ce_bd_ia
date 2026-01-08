// ============================================
//   TEORIA-GRAFOS-INTERACTIVE.JS
//   Visualizaciones interactivas para teoría de grafos
// ============================================

// Estado global
let tipoGrafo = 'dirigido';
let grafoActual = { vertices: [], aristas: [] };

// Grafo demo para algoritmos
const grafoDemo = {
    vertices: [
        { id: 'A', x: 100, y: 100 },
        { id: 'B', x: 200, y: 50 },
        { id: 'C', x: 300, y: 100 },
        { id: 'D', x: 200, y: 150 },
        { id: 'E', x: 250, y: 220 }
    ],
    aristas: [
        { from: 'A', to: 'B', peso: 4 },
        { from: 'A', to: 'D', peso: 2 },
        { from: 'B', to: 'C', peso: 3 },
        { from: 'B', to: 'D', peso: 1 },
        { from: 'C', to: 'E', peso: 2 },
        { from: 'D', to: 'E', peso: 5 }
    ]
};

// ============================================
// VISUALIZADOR INTERACTIVO
// ============================================

function cambiarTipo(tipo) {
    tipoGrafo = tipo;

    // Actualizar botones
    const botones = document.querySelectorAll('.flex-container .variant-btn-h');
    botones.forEach(btn => {
        btn.classList.remove('active');
    });

    if (tipo === 'dirigido') botones[0].classList.add('active');
    if (tipo === 'no-dirigido') botones[1].classList.add('active');
    if (tipo === 'ponderado') botones[2].classList.add('active');

    actualizarVisualizador();
}

function generarGrafoAleatorio() {
    const numVertices = parseInt(document.getElementById('numVertices').value) || 5;
    const densidad = document.getElementById('densidad').value;

    const vertices = [];
    const aristas = [];
    const radio = 140;
    const centerX = 200;
    const centerY = 175;

    // Generar vértices en círculo
    for (let i = 0; i < numVertices; i++) {
        const angulo = (2 * Math.PI * i) / numVertices - Math.PI / 2;
        vertices.push({
            id: String.fromCharCode(65 + i),
            x: centerX + radio * Math.cos(angulo),
            y: centerY + radio * Math.sin(angulo)
        });
    }

    // Determinar probabilidad de conexión según densidad
    let probabilidad = 0.3;
    if (densidad === 'alta') probabilidad = 0.6;
    if (densidad === 'baja') probabilidad = 0.15;

    // Generar aristas
    for (let i = 0; i < numVertices; i++) {
        for (let j = i + 1; j < numVertices; j++) {
            if (Math.random() < probabilidad) {
                const peso = Math.floor(Math.random() * 9) + 1;
                aristas.push({
                    from: vertices[i].id,
                    to: vertices[j].id,
                    peso: peso
                });

                // Si es dirigido, a veces añadir arista en dirección opuesta
                if (tipoGrafo === 'dirigido' && Math.random() < 0.3) {
                    aristas.push({
                        from: vertices[j].id,
                        to: vertices[i].id,
                        peso: Math.floor(Math.random() * 9) + 1
                    });
                }
            }
        }
    }

    return { vertices, aristas };
}

function actualizarVisualizador() {
    grafoActual = generarGrafoAleatorio();
    const svg = document.getElementById('visualizadorSvg');
    svg.innerHTML = '';

    // Dibujar aristas
    grafoActual.aristas.forEach(arista => {
        const vFrom = grafoActual.vertices.find(v => v.id === arista.from);
        const vTo = grafoActual.vertices.find(v => v.id === arista.to);

        if (tipoGrafo === 'dirigido') {
            // Flecha
            const dx = vTo.x - vFrom.x;
            const dy = vTo.y - vFrom.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (dx / length) * 25;
            const offsetY = (dy / length) * 25;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', vFrom.x);
            line.setAttribute('y1', vFrom.y);
            line.setAttribute('x2', vTo.x - offsetX);
            line.setAttribute('y2', vTo.y - offsetY);
            line.setAttribute('stroke', '#49B9CE');
            line.setAttribute('stroke-width', '3');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            svg.appendChild(line);

            // Definir marcador de flecha si no existe
            if (!document.getElementById('arrowhead')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
                marker.setAttribute('id', 'arrowhead');
                marker.setAttribute('markerWidth', '10');
                marker.setAttribute('markerHeight', '10');
                marker.setAttribute('refX', '8');
                marker.setAttribute('refY', '3');
                marker.setAttribute('orient', 'auto');

                const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                polygon.setAttribute('points', '0 0, 10 3, 0 6');
                polygon.setAttribute('fill', '#49B9CE');

                marker.appendChild(polygon);
                defs.appendChild(marker);
                svg.appendChild(defs);
            }
        } else {
            // Línea simple
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', vFrom.x);
            line.setAttribute('y1', vFrom.y);
            line.setAttribute('x2', vTo.x);
            line.setAttribute('y2', vTo.y);
            line.setAttribute('stroke', tipoGrafo === 'ponderado' ? '#8A7AAF' : '#49B9CE');
            line.setAttribute('stroke-width', '3');
            svg.appendChild(line);
        }

        // Mostrar peso si es ponderado
        if (tipoGrafo === 'ponderado') {
            const midX = (vFrom.x + vTo.x) / 2;
            const midY = (vFrom.y + vTo.y) / 2;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', midX);
            circle.setAttribute('cy', midY);
            circle.setAttribute('r', '14');
            circle.setAttribute('fill', 'white');
            circle.setAttribute('stroke', '#8A7AAF');
            circle.setAttribute('stroke-width', '2');
            svg.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY + 4);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#333333');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.textContent = arista.peso;
            svg.appendChild(text);
        }
    });

    // Dibujar vértices
    grafoActual.vertices.forEach(vertice => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', vertice.x);
        circle.setAttribute('cy', vertice.y);
        circle.setAttribute('r', '22');
        circle.setAttribute('fill', tipoGrafo === 'ponderado' ? '#8A7AAF' : '#49B9CE');
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '3');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', vertice.x);
        text.setAttribute('y', vertice.y + 6);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '18');
        text.setAttribute('font-weight', 'bold');
        text.textContent = vertice.id;

        g.appendChild(circle);
        g.appendChild(text);
        svg.appendChild(g);
    });

    // Actualizar info
    document.getElementById('numV').textContent = grafoActual.vertices.length;
    document.getElementById('numE').textContent = grafoActual.aristas.length;
}

// ============================================
// FUNCIÓN AUXILIAR PARA DIBUJAR GRAFOS
// ============================================

function dibujarGrafo(svgId, grafo, destacados = [], coloresEspeciales = {}) {
    const svg = document.getElementById(svgId);
    svg.innerHTML = '';

    // Dibujar aristas
    grafo.aristas.forEach(arista => {
        const vFrom = grafo.vertices.find(v => v.id === arista.from);
        const vTo = grafo.vertices.find(v => v.id === arista.to);

        const esDestacada = destacados.some(par =>
            (par[0] === arista.from && par[1] === arista.to) ||
            (par[0] === arista.to && par[1] === arista.from)
        );

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', vFrom.x);
        line.setAttribute('y1', vFrom.y);
        line.setAttribute('x2', vTo.x);
        line.setAttribute('y2', vTo.y);
        line.setAttribute('stroke', esDestacada ? '#49B9CE' : '#cccccc');
        line.setAttribute('stroke-width', esDestacada ? '4' : '2');
        svg.appendChild(line);

        // Peso
        const midX = (vFrom.x + vTo.x) / 2;
        const midY = (vFrom.y + vTo.y) / 2;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', midX);
        circle.setAttribute('cy', midY);
        circle.setAttribute('r', '12');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', esDestacada ? '#49B9CE' : '#cccccc');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY + 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#333333');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', 'bold');
        text.textContent = arista.peso;
        svg.appendChild(text);
    });

    // Dibujar vértices
    grafo.vertices.forEach(vertice => {
        const color = coloresEspeciales[vertice.id] || '#8A7AAF';

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', vertice.x);
        circle.setAttribute('cy', vertice.y);
        circle.setAttribute('r', '20');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '3');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', vertice.x);
        text.setAttribute('y', vertice.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', 'bold');
        text.textContent = vertice.id;

        g.appendChild(circle);
        g.appendChild(text);
        svg.appendChild(g);
    });
}

// ============================================
// BFS (BÚSQUEDA EN ANCHURA)
// ============================================

async function ejecutarBFS() {
    const visitados = new Set();
    const cola = ['A'];
    const orden = [];
    const aristas = [];

    visitados.add('A');
    document.getElementById('bfsResult').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">🔍 Ejecutando BFS...</p>';

    while (cola.length > 0) {
        const actual = cola.shift();
        orden.push(actual);

        // Colorear nodo actual
        const colores = {};
        visitados.forEach(v => colores[v] = v === actual ? '#49B9CE' : '#8A7AAF');
        dibujarGrafo('bfsSvg', grafoDemo, aristas, colores);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Explorar vecinos
        const vecinos = grafoDemo.aristas
            .filter(a => a.from === actual)
            .map(a => a.to);

        for (const vecino of vecinos) {
            if (!visitados.has(vecino)) {
                visitados.add(vecino);
                cola.push(vecino);
                aristas.push([actual, vecino]);
            }
        }
    }

    dibujarGrafo('bfsSvg', grafoDemo, aristas, Object.fromEntries([...visitados].map(v => [v, '#49B9CE'])));
    document.getElementById('bfsResult').innerHTML = `
        <div style="background: #E8F7FA; padding: 1rem; border-radius: 0.75rem; border: 2px solid #49B9CE;">
            <p style="margin: 0; font-size: 0.95rem; color: #333333; font-weight: bold;">✅ BFS Completado</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: #555555;"><strong>Orden de visita:</strong> ${orden.join(' → ')}</p>
        </div>
    `;
}

function resetBFS() {
    dibujarGrafo('bfsSvg', grafoDemo);
    document.getElementById('bfsResult').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">Presiona "Ejecutar BFS" para comenzar la búsqueda desde el nodo A</p>';
}

// ============================================
// DFS (BÚSQUEDA EN PROFUNDIDAD)
// ============================================

async function ejecutarDFS() {
    const visitados = new Set();
    const pila = ['A'];
    const orden = [];
    const aristas = [];

    document.getElementById('dfsResult').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">🔍 Ejecutando DFS...</p>';

    while (pila.length > 0) {
        const actual = pila.pop();

        if (visitados.has(actual)) continue;

        visitados.add(actual);
        orden.push(actual);

        // Colorear nodo actual
        const colores = {};
        visitados.forEach(v => colores[v] = v === actual ? '#8A7AAF' : '#C5B9D8');
        dibujarGrafo('dfsSvg', grafoDemo, aristas, colores);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Explorar vecinos (en orden inverso para mantener orden alfabético)
        const vecinos = grafoDemo.aristas
            .filter(a => a.from === actual)
            .map(a => a.to)
            .reverse();

        for (const vecino of vecinos) {
            if (!visitados.has(vecino)) {
                pila.push(vecino);
                if (aristas.length === 0 || aristas[aristas.length - 1][1] !== vecino) {
                    aristas.push([actual, vecino]);
                }
            }
        }
    }

    dibujarGrafo('dfsSvg', grafoDemo, aristas, Object.fromEntries([...visitados].map(v => [v, '#8A7AAF'])));
    document.getElementById('dfsResult').innerHTML = `
        <div style="background: #F0EDF5; padding: 1rem; border-radius: 0.75rem; border: 2px solid #8A7AAF;">
            <p style="margin: 0; font-size: 0.95rem; color: #333333; font-weight: bold;">✅ DFS Completado</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: #555555;"><strong>Orden de visita:</strong> ${orden.join(' → ')}</p>
        </div>
    `;
}

function resetDFS() {
    dibujarGrafo('dfsSvg', grafoDemo);
    document.getElementById('dfsResult').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">Presiona "Ejecutar DFS" para comenzar la búsqueda desde el nodo A</p>';
}

// ============================================
// DIJKSTRA (CAMINO MÁS CORTO)
// ============================================

async function ejecutarDijkstra() {
    const distancias = {};
    const visitados = new Set();
    const noVisitados = new Set();
    const caminosOptimos = {};

    grafoDemo.vertices.forEach(v => {
        distancias[v.id] = v.id === 'A' ? 0 : Infinity;
        noVisitados.add(v.id);
        caminosOptimos[v.id] = [];
    });

    document.getElementById('dijkstraResult').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">🔍 Ejecutando Dijkstra...</p>';

    while (noVisitados.size > 0) {
        let actual = null;
        let menorDist = Infinity;

        noVisitados.forEach(nodo => {
            if (distancias[nodo] < menorDist) {
                menorDist = distancias[nodo];
                actual = nodo;
            }
        });

        if (actual === null || distancias[actual] === Infinity) break;

        visitados.add(actual);
        noVisitados.delete(actual);

        // Visualizar
        const colores = {};
        visitados.forEach(v => colores[v] = v === actual ? '#49B9CE' : '#A3E0EA');
        dibujarGrafo('dijkstraSvg', grafoDemo, [], colores);
        await new Promise(resolve => setTimeout(resolve, 800));

        // Actualizar distancias de vecinos
        const aristasActual = grafoDemo.aristas.filter(a => a.from === actual);
        for (const arista of aristasActual) {
            const nuevaDist = distancias[actual] + arista.peso;
            if (nuevaDist < distancias[arista.to]) {
                distancias[arista.to] = nuevaDist;
                caminosOptimos[arista.to] = [...caminosOptimos[actual], [actual, arista.to]];
            }
        }
    }

    dibujarGrafo('dijkstraSvg', grafoDemo, [], Object.fromEntries([...visitados].map(v => [v, '#49B9CE'])));

    let resultadoHTML = '<div style="background: #E8F7FA; padding: 1rem; border-radius: 0.75rem; border: 2px solid #49B9CE;">';
    resultadoHTML += '<p style="margin: 0; font-size: 0.95rem; color: #333333; font-weight: bold;">✅ Dijkstra Completado</p>';
    resultadoHTML += '<p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: #555555;"><strong>Distancias mínimas desde A:</strong></p>';
    Object.keys(distancias).forEach(nodo => {
        if (nodo !== 'A') {
            resultadoHTML += `<p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #555555;">A → ${nodo}: ${distancias[nodo] === Infinity ? '∞' : distancias[nodo]}</p>`;
        }
    });
    resultadoHTML += '</div>';

    document.getElementById('dijkstraResult').innerHTML = resultadoHTML;
}

function resetDijkstra() {
    dibujarGrafo('dijkstraSvg', grafoDemo);
    document.getElementById('dijkstraResult').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">Presiona "Ejecutar Dijkstra" para calcular distancias mínimas desde A</p>';
}

// ============================================
// KRUSKAL (ÁRBOL DE EXPANSIÓN MÍNIMA)
// ============================================

// Grafo para Kruskal
const grafoKruskal = {
    vertices: [
        { id: 'A', x: 100, y: 100 },
        { id: 'B', x: 200, y: 50 },
        { id: 'C', x: 300, y: 100 },
        { id: 'D', x: 200, y: 150 },
        { id: 'E', x: 250, y: 220 }
    ],
    aristas: [
        { from: 'A', to: 'B', peso: 7 },
        { from: 'A', to: 'D', peso: 5 },
        { from: 'B', to: 'C', peso: 8 },
        { from: 'B', to: 'D', peso: 9 },
        { from: 'B', to: 'E', peso: 7 },
        { from: 'C', to: 'E', peso: 5 },
        { from: 'D', to: 'E', peso: 15 }
    ]
};

// Estructura Union-Find
class UnionFind {
    constructor(elementos) {
        this.padre = {};
        this.rango = {};
        elementos.forEach(e => {
            this.padre[e] = e;
            this.rango[e] = 0;
        });
    }

    encontrar(x) {
        if (this.padre[x] !== x) {
            this.padre[x] = this.encontrar(this.padre[x]);
        }
        return this.padre[x];
    }

    union(x, y) {
        const raizX = this.encontrar(x);
        const raizY = this.encontrar(y);

        if (raizX === raizY) return false;

        if (this.rango[raizX] < this.rango[raizY]) {
            this.padre[raizX] = raizY;
        } else if (this.rango[raizX] > this.rango[raizY]) {
            this.padre[raizY] = raizX;
        } else {
            this.padre[raizY] = raizX;
            this.rango[raizX]++;
        }
        return true;
    }
}

async function ejecutarKruskal() {
    const aristasOrdenadas = [...grafoKruskal.aristas].sort((a, b) => a.peso - b.peso);
    const uf = new UnionFind(grafoKruskal.vertices.map(v => v.id));
    const mst = [];
    let costoTotal = 0;

    document.getElementById('kruskalSteps').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">🔍 Ejecutando Kruskal...</p>';

    for (const arista of aristasOrdenadas) {
        if (uf.union(arista.from, arista.to)) {
            mst.push(arista);
            costoTotal += arista.peso;

            dibujarGrafoKruskal(mst);
            document.getElementById('kruskalCosto').textContent = `Costo Total MST: ${costoTotal}`;

            let pasos = '<div style="background: #F0EDF5; padding: 1rem; border-radius: 0.75rem; border: 2px solid #8A7AAF;">';
            pasos += '<p style="margin: 0; font-size: 0.95rem; color: #333333; font-weight: bold;">Aristas en MST:</p>';
            mst.forEach(a => {
                pasos += `<p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #555555;">${a.from} — ${a.to} [${a.peso}]</p>`;
            });
            pasos += '</div>';
            document.getElementById('kruskalSteps').innerHTML = pasos;

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (mst.length === grafoKruskal.vertices.length - 1) break;
        }
    }

    let resultadoFinal = '<div style="background: #F0EDF5; padding: 1rem; border-radius: 0.75rem; border: 2px solid #8A7AAF;">';
    resultadoFinal += '<p style="margin: 0; font-size: 0.95rem; color: #333333; font-weight: bold;">✅ MST Completado</p>';
    resultadoFinal += '<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #555555;"><strong>Aristas seleccionadas:</strong></p>';
    mst.forEach(a => {
        resultadoFinal += `<p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #555555;">${a.from} — ${a.to} [peso: ${a.peso}]</p>`;
    });
    resultadoFinal += `<p style="margin: 0.75rem 0 0 0; font-size: 0.9rem; color: #8A7AAF; font-weight: bold;">Costo total: ${costoTotal}</p>`;
    resultadoFinal += '</div>';
    document.getElementById('kruskalSteps').innerHTML = resultadoFinal;
}

function dibujarGrafoKruskal(aristasDestacadas) {
    const svg = document.getElementById('kruskalSvg');
    svg.innerHTML = '';

    // Dibujar todas las aristas
    grafoKruskal.aristas.forEach(arista => {
        const vFrom = grafoKruskal.vertices.find(v => v.id === arista.from);
        const vTo = grafoKruskal.vertices.find(v => v.id === arista.to);

        const esDestacada = aristasDestacadas.some(a =>
            (a.from === arista.from && a.to === arista.to) ||
            (a.from === arista.to && a.to === arista.from)
        );

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', vFrom.x);
        line.setAttribute('y1', vFrom.y);
        line.setAttribute('x2', vTo.x);
        line.setAttribute('y2', vTo.y);
        line.setAttribute('stroke', esDestacada ? '#8A7AAF' : '#cccccc');
        line.setAttribute('stroke-width', esDestacada ? '5' : '2');
        svg.appendChild(line);

        // Peso
        const midX = (vFrom.x + vTo.x) / 2;
        const midY = (vFrom.y + vTo.y) / 2;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', midX);
        circle.setAttribute('cy', midY);
        circle.setAttribute('r', '14');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', esDestacada ? '#8A7AAF' : '#cccccc');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#333333');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = arista.peso;
        svg.appendChild(text);
    });

    // Dibujar vértices
    grafoKruskal.vertices.forEach(vertice => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', vertice.x);
        circle.setAttribute('cy', vertice.y);
        circle.setAttribute('r', '20');
        circle.setAttribute('fill', '#8A7AAF');
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '3');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', vertice.x);
        text.setAttribute('y', vertice.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '16');
        text.setAttribute('font-weight', 'bold');
        text.textContent = vertice.id;

        g.appendChild(circle);
        g.appendChild(text);
        svg.appendChild(g);
    });
}

function resetKruskal() {
    dibujarGrafoKruskal([]);
    document.getElementById('kruskalSteps').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">Presiona "Ejecutar Kruskal" para comenzar</p>';
    document.getElementById('kruskalCosto').textContent = 'Costo Total MST: 0';
}

// ============================================
// PROBLEMA DEL LADRÓN
// ============================================

const grafoLadron = {
    vertices: [
        { id: 'A', x: 70, y: 140, label: 'Banco' },
        { id: 'B', x: 190, y: 70, label: 'Norte' },
        { id: 'C', x: 190, y: 210, label: 'Sur' },
        { id: 'D', x: 310, y: 140, label: 'Escondite' }
    ],
    aristas: [
        { from: 'A', to: 'B', peso: 5 },
        { from: 'A', to: 'C', peso: 3 },
        { from: 'B', to: 'D', peso: 4 },
        { from: 'C', to: 'B', peso: 2 },
        { from: 'C', to: 'D', peso: 6 }
    ]
};

function dibujarGrafoLadron(distancias = null, caminoOptimo = null) {
    const svg = document.getElementById('ladronSvg');
    svg.innerHTML = '';

    // Dibujar aristas
    grafoLadron.aristas.forEach(arista => {
        const vFrom = grafoLadron.vertices.find(v => v.id === arista.from);
        const vTo = grafoLadron.vertices.find(v => v.id === arista.to);

        const enCamino = caminoOptimo &&
            caminoOptimo.some((v, i) =>
                i < caminoOptimo.length - 1 &&
                caminoOptimo[i] === arista.from &&
                caminoOptimo[i + 1] === arista.to
            );

        const color = enCamino ? '#49B9CE' : '#cccccc';
        const width = enCamino ? 5 : 3;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', vFrom.x);
        line.setAttribute('y1', vFrom.y);
        line.setAttribute('x2', vTo.x);
        line.setAttribute('y2', vTo.y);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', width);
        svg.appendChild(line);

        // Peso en el centro
        const midX = (vFrom.x + vTo.x) / 2;
        const midY = (vFrom.y + vTo.y) / 2;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', midX);
        circle.setAttribute('cy', midY);
        circle.setAttribute('r', '16');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#333333');
        text.setAttribute('font-size', '13');
        text.setAttribute('font-weight', 'bold');
        text.textContent = arista.peso + 'm';
        svg.appendChild(text);
    });

    // Dibujar vértices
    grafoLadron.vertices.forEach(vertice => {
        const enCamino = caminoOptimo && caminoOptimo.includes(vertice.id);
        const esOrigen = vertice.id === 'A';
        const esDestino = vertice.id === 'D';

        let color = '#8A7AAF';
        if (esOrigen) color = '#ff6b6b';
        if (esDestino) color = '#51cf66';
        if (enCamino && !esOrigen && !esDestino) color = '#49B9CE';

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', vertice.x);
        circle.setAttribute('cy', vertice.y);
        circle.setAttribute('r', '26');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '3');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', vertice.x);
        text.setAttribute('y', vertice.y + 6);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '20');
        text.setAttribute('font-weight', 'bold');
        text.textContent = vertice.id;

        g.appendChild(circle);
        g.appendChild(text);

        // Etiqueta
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', vertice.x);
        label.setAttribute('y', vertice.y + 45);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#333333');
        label.setAttribute('font-size', '11');
        label.setAttribute('font-weight', 'bold');
        label.textContent = vertice.label;
        g.appendChild(label);

        // Distancia si existe
        if (distancias && distancias[vertice.id] !== undefined) {
            const distText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            distText.setAttribute('x', vertice.x);
            distText.setAttribute('y', vertice.y - 35);
            distText.setAttribute('text-anchor', 'middle');
            distText.setAttribute('fill', '#49B9CE');
            distText.setAttribute('font-size', '13');
            distText.setAttribute('font-weight', 'bold');
            distText.textContent = distancias[vertice.id] === Infinity ? '∞' : distancias[vertice.id] + ' min';
            g.appendChild(distText);
        }

        svg.appendChild(g);
    });
}

async function resolverLadron() {
    const distancias = {};
    const anterior = {};
    const visitados = new Set();
    const noVisitados = new Set();

    grafoLadron.vertices.forEach(v => {
        distancias[v.id] = v.id === 'A' ? 0 : Infinity;
        anterior[v.id] = null;
        noVisitados.add(v.id);
    });

    document.getElementById('ladronSolucion').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">🔍 Calculando ruta de escape...</p>';

    // Animación del algoritmo de Dijkstra
    while (noVisitados.size > 0) {
        let actual = null;
        let menorDist = Infinity;

        noVisitados.forEach(nodo => {
            if (distancias[nodo] < menorDist) {
                menorDist = distancias[nodo];
                actual = nodo;
            }
        });

        if (actual === null || distancias[actual] === Infinity) break;

        visitados.add(actual);
        noVisitados.delete(actual);

        // Mostrar progreso
        dibujarGrafoLadron(distancias);
        await new Promise(resolve => setTimeout(resolve, 800));

        // Actualizar distancias de vecinos
        const aristasActual = grafoLadron.aristas.filter(a => a.from === actual);
        for (const arista of aristasActual) {
            const nuevaDist = distancias[actual] + arista.peso;
            if (nuevaDist < distancias[arista.to]) {
                distancias[arista.to] = nuevaDist;
                anterior[arista.to] = actual;
            }
        }
    }

    // Reconstruir camino óptimo
    const caminoOptimo = [];
    let nodo = 'D';
    while (nodo !== null) {
        caminoOptimo.unshift(nodo);
        nodo = anterior[nodo];
    }

    dibujarGrafoLadron(distancias, caminoOptimo);

    document.getElementById('ladronSolucion').innerHTML = `
        <div style="background: #E8F7FA; padding: 1rem; border-radius: 0.75rem; border: 2px solid #49B9CE;">
            <p style="margin: 0; font-size: 0.95rem; color: #333333; font-weight: bold;">✅ ¡Ruta de escape encontrada!</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: #555555;"><strong>Camino:</strong> ${caminoOptimo.join(' → ')}</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: #555555;"><strong>Tiempo total:</strong> ${distancias['D']} minutos</p>
            <p style="margin: 0.75rem 0 0 0; font-size: 0.85rem; color: #666; font-style: italic;">El ladrón escapa por la ruta más rápida</p>
        </div>
    `;
}

function resetLadron() {
    dibujarGrafoLadron();
    document.getElementById('ladronSolucion').innerHTML = '<p style="margin: 0; font-size: 0.95rem; color: #555555;">Presiona "Calcular Escape" para encontrar la mejor ruta</p>';
}

// ============================================
// INICIALIZACIÓN
// ============================================

window.onload = function() {
    actualizarVisualizador();
    dibujarGrafo('bfsSvg', grafoDemo);
    dibujarGrafo('dfsSvg', grafoDemo);
    dibujarGrafo('dijkstraSvg', grafoDemo);
    dibujarGrafoKruskal([]);
    dibujarGrafoLadron();
};
