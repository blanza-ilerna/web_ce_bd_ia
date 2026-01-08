// Graph configuration
const graphData = {
    nodes: [
        { id: 'A', x: 400, y: 80 },
        { id: 'B', x: 200, y: 180 },
        { id: 'C', x: 600, y: 180 },
        { id: 'D', x: 100, y: 300 },
        { id: 'E', x: 300, y: 300 },
        { id: 'F', x: 500, y: 300 },
        { id: 'G', x: 700, y: 300 },
        { id: 'H', x: 150, y: 420 },
        { id: 'I', x: 350, y: 420 },
        { id: 'J', x: 550, y: 420 }
    ],
    links: [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'D' },
        { source: 'B', target: 'E' },
        { source: 'C', target: 'F' },
        { source: 'C', target: 'G' },
        { source: 'D', target: 'H' },
        { source: 'E', target: 'I' },
        { source: 'F', target: 'J' },
        { source: 'E', target: 'F' }
    ]
};

// Colors
const colors = {
    azulIlerna: '#49B9CE',
    morado: '#8A7AAF',
    success: '#2ecc71',
    fondoAzul: '#E8F7FA',
    fondoMorado: '#F0EDF5',
    grisBordes: '#e5e5e5',
    blanco: '#ffffff',
    negroTexto: '#333333',
    warning: '#f39c12'
};

// State
let currentAlgorithm = 'bfs';
let bfsVariant = 'standard'; // standard, levels, shortest-path, components, bidirectional
let dfsVariant = 'iterative'; // iterative, recursive, timestamps, cycle-detection, topological
let animationSpeed = 800;
let isRunning = false;
let animationInterval = null;
let searchState = null;
let currentPseudoLine = 0;
let startNode = 'A';
let targetNode = 'J';

// D3 elements
let svg, linksGroup, nodesGroup;

// BFS Pseudocode variants
const bfsPseudocodes = {
    standard: `
        <div class="line" data-line="1"><span class="keyword">BFS</span>(grafo, inicio):</div>
        <div class="line" data-line="2">  cola ← [inicio]</div>
        <div class="line" data-line="3">  visitados ← {inicio}</div>
        <div class="line" data-line="4">  <span class="keyword">mientras</span> cola no vacía:</div>
        <div class="line" data-line="5">    nodo ← cola.<span class="keyword">extraer_frente()</span></div>
        <div class="line" data-line="6">    procesar(nodo)</div>
        <div class="line" data-line="7">    <span class="keyword">para cada</span> vecino de nodo:</div>
        <div class="line" data-line="8">      <span class="keyword">si</span> vecino no en visitados:</div>
        <div class="line" data-line="9">        visitados.añadir(vecino)</div>
        <div class="line" data-line="10">        cola.<span class="keyword">añadir_final</span>(vecino)</div>
    `,
    levels: `
        <div class="line" data-line="1"><span class="keyword">BFS_Niveles</span>(grafo, inicio):</div>
        <div class="line" data-line="2">  cola ← [(inicio, 0)]</div>
        <div class="line" data-line="3">  visitados ← {inicio}</div>
        <div class="line" data-line="4">  niveles ← {inicio: 0}</div>
        <div class="line" data-line="5">  <span class="keyword">mientras</span> cola no vacía:</div>
        <div class="line" data-line="6">    (nodo, nivel) ← cola.<span class="keyword">extraer_frente()</span></div>
        <div class="line" data-line="7">    procesar(nodo, nivel)</div>
        <div class="line" data-line="8">    <span class="keyword">para cada</span> vecino de nodo:</div>
        <div class="line" data-line="9">      <span class="keyword">si</span> vecino no en visitados:</div>
        <div class="line" data-line="10">        niveles[vecino] ← nivel + 1</div>
        <div class="line" data-line="11">        cola.<span class="keyword">añadir_final</span>((vecino, nivel+1))</div>
    `,
    'shortest-path': `
        <div class="line" data-line="1"><span class="keyword">BFS_CaminoCorto</span>(grafo, inicio, destino):</div>
        <div class="line" data-line="2">  cola ← [inicio]</div>
        <div class="line" data-line="3">  visitados ← {inicio}</div>
        <div class="line" data-line="4">  padre ← {}</div>
        <div class="line" data-line="5">  <span class="keyword">mientras</span> cola no vacía:</div>
        <div class="line" data-line="6">    nodo ← cola.<span class="keyword">extraer_frente()</span></div>
        <div class="line" data-line="7">    <span class="keyword">si</span> nodo == destino:</div>
        <div class="line" data-line="8">      <span class="keyword">retornar</span> reconstruir_camino(padre, destino)</div>
        <div class="line" data-line="9">    <span class="keyword">para cada</span> vecino de nodo:</div>
        <div class="line" data-line="10">      <span class="keyword">si</span> vecino no en visitados:</div>
        <div class="line" data-line="11">        padre[vecino] ← nodo</div>
        <div class="line" data-line="12">        cola.<span class="keyword">añadir_final</span>(vecino)</div>
    `,
    components: `
        <div class="line" data-line="1"><span class="keyword">BFS_Componentes</span>(grafo):</div>
        <div class="line" data-line="2">  componentes ← []</div>
        <div class="line" data-line="3">  visitados_global ← {}</div>
        <div class="line" data-line="4">  <span class="keyword">para cada</span> nodo en grafo:</div>
        <div class="line" data-line="5">    <span class="keyword">si</span> nodo no en visitados_global:</div>
        <div class="line" data-line="6">      componente ← BFS(grafo, nodo)</div>
        <div class="line" data-line="7">      componentes.<span class="keyword">añadir</span>(componente)</div>
        <div class="line" data-line="8">      visitados_global.<span class="keyword">unir</span>(componente)</div>
        <div class="line" data-line="9">  <span class="keyword">retornar</span> componentes</div>
    `,
    bidirectional: `
        <div class="line" data-line="1"><span class="keyword">BFS_Bidireccional</span>(grafo, inicio, destino):</div>
        <div class="line" data-line="2">  cola_inicio ← [inicio]</div>
        <div class="line" data-line="3">  cola_destino ← [destino]</div>
        <div class="line" data-line="4">  visitados_inicio ← {inicio}</div>
        <div class="line" data-line="5">  visitados_destino ← {destino}</div>
        <div class="line" data-line="6">  <span class="keyword">mientras</span> ambas colas no vacías:</div>
        <div class="line" data-line="7">    <span class="keyword">si</span> expandir_desde_inicio():</div>
        <div class="line" data-line="8">      <span class="keyword">si</span> hay intersección:</div>
        <div class="line" data-line="9">        <span class="keyword">retornar</span> camino encontrado</div>
        <div class="line" data-line="10">    <span class="keyword">si</span> expandir_desde_destino():</div>
        <div class="line" data-line="11">      <span class="keyword">si</span> hay intersección:</div>
        <div class="line" data-line="12">        <span class="keyword">retornar</span> camino encontrado</div>
    `
};

// DFS Pseudocode
// BFS Explanations
const bfsExplanations = {
    standard: {
        title: 'BFS Estándar',
        description: 'Recorre el grafo por niveles, visitando todos los vecinos de un nodo antes de pasar al siguiente nivel.',
        points: [
            '<strong>Estructura:</strong> Cola (FIFO - First In, First Out)',
            '<strong>Aplicación:</strong> Exploración básica de grafos, encontrar todos los nodos alcanzables',
            '<strong>Complejidad:</strong> O(V + E) donde V son vértices y E aristas'
        ]
    },
    levels: {
        title: 'BFS con Niveles',
        description: 'Igual que BFS estándar pero mantiene el nivel de cada nodo, útil para calcular distancias.',
        points: [
            '<strong>Nivel:</strong> Distancia mínima desde el nodo inicial',
            '<strong>Aplicación:</strong> Calcular distancias en grafos no ponderados',
            '<strong>Información extra:</strong> Cada nodo muestra su nivel (L0, L1, L2...)'
        ]
    },
    'shortest-path': {
        title: 'BFS Camino Más Corto',
        description: 'Encuentra el camino más corto entre dos nodos en un grafo no ponderado.',
        points: [
            '<strong>Objetivo:</strong> Encontrar ruta óptima entre nodo origen y destino',
            '<strong>Garantía:</strong> El primer camino encontrado es siempre el más corto',
            '<strong>Aplicación:</strong> Navegación, routing, juegos (pathfinding)'
        ]
    },
    components: {
        title: 'BFS Componentes Conexos',
        description: 'Identifica componentes conexos en el grafo, ejecutando BFS desde múltiples nodos.',
        points: [
            '<strong>Componente:</strong> Conjunto de nodos conectados entre sí',
            '<strong>Aplicación:</strong> Detectar islas en una matriz, análisis de redes',
            '<strong>Proceso:</strong> BFS múltiple desde cada nodo no visitado'
        ]
    },
    bidirectional: {
        title: 'BFS Bidireccional',
        description: 'Ejecuta BFS simultáneamente desde origen y destino hasta que se encuentran.',
        points: [
            '<strong>Eficiencia:</strong> Más rápido que BFS estándar para grafos grandes',
            '<strong>Complejidad:</strong> O(b^(d/2)) vs O(b^d) del BFS normal',
            '<strong>Aplicación:</strong> Búsqueda en grafos muy grandes, redes sociales'
        ]
    }
};

// DFS Explanations
const dfsExplanations = {
    iterative: {
        title: 'DFS Iterativo',
        description: 'Implementa DFS usando una pila explícita en lugar de recursión.',
        points: [
            '<strong>Estructura:</strong> Pila (LIFO - Last In, First Out)',
            '<strong>Ventaja:</strong> Evita desbordamiento de pila en grafos profundos',
            '<strong>Aplicación:</strong> Recorrido de grafos, exploración de laberintos'
        ]
    },
    recursive: {
        title: 'DFS Recursivo',
        description: 'Implementa DFS usando llamadas recursivas, la forma más natural del algoritmo.',
        points: [
            '<strong>Implementación:</strong> Usa la pila de llamadas del sistema',
            '<strong>Ventaja:</strong> Código más simple y elegante',
            '<strong>Limitación:</strong> Puede causar stack overflow en grafos muy profundos'
        ]
    },
    timestamps: {
        title: 'DFS con Tiempos',
        description: 'Registra tiempo de descubrimiento y finalización de cada nodo.',
        points: [
            '<strong>Descubrimiento:</strong> Cuando visitamos el nodo por primera vez',
            '<strong>Finalización:</strong> Cuando terminamos de procesar el nodo',
            '<strong>Aplicación:</strong> Clasificación de aristas, análisis de ciclos'
        ]
    },
    'cycle-detection': {
        title: 'DFS Detección de Ciclos',
        description: 'Detecta ciclos usando un esquema de colores: BLANCO (no visitado), GRIS (en proceso), NEGRO (completado).',
        points: [
            '<strong>Ciclo:</strong> Arista que apunta a un nodo GRIS (ancestro)',
            '<strong>Colores:</strong> BLANCO → GRIS → NEGRO',
            '<strong>Aplicación:</strong> Validación de DAGs, detección de deadlocks'
        ]
    },
    topological: {
        title: 'DFS Ordenamiento Topológico',
        description: 'Genera un orden lineal de nodos donde cada nodo aparece antes que sus dependientes.',
        points: [
            '<strong>Requisito:</strong> Solo funciona en grafos dirigidos acíclicos (DAG)',
            '<strong>Método:</strong> Orden inverso de finalización',
            '<strong>Aplicación:</strong> Planificación de tareas, compilación de dependencias'
        ]
    }
};

// DFS Pseudocode variants
const dfsPseudocodes = {
    iterative: `
    <div class="line" data-line="1"><span class="keyword dfs-keyword">DFS_Iterativo</span>(grafo, inicio):</div>
    <div class="line" data-line="2">  pila ← [inicio]</div>
    <div class="line" data-line="3">  visitados ← {}</div>
    <div class="line" data-line="4">  <span class="keyword dfs-keyword">mientras</span> pila no vacía:</div>
    <div class="line" data-line="5">    nodo ← pila.<span class="keyword dfs-keyword">extraer_tope()</span></div>
    <div class="line" data-line="6">    <span class="keyword dfs-keyword">si</span> nodo no en visitados:</div>
    <div class="line" data-line="7">      visitados.añadir(nodo)</div>
    <div class="line" data-line="8">      procesar(nodo)</div>
    <div class="line" data-line="9">      <span class="keyword dfs-keyword">para cada</span> vecino de nodo:</div>
    <div class="line" data-line="10">        pila.<span class="keyword dfs-keyword">añadir_tope</span>(vecino)</div>
`,
    recursive: `
    <div class="line" data-line="1"><span class="keyword dfs-keyword">DFS_Recursivo</span>(grafo, nodo, visitados):</div>
    <div class="line" data-line="2">  <span class="keyword dfs-keyword">si</span> nodo en visitados:</div>
    <div class="line" data-line="3">    <span class="keyword dfs-keyword">retornar</span></div>
    <div class="line" data-line="4">  visitados.añadir(nodo)</div>
    <div class="line" data-line="5">  procesar(nodo)</div>
    <div class="line" data-line="6">  <span class="keyword dfs-keyword">para cada</span> vecino de nodo:</div>
    <div class="line" data-line="7">    <span class="keyword dfs-keyword">DFS_Recursivo</span>(grafo, vecino, visitados)</div>
`,
    timestamps: `
    <div class="line" data-line="1"><span class="keyword dfs-keyword">DFS_Tiempos</span>(grafo, inicio):</div>
    <div class="line" data-line="2">  tiempo ← 0</div>
    <div class="line" data-line="3">  descubrimiento ← {}, finalizacion ← {}</div>
    <div class="line" data-line="4">  <span class="keyword dfs-keyword">para cada</span> nodo:</div>
    <div class="line" data-line="5">    <span class="keyword dfs-keyword">si</span> nodo no visitado:</div>
    <div class="line" data-line="6">      tiempo ← tiempo + 1</div>
    <div class="line" data-line="7">      descubrimiento[nodo] ← tiempo</div>
    <div class="line" data-line="8">      DFS_Visitar(nodo)</div>
    <div class="line" data-line="9">      tiempo ← tiempo + 1</div>
    <div class="line" data-line="10">      finalizacion[nodo] ← tiempo</div>
`,
    'cycle-detection': `
    <div class="line" data-line="1"><span class="keyword dfs-keyword">Detectar_Ciclo</span>(grafo):</div>
    <div class="line" data-line="2">  color ← {} <span class="comment">// BLANCO, GRIS, NEGRO</span></div>
    <div class="line" data-line="3">  <span class="keyword dfs-keyword">para cada</span> nodo:</div>
    <div class="line" data-line="4">    <span class="keyword dfs-keyword">si</span> color[nodo] == BLANCO:</div>
    <div class="line" data-line="5">      <span class="keyword dfs-keyword">si</span> DFS_Visitar(nodo):</div>
    <div class="line" data-line="6">        <span class="keyword dfs-keyword">retornar</span> true <span class="comment">// Ciclo detectado</span></div>
    <div class="line" data-line="7">  <span class="keyword dfs-keyword">retornar</span> false</div>
    <div class="line" data-line="8"><span class="keyword dfs-keyword">DFS_Visitar</span>(nodo):</div>
    <div class="line" data-line="9">  color[nodo] ← GRIS</div>
    <div class="line" data-line="10">  <span class="keyword dfs-keyword">para cada</span> vecino:</div>
    <div class="line" data-line="11">    <span class="keyword dfs-keyword">si</span> color[vecino] == GRIS: <span class="keyword dfs-keyword">retornar</span> true</div>
`,
    topological: `
    <div class="line" data-line="1"><span class="keyword dfs-keyword">Orden_Topologico</span>(grafo):</div>
    <div class="line" data-line="2">  pila ← []</div>
    <div class="line" data-line="3">  visitados ← {}</div>
    <div class="line" data-line="4">  <span class="keyword dfs-keyword">para cada</span> nodo en grafo:</div>
    <div class="line" data-line="5">    <span class="keyword dfs-keyword">si</span> nodo no en visitados:</div>
    <div class="line" data-line="6">      DFS_Topologico(nodo)</div>
    <div class="line" data-line="7">  <span class="keyword dfs-keyword">retornar</span> pila.invertir()</div>
    <div class="line" data-line="8"><span class="keyword dfs-keyword">DFS_Topologico</span>(nodo):</div>
    <div class="line" data-line="9">  visitados.añadir(nodo)</div>
    <div class="line" data-line="10">  <span class="keyword dfs-keyword">para cada</span> vecino: DFS_Topologico(vecino)</div>
    <div class="line" data-line="11">  pila.añadir(nodo) <span class="comment">// Post-order</span></div>
`
};

// Initialize
function init() {
    svg = d3.select('#graph-container')
        .append('svg')
        .attr('viewBox', '0 0 800 500');

    // Defs for filters
    const defs = svg.append('defs');

    // Glow filter for BFS
    const glowBFS = defs.append('filter')
        .attr('id', 'glow-bfs')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

    glowBFS.append('feGaussianBlur')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur');

    const glowMergeBFS = glowBFS.append('feMerge');
    glowMergeBFS.append('feMergeNode').attr('in', 'coloredBlur');
    glowMergeBFS.append('feMergeNode').attr('in', 'SourceGraphic');

    // Glow filter for DFS
    const glowDFS = defs.append('filter')
        .attr('id', 'glow-dfs')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

    glowDFS.append('feGaussianBlur')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur');

    const glowMergeDFS = glowDFS.append('feMerge');
    glowMergeDFS.append('feMergeNode').attr('in', 'coloredBlur');
    glowMergeDFS.append('feMergeNode').attr('in', 'SourceGraphic');

    linksGroup = svg.append('g').attr('class', 'links');
    nodesGroup = svg.append('g').attr('class', 'nodes');

    drawGraph();
    resetState();
    updateTotalSteps();
}

function drawGraph() {
    // Draw links
    linksGroup.selectAll('.link')
        .data(graphData.links)
        .join('line')
        .attr('class', 'link')
        .attr('x1', d => graphData.nodes.find(n => n.id === d.source).x)
        .attr('y1', d => graphData.nodes.find(n => n.id === d.source).y)
        .attr('x2', d => graphData.nodes.find(n => n.id === d.target).x)
        .attr('y2', d => graphData.nodes.find(n => n.id === d.target).y)
        .attr('data-source', d => d.source)
        .attr('data-target', d => d.target);

    // Draw nodes
    const nodeGroups = nodesGroup.selectAll('.node')
        .data(graphData.nodes)
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        .attr('data-id', d => d.id);

    nodeGroups.append('circle')
        .attr('r', 26)
        .attr('fill', colors.blanco)
        .attr('stroke', colors.grisBordes)
        .attr('stroke-width', 3);

    nodeGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', colors.negroTexto)
        .attr('font-size', '15px')
        .text(d => d.id);
}

function resetState() {
    searchState = {
        structure: [],
        visited: new Set(),
        visitOrder: [],
        current: null,
        parent: {},
        distances: {},
        levels: {},
        step: 0,
        phase: 'init',
        shortestPath: [],
        components: [],
        currentComponent: 0,
        // For bidirectional BFS
        structureForward: [],
        structureBackward: [],
        visitedForward: new Set(),
        visitedBackward: new Set(),
        intersectionNode: null
    };
    currentPseudoLine = 0;
    updateUI();
}

function updateTotalSteps() {
    document.getElementById('totalSteps').textContent = graphData.nodes.length;
}

function selectAlgorithm(algo) {
    if (isRunning) return;

    currentAlgorithm = algo;

    document.querySelectorAll('.algo-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.algo-btn.${algo}`).classList.add('active');

    const structureType = document.getElementById('structureType');
    const structureIndicator = document.getElementById('structureIndicator');
    const stepNumber = document.getElementById('stepNumber');
    const startBtn = document.getElementById('startBtn');
    const speedControl = document.getElementById('speedControl');
    const pseudocode = document.getElementById('pseudocode');
    const legendQueued = document.getElementById('legendQueued');
    const legendQueuedText = document.getElementById('legendQueuedText');
    const legendCurrent = document.getElementById('legendCurrent');

    const bfsVariantPanel = document.getElementById('bfsVariantPanel');

    const dfsVariantPanel = document.getElementById('dfsVariantPanel');
    const algorithmExplanation = document.getElementById('algorithmExplanation');

    if (algo === 'bfs') {
        structureType.textContent = 'Cola (FIFO)';
        structureType.className = 'structure-type bfs-type';
        structureIndicator.textContent = '← Frente';
        stepNumber.classList.remove('dfs-active');
        startBtn.classList.remove('dfs-active');
        speedControl.classList.remove('dfs-active');
        pseudocode.innerHTML = bfsPseudocodes[bfsVariant];
        legendQueued.className = 'legend-dot queued';
        legendQueuedText.textContent = 'En cola';
        legendCurrent.className = 'legend-dot current-bfs';
        bfsVariantPanel.classList.remove('hidden');
        dfsVariantPanel.classList.add('hidden');

        // Update explanation with current BFS variant
        const explanation = bfsExplanations[bfsVariant];
        algorithmExplanation.className = 'algorithm-explanation';
        algorithmExplanation.innerHTML = `
            <h4>${explanation.title}</h4>
            <p>${explanation.description}</p>
            <ul>
                ${explanation.points.map(point => `<li>${point}</li>`).join('')}
            </ul>
        `;
    } else {
        structureType.textContent = 'Pila (LIFO)';
        structureType.className = 'structure-type dfs-type';
        structureIndicator.textContent = '↑ Tope';
        stepNumber.classList.add('dfs-active');
        startBtn.classList.add('dfs-active');
        speedControl.classList.add('dfs-active');
        pseudocode.innerHTML = dfsPseudocodes[dfsVariant];
        legendQueued.className = 'legend-dot stacked';
        legendQueuedText.textContent = 'En pila';
        legendCurrent.className = 'legend-dot current-dfs';
        bfsVariantPanel.classList.add('hidden');
        dfsVariantPanel.classList.remove('hidden');

        // Update explanation with current DFS variant
        const explanation = dfsExplanations[dfsVariant];
        algorithmExplanation.className = 'algorithm-explanation dfs-variant';
        algorithmExplanation.innerHTML = `
            <h4 class="dfs-active">${explanation.title}</h4>
            <p>${explanation.description}</p>
            <ul>
                ${explanation.points.map(point => `<li>${point}</li>`).join('')}
            </ul>
        `;
    }

    resetGraph();
}

function selectBFSVariant(variant) {
    if (isRunning) return;

    bfsVariant = variant;

    // Update active button state
    document.querySelectorAll('.variant-btn-h').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update pseudocode
    const pseudocode = document.getElementById('pseudocode');
    pseudocode.innerHTML = bfsPseudocodes[variant];

    // Update UI elements based on variant
    const structureType = document.getElementById('structureType');

    switch(variant) {
        case 'levels':
            structureType.textContent = 'Cola con Niveles';
            break;
        case 'shortest-path':
            structureType.textContent = 'Cola (Camino Corto)';
            break;
        case 'components':
            structureType.textContent = 'Cola (Componentes)';
            break;
        case 'bidirectional':
            structureType.textContent = 'Dos Colas (Bidi)';
            break;
        default:
            structureType.textContent = 'Cola (FIFO)';
    }

    // Update explanation based on variant
    const explanation = bfsExplanations[variant];
    const algorithmExplanation = document.getElementById('algorithmExplanation');
    algorithmExplanation.className = 'algorithm-explanation';
    algorithmExplanation.innerHTML = `
        <h4>${explanation.title}</h4>
        <p>${explanation.description}</p>
        <ul>
            ${explanation.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
    `;

    resetGraph();
}

function selectDFSVariant(variant) {
    if (isRunning) return;

    dfsVariant = variant;

    // Update active button state
    document.querySelectorAll('.variant-btn-h-dfs').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update pseudocode
    const pseudocode = document.getElementById('pseudocode');
    pseudocode.innerHTML = dfsPseudocodes[variant];

    // Update UI elements based on variant
    const structureType = document.getElementById('structureType');

    switch(variant) {
        case 'recursive':
            structureType.textContent = 'Pila (Recursión)';
            break;
        case 'timestamps':
            structureType.textContent = 'Pila con Tiempos';
            break;
        case 'cycle-detection':
            structureType.textContent = 'Pila (Detección)';
            break;
        case 'topological':
            structureType.textContent = 'Pila (Topológico)';
            break;
        default:
            structureType.textContent = 'Pila (LIFO)';
    }

    // Update explanation based on variant
    const explanation = dfsExplanations[variant];
    const algorithmExplanation = document.getElementById('algorithmExplanation');
    algorithmExplanation.className = 'algorithm-explanation dfs-variant';
    algorithmExplanation.innerHTML = `
        <h4 class="dfs-active">${explanation.title}</h4>
        <p>${explanation.description}</p>
        <ul>
            ${explanation.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
    `;

    resetGraph();
}

function getNeighbors(nodeId) {
    const neighbors = [];
    graphData.links.forEach(link => {
        if (link.source === nodeId && !searchState.visited.has(link.target)) {
            neighbors.push(link.target);
        }
        if (link.target === nodeId && !searchState.visited.has(link.source)) {
            neighbors.push(link.source);
        }
    });
    return neighbors.sort();
}

function getNeighborsForBidirectional(nodeId, visitedSet) {
    const neighbors = [];
    graphData.links.forEach(link => {
        if (link.source === nodeId && !visitedSet.has(link.target)) {
            neighbors.push(link.target);
        }
        if (link.target === nodeId && !visitedSet.has(link.source)) {
            neighbors.push(link.source);
        }
    });
    return neighbors.sort();
}

function highlightPseudoLine(lineNum) {
    const isDFS = currentAlgorithm === 'dfs';
    document.querySelectorAll('.pseudocode .line').forEach(line => {
        line.classList.remove('active', 'dfs-active');
    });
    const targetLine = document.querySelector(`.pseudocode .line[data-line="${lineNum}"]`);
    if (targetLine) {
        targetLine.classList.add('active');
        if (isDFS) targetLine.classList.add('dfs-active');
    }
}

function performStep() {
    if (currentAlgorithm === 'bfs') {
        switch(bfsVariant) {
            case 'standard':
                return performStandardBFS();
            case 'levels':
                return performLevelsBFS();
            case 'shortest-path':
                return performShortestPathBFS();
            case 'components':
                return performComponentsBFS();
            case 'bidirectional':
                return performBidirectionalBFS();
            default:
                return performStandardBFS();
        }
    } else {
        switch(dfsVariant) {
            case 'iterative':
                return performIterativeDFS();
            case 'recursive':
                return performRecursiveDFS();
            case 'timestamps':
                return performTimestampsDFS();
            case 'cycle-detection':
                return performCycleDetectionDFS();
            case 'topological':
                return performTopologicalDFS();
            default:
                return performIterativeDFS();
        }
    }
}

// Standard BFS Implementation
function performStandardBFS() {
    if (searchState.structure.length === 0 && searchState.step === 0) {
        searchState.structure.push(startNode);
        searchState.distances[startNode] = 0;
        searchState.step++;
        highlightPseudoLine(2);
        updateUI();
        return true;
    }

    if (searchState.structure.length === 0) {
        highlightPseudoLine(4);
        stopSearch();
        return false;
    }

    let current = searchState.structure.shift();
    highlightPseudoLine(5);

    if (searchState.visited.has(current)) {
        return searchState.structure.length > 0;
    }

    searchState.current = current;
    searchState.visited.add(current);
    searchState.visitOrder.push(current);

    const neighbors = getNeighbors(current);
    const currentDistance = searchState.distances[current] || 0;

    neighbors.forEach(n => {
        if (!searchState.visited.has(n) && !searchState.structure.includes(n)) {
            searchState.structure.push(n);
            searchState.parent[n] = current;
            searchState.distances[n] = currentDistance + 1;
        }
    });
    highlightPseudoLine(10);

    searchState.step++;
    updateUI();

    return searchState.structure.length > 0 || searchState.visitOrder.length < graphData.nodes.length;
}

// BFS with Levels
function performLevelsBFS() {
    if (searchState.structure.length === 0 && searchState.step === 0) {
        searchState.structure.push({ node: startNode, level: 0 });
        searchState.levels[startNode] = 0;
        searchState.step++;
        highlightPseudoLine(2);
        updateUI();
        return true;
    }

    if (searchState.structure.length === 0) {
        highlightPseudoLine(5);
        stopSearch();
        return false;
    }

    let item = searchState.structure.shift();
    let current = item.node;
    let level = item.level;

    highlightPseudoLine(6);

    if (searchState.visited.has(current)) {
        return searchState.structure.length > 0;
    }

    searchState.current = current;
    searchState.visited.add(current);
    searchState.visitOrder.push(current);

    const neighbors = getNeighbors(current);

    neighbors.forEach(n => {
        if (!searchState.visited.has(n) && !searchState.structure.find(item => item.node === n)) {
            searchState.structure.push({ node: n, level: level + 1 });
            searchState.parent[n] = current;
            searchState.levels[n] = level + 1;
        }
    });
    highlightPseudoLine(11);

    searchState.step++;
    updateUI();

    return searchState.structure.length > 0 || searchState.visitOrder.length < graphData.nodes.length;
}

// Shortest Path BFS
function performShortestPathBFS() {
    if (searchState.structure.length === 0 && searchState.step === 0) {
        searchState.structure.push(startNode);
        searchState.distances[startNode] = 0;
        searchState.step++;
        highlightPseudoLine(2);
        updateUI();
        return true;
    }

    if (searchState.structure.length === 0) {
        highlightPseudoLine(5);
        stopSearch();
        return false;
    }

    let current = searchState.structure.shift();
    highlightPseudoLine(6);

    if (searchState.visited.has(current)) {
        return searchState.structure.length > 0;
    }

    searchState.current = current;
    searchState.visited.add(current);
    searchState.visitOrder.push(current);

    // Check if we reached target
    if (current === targetNode) {
        highlightPseudoLine(8);
        reconstructShortestPath();
        stopSearch();
        return false;
    }

    const neighbors = getNeighbors(current);
    const currentDistance = searchState.distances[current] || 0;

    neighbors.forEach(n => {
        if (!searchState.visited.has(n) && !searchState.structure.includes(n)) {
            searchState.structure.push(n);
            searchState.parent[n] = current;
            searchState.distances[n] = currentDistance + 1;
        }
    });
    highlightPseudoLine(12);

    searchState.step++;
    updateUI();

    return searchState.structure.length > 0;
}

function reconstructShortestPath() {
    const path = [];
    let current = targetNode;

    while (current !== undefined) {
        path.unshift(current);
        current = searchState.parent[current];
    }

    searchState.shortestPath = path;
}

// Components BFS
function performComponentsBFS() {
    // Initialize if first step
    if (searchState.step === 0) {
        searchState.currentComponent = 0;
        searchState.components = [[]];
        searchState.allNodesQueue = [...graphData.nodes.map(n => n.id)];
        highlightPseudoLine(3);
    }

    // If current component search is done, move to next unvisited node
    if (searchState.structure.length === 0) {
        while (searchState.allNodesQueue.length > 0) {
            const nextNode = searchState.allNodesQueue.shift();
            if (!searchState.visited.has(nextNode)) {
                searchState.structure.push(nextNode);
                searchState.currentComponent++;
                searchState.components.push([]);
                highlightPseudoLine(6);
                break;
            }
        }
    }

    if (searchState.structure.length === 0) {
        highlightPseudoLine(9);
        stopSearch();
        return false;
    }

    let current = searchState.structure.shift();

    if (searchState.visited.has(current)) {
        return true;
    }

    searchState.current = current;
    searchState.visited.add(current);
    searchState.visitOrder.push(current);
    searchState.components[searchState.currentComponent].push(current);

    const neighbors = getNeighbors(current);

    neighbors.forEach(n => {
        if (!searchState.visited.has(n) && !searchState.structure.includes(n)) {
            searchState.structure.push(n);
            searchState.parent[n] = current;
        }
    });

    searchState.step++;
    updateUI();

    return true;
}

// Bidirectional BFS
function performBidirectionalBFS() {
    if (searchState.step === 0) {
        searchState.structureForward = [startNode];
        searchState.structureBackward = [targetNode];
        searchState.visitedForward.add(startNode);
        searchState.visitedBackward.add(targetNode);
        searchState.step++;
        highlightPseudoLine(2);
        updateUI();
        return true;
    }

    if (searchState.structureForward.length === 0 && searchState.structureBackward.length === 0) {
        stopSearch();
        return false;
    }

    // Expand from the smaller frontier
    let expandFromForward = searchState.structureForward.length <= searchState.structureBackward.length;

    if (expandFromForward && searchState.structureForward.length > 0) {
        let current = searchState.structureForward.shift();
        searchState.current = current;
        searchState.visitOrder.push(current);

        // Check for intersection
        if (searchState.visitedBackward.has(current)) {
            searchState.intersectionNode = current;
            highlightPseudoLine(9);
            reconstructBidirectionalPath();
            stopSearch();
            return false;
        }

        const neighbors = getNeighborsForBidirectional(current, searchState.visitedForward);
        neighbors.forEach(n => {
            if (!searchState.visitedForward.has(n)) {
                searchState.structureForward.push(n);
                searchState.visitedForward.add(n);
                searchState.parent[n] = current;
            }
        });
    } else if (searchState.structureBackward.length > 0) {
        let current = searchState.structureBackward.shift();
        searchState.current = current;
        searchState.visitOrder.push(current);

        // Check for intersection
        if (searchState.visitedForward.has(current)) {
            searchState.intersectionNode = current;
            highlightPseudoLine(12);
            reconstructBidirectionalPath();
            stopSearch();
            return false;
        }

        const neighbors = getNeighborsForBidirectional(current, searchState.visitedBackward);
        neighbors.forEach(n => {
            if (!searchState.visitedBackward.has(n)) {
                searchState.structureBackward.push(n);
                searchState.visitedBackward.add(n);
                if (!searchState.parent[current]) {
                    searchState.parent[current] = n;
                }
            }
        });
    }

    searchState.step++;
    updateUI();
    return true;
}

function reconstructBidirectionalPath() {
    // This is a simplified version - full implementation would merge both paths
    searchState.shortestPath = [...searchState.visitOrder];
}

// DFS Implementation (keeping original)
// DFS Iterative Implementation
function performIterativeDFS() {
    if (searchState.structure.length === 0 && searchState.step === 0) {
        searchState.structure.push(startNode);
        searchState.step++;
        highlightPseudoLine(2);
        updateUI();
        return true;
    }

    if (searchState.structure.length === 0) {
        highlightPseudoLine(4);
        stopSearch();
        return false;
    }

    let current = searchState.structure.pop();
    highlightPseudoLine(5);

    if (searchState.visited.has(current)) {
        return searchState.structure.length > 0;
    }

    searchState.current = current;
    searchState.visited.add(current);
    searchState.visitOrder.push(current);

    const neighbors = getNeighbors(current);

    neighbors.reverse().forEach(n => {
        if (!searchState.visited.has(n) && !searchState.structure.includes(n)) {
            searchState.structure.push(n);
            searchState.parent[n] = current;
        }
    });
    highlightPseudoLine(10);

    searchState.step++;
    updateUI();

    return searchState.structure.length > 0 || searchState.visitOrder.length < graphData.nodes.length;
}

// DFS Recursive Implementation (simulated with explicit stack)
function performRecursiveDFS() {
    if (!searchState.recursionStack) {
        searchState.recursionStack = [{ node: startNode, neighborIndex: 0 }];
        searchState.step++;
        highlightPseudoLine(1);
        updateUI();
        return true;
    }

    if (searchState.recursionStack.length === 0) {
        highlightPseudoLine(3);
        stopSearch();
        return false;
    }

    const frame = searchState.recursionStack[searchState.recursionStack.length - 1];
    const current = frame.node;

    // Check if already visited
    if (frame.neighborIndex === 0 && searchState.visited.has(current)) {
        searchState.recursionStack.pop();
        highlightPseudoLine(3);
        updateUI();
        return searchState.recursionStack.length > 0;
    }

    // First visit - mark as visited
    if (frame.neighborIndex === 0) {
        searchState.current = current;
        searchState.visited.add(current);
        searchState.visitOrder.push(current);
        highlightPseudoLine(4);
        searchState.structure = searchState.recursionStack.map(f => f.node);
    }

    const neighbors = getNeighbors(current);

    if (frame.neighborIndex < neighbors.length) {
        const neighbor = neighbors[frame.neighborIndex];
        frame.neighborIndex++;

        if (!searchState.visited.has(neighbor)) {
            searchState.recursionStack.push({ node: neighbor, neighborIndex: 0 });
            searchState.parent[neighbor] = current;
            highlightPseudoLine(7);
        }
    } else {
        searchState.recursionStack.pop();
    }

    searchState.step++;
    updateUI();

    return searchState.recursionStack.length > 0 || searchState.visitOrder.length < graphData.nodes.length;
}

// DFS with Timestamps
function performTimestampsDFS() {
    if (!searchState.timestamps) {
        searchState.timestamps = { discovery: {}, finish: {} };
        searchState.time = 0;
        searchState.nodeQueue = graphData.nodes.map(n => n.id);
        searchState.recursionStack = [];
        searchState.step++;
        updateUI();
        return true;
    }

    // Process next unvisited node
    if (searchState.recursionStack.length === 0) {
        while (searchState.nodeQueue.length > 0) {
            const next = searchState.nodeQueue[0];
            if (!searchState.visited.has(next)) {
                searchState.time++;
                searchState.timestamps.discovery[next] = searchState.time;
                searchState.recursionStack.push({ node: next, neighborIndex: 0 });
                searchState.structure = [next];
                highlightPseudoLine(7);
                break;
            }
            searchState.nodeQueue.shift();
        }

        if (searchState.recursionStack.length === 0) {
            highlightPseudoLine(10);
            stopSearch();
            return false;
        }
    }

    const frame = searchState.recursionStack[searchState.recursionStack.length - 1];
    const current = frame.node;

    if (frame.neighborIndex === 0 && !searchState.visited.has(current)) {
        searchState.current = current;
        searchState.visited.add(current);
        searchState.visitOrder.push(current);
        highlightPseudoLine(7);
    }

    const neighbors = getNeighbors(current);

    if (frame.neighborIndex < neighbors.length) {
        const neighbor = neighbors[frame.neighborIndex];
        frame.neighborIndex++;

        if (!searchState.visited.has(neighbor)) {
            searchState.time++;
            searchState.timestamps.discovery[neighbor] = searchState.time;
            searchState.recursionStack.push({ node: neighbor, neighborIndex: 0 });
            searchState.parent[neighbor] = current;
            searchState.structure.push(neighbor);
        }
    } else {
        searchState.recursionStack.pop();
        searchState.time++;
        searchState.timestamps.finish[current] = searchState.time;
        searchState.structure = searchState.recursionStack.map(f => f.node);
        highlightPseudoLine(10);
    }

    searchState.step++;
    updateUI();

    return searchState.recursionStack.length > 0 || searchState.nodeQueue.length > 0;
}

// DFS Cycle Detection
function performCycleDetectionDFS() {
    if (!searchState.colors) {
        searchState.colors = {};
        graphData.nodes.forEach(n => {
            searchState.colors[n.id] = 'WHITE';
        });
        searchState.nodeQueue = graphData.nodes.map(n => n.id);
        searchState.recursionStack = [];
        searchState.cycleDetected = false;
        searchState.step++;
        updateUI();
        return true;
    }

    if (searchState.recursionStack.length === 0) {
        while (searchState.nodeQueue.length > 0) {
            const next = searchState.nodeQueue[0];
            if (searchState.colors[next] === 'WHITE') {
                searchState.recursionStack.push({ node: next, neighborIndex: 0 });
                searchState.structure = [next];
                break;
            }
            searchState.nodeQueue.shift();
        }

        if (searchState.recursionStack.length === 0) {
            highlightPseudoLine(7);
            stopSearch();
            return false;
        }
    }

    const frame = searchState.recursionStack[searchState.recursionStack.length - 1];
    const current = frame.node;

    if (frame.neighborIndex === 0 && searchState.colors[current] === 'WHITE') {
        searchState.current = current;
        searchState.colors[current] = 'GRAY';
        searchState.visited.add(current);
        searchState.visitOrder.push(current);
        highlightPseudoLine(9);
    }

    const neighbors = getNeighbors(current);

    if (frame.neighborIndex < neighbors.length) {
        const neighbor = neighbors[frame.neighborIndex];
        frame.neighborIndex++;

        if (searchState.colors[neighbor] === 'GRAY') {
            searchState.cycleDetected = true;
            searchState.cycleEdge = { from: current, to: neighbor };
            highlightPseudoLine(11);
        } else if (searchState.colors[neighbor] === 'WHITE') {
            searchState.recursionStack.push({ node: neighbor, neighborIndex: 0 });
            searchState.parent[neighbor] = current;
            searchState.structure.push(neighbor);
        }
    } else {
        searchState.recursionStack.pop();
        searchState.colors[current] = 'BLACK';
        searchState.structure = searchState.recursionStack.map(f => f.node);
    }

    searchState.step++;
    updateUI();

    return !searchState.cycleDetected && (searchState.recursionStack.length > 0 || searchState.nodeQueue.length > 0);
}

// DFS Topological Sort
function performTopologicalDFS() {
    if (!searchState.topologicalOrder) {
        searchState.topologicalOrder = [];
        searchState.nodeQueue = graphData.nodes.map(n => n.id);
        searchState.recursionStack = [];
        searchState.step++;
        updateUI();
        return true;
    }

    if (searchState.recursionStack.length === 0) {
        while (searchState.nodeQueue.length > 0) {
            const next = searchState.nodeQueue[0];
            if (!searchState.visited.has(next)) {
                searchState.recursionStack.push({ node: next, neighborIndex: 0, processed: false });
                searchState.structure = [next];
                highlightPseudoLine(6);
                break;
            }
            searchState.nodeQueue.shift();
        }

        if (searchState.recursionStack.length === 0) {
            highlightPseudoLine(7);
            stopSearch();
            return false;
        }
    }

    const frame = searchState.recursionStack[searchState.recursionStack.length - 1];
    const current = frame.node;

    if (frame.neighborIndex === 0 && !searchState.visited.has(current)) {
        searchState.current = current;
        searchState.visited.add(current);
        searchState.visitOrder.push(current);
        highlightPseudoLine(9);
    }

    const neighbors = getNeighbors(current);

    if (frame.neighborIndex < neighbors.length) {
        const neighbor = neighbors[frame.neighborIndex];
        frame.neighborIndex++;

        if (!searchState.visited.has(neighbor)) {
            searchState.recursionStack.push({ node: neighbor, neighborIndex: 0, processed: false });
            searchState.parent[neighbor] = current;
            searchState.structure.push(neighbor);
            highlightPseudoLine(10);
        }
    } else {
        if (!frame.processed) {
            searchState.topologicalOrder.unshift(current);
            frame.processed = true;
            highlightPseudoLine(11);
        }
        searchState.recursionStack.pop();
        searchState.structure = searchState.recursionStack.map(f => f.node);
    }

    searchState.step++;
    updateUI();

    return searchState.recursionStack.length > 0 || searchState.nodeQueue.length > 0;
}

function updateUI() {
    const isDFS = currentAlgorithm === 'dfs';
    const accentColor = isDFS ? colors.morado : colors.azulIlerna;
    const bgColor = isDFS ? colors.fondoMorado : colors.fondoAzul;
    const glowFilter = isDFS ? 'url(#glow-dfs)' : 'url(#glow-bfs)';

    // Update nodes
    nodesGroup.selectAll('.node').each(function(d) {
        const node = d3.select(this);
        const circle = node.select('circle');
        const text = node.select('text');
        const id = d.id;

        node.classed('current', id === searchState.current);
        node.classed('dfs-mode', isDFS);

        // Special highlighting for start and target nodes in shortest-path variant
        let isInPath = searchState.shortestPath.includes(id);
        let isStart = id === startNode;
        let isTarget = id === targetNode;

        if (id === searchState.current) {
            circle.attr('fill', accentColor)
                .attr('stroke', accentColor)
                .attr('filter', glowFilter);
            text.attr('fill', colors.blanco);
        } else if (isInPath && bfsVariant === 'shortest-path') {
            circle.attr('fill', colors.warning)
                .attr('stroke', colors.warning)
                .attr('filter', null);
            text.attr('fill', colors.blanco);
        } else if (searchState.visited.has(id)) {
            circle.attr('fill', colors.success)
                .attr('stroke', colors.success)
                .attr('filter', null);
            text.attr('fill', colors.blanco);
        } else if (searchState.structure.includes(id) ||
                   (bfsVariant === 'levels' && searchState.structure.find(item => item.node === id)) ||
                   (bfsVariant === 'bidirectional' && (searchState.structureForward.includes(id) || searchState.structureBackward.includes(id)))) {
            circle.attr('fill', bgColor)
                .attr('stroke', accentColor)
                .attr('filter', null);
            text.attr('fill', colors.negroTexto);
        } else {
            circle.attr('fill', colors.blanco)
                .attr('stroke', colors.grisBordes)
                .attr('filter', null);
            text.attr('fill', colors.negroTexto);
        }
    });

    // Update visit order numbers on nodes
    nodesGroup.selectAll('.node-order').remove();
    searchState.visitOrder.forEach((nodeId, index) => {
        const node = nodesGroup.select(`[data-id="${nodeId}"]`);
        node.append('text')
            .attr('class', 'node-order')
            .attr('x', 22)
            .attr('y', -18)
            .text(index + 1);
    });

    // Add level indicators for levels variant
    if (bfsVariant === 'levels') {
        nodesGroup.selectAll('.node-level').remove();
        Object.keys(searchState.levels).forEach(nodeId => {
            const node = nodesGroup.select(`[data-id="${nodeId}"]`);
            node.append('text')
                .attr('class', 'node-level')
                .attr('x', -38)
                .attr('y', -18)
                .attr('fill', colors.azulIlerna)
                .attr('font-size', '11px')
                .attr('font-weight', '700')
                .text(`L${searchState.levels[nodeId]}`);
        });
    }

    // Update links
    linksGroup.selectAll('.link').each(function(d) {
        const link = d3.select(this);
        const sourceVisited = searchState.visited.has(d.source);
        const targetVisited = searchState.visited.has(d.target);

        link.classed('dfs-mode', isDFS);

        // Highlight shortest path
        if (bfsVariant === 'shortest-path' && searchState.shortestPath.length > 0) {
            const inPath = searchState.shortestPath.includes(d.source) &&
                          searchState.shortestPath.includes(d.target) &&
                          Math.abs(searchState.shortestPath.indexOf(d.source) - searchState.shortestPath.indexOf(d.target)) === 1;

            if (inPath) {
                link.attr('stroke', colors.warning)
                    .attr('stroke-width', 5)
                    .classed('traversed', false)
                    .classed('active', false);
                return;
            }
        }

        if (searchState.parent[d.target] === d.source || searchState.parent[d.source] === d.target) {
            if ((d.source === searchState.current || d.target === searchState.current) &&
                (sourceVisited || targetVisited)) {
                link.classed('active', true).classed('traversed', false);
            } else if (sourceVisited && targetVisited) {
                link.classed('traversed', true).classed('active', false);
            }
        } else {
            link.classed('traversed', false).classed('active', false);
        }
    });

    // Update structure display
    updateStructureDisplay();

    // Update visit order display
    const visitOrder = document.getElementById('visitOrder');
    visitOrder.innerHTML = searchState.visitOrder.map((item, i) =>
        `<div class="visit-item">
            ${i > 0 ? '<span class="arrow">→</span>' : ''}
            <span class="num">${item}</span>
        </div>`
    ).join('');

    // Update step counter
    document.getElementById('stepNumber').textContent = searchState.visitOrder.length;

    // Update additional info for BFS variants
    updateVariantInfo();
}

function updateStructureDisplay() {
    const structureItems = document.getElementById('structureItems');
    const isDFS = currentAlgorithm === 'dfs';
    const itemClass = isDFS ? 'dfs-item' : 'bfs-item';

    if (bfsVariant === 'levels') {
        structureItems.innerHTML = searchState.structure.map((item, i) =>
            `<div class="structure-item ${itemClass} ${i === 0 ? 'front' : ''}" ${i === 0 ? 'data-label="FRENTE"' : ''}>
                ${item.node}<sub>L${item.level}</sub>
            </div>`
        ).join('');
    } else if (bfsVariant === 'bidirectional') {
        const forwardHTML = searchState.structureForward.map((item, i) =>
            `<div class="structure-item ${itemClass}" style="border-color: #49B9CE;">${item}</div>`
        ).join('');
        const backwardHTML = searchState.structureBackward.map((item, i) =>
            `<div class="structure-item ${itemClass}" style="border-color: #8A7AAF;">${item}</div>`
        ).join('');
        structureItems.innerHTML = forwardHTML + (forwardHTML && backwardHTML ? '<div style="width: 100%; border-top: 2px solid #ccc; margin: 0.5rem 0;"></div>' : '') + backwardHTML;
    } else if (isDFS) {
        const reversed = [...searchState.structure].reverse();
        structureItems.innerHTML = reversed.map((item, i) =>
            `<div class="structure-item ${itemClass} ${i === 0 ? 'top' : ''}" ${i === 0 ? 'data-label="TOPE"' : ''}>${item}</div>`
        ).join('');
    } else {
        structureItems.innerHTML = searchState.structure.map((item, i) =>
            `<div class="structure-item ${itemClass} ${i === 0 ? 'front' : ''}" ${i === 0 ? 'data-label="FRENTE"' : ''}>${item}</div>`
        ).join('');
    }
}

function updateVariantInfo() {
    // This function can be extended to show additional information
    // based on the BFS variant being used
}

function startSearch() {
    if (isRunning) {
        stopSearch();
        return;
    }

    isRunning = true;
    document.getElementById('startBtn').innerHTML = '⏸ Pausar';
    document.getElementById('stepBtn').disabled = true;

    animationInterval = setInterval(() => {
        if (!performStep()) {
            stopSearch();
        }
    }, animationSpeed);
}

function stopSearch() {
    isRunning = false;
    clearInterval(animationInterval);
    document.getElementById('startBtn').innerHTML = '▶ Iniciar';
    document.getElementById('stepBtn').disabled = false;
}

function stepSearch() {
    if (!isRunning) {
        performStep();
    }
}

function resetGraph() {
    stopSearch();
    resetState();

    // Reset visual state
    nodesGroup.selectAll('.node circle')
        .attr('fill', colors.blanco)
        .attr('stroke', colors.grisBordes)
        .attr('filter', null);

    nodesGroup.selectAll('.node text')
        .attr('fill', colors.negroTexto);

    nodesGroup.selectAll('.node')
        .classed('current', false)
        .classed('dfs-mode', false);

    nodesGroup.selectAll('.node-order').remove();
    nodesGroup.selectAll('.node-level').remove();

    linksGroup.selectAll('.link')
        .classed('traversed', false)
        .classed('active', false)
        .classed('dfs-mode', false)
        .attr('stroke', colors.grisBordes)
        .attr('stroke-width', 3);

    document.getElementById('structureItems').innerHTML = '';
    document.getElementById('visitOrder').innerHTML = '';
    document.getElementById('stepNumber').textContent = '0';

    // Reset pseudocode highlight
    document.querySelectorAll('.pseudocode .line').forEach(line => {
        line.classList.remove('active', 'dfs-active');
    });
}

function updateSpeed() {
    const slider = document.getElementById('speedSlider');
    animationSpeed = 2100 - slider.value;

    if (isRunning) {
        clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            if (!performStep()) {
                stopSearch();
            }
        }, animationSpeed);
    }
}

function setStartNode(nodeId) {
    if (isRunning) return;
    startNode = nodeId;
    resetGraph();
}

function setTargetNode(nodeId) {
    if (isRunning) return;
    targetNode = nodeId;
    resetGraph();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
