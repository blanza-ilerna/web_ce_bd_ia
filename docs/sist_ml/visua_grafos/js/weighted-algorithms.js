// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================

const width = 1000;
const height = 500;
let svg, simulation;

// Estado global
let currentAlgorithm = 'dijkstra';
let currentVariant = 'standard';
let animationSpeed = 800;
let isAnimating = false;
let currentStep = 0;
let steps = [];

// Datos del grafo con pesos
const graphData = {
    nodes: [
        { id: 'A', x: 150, y: 150 },
        { id: 'B', x: 300, y: 100 },
        { id: 'C', x: 450, y: 150 },
        { id: 'D', x: 300, y: 250 },
        { id: 'E', x: 600, y: 100 },
        { id: 'F', x: 750, y: 200 },
        { id: 'G', x: 450, y: 350 },
        { id: 'H', x: 600, y: 400 }
    ],
    links: [
        { source: 'A', target: 'B', weight: 4 },
        { source: 'A', target: 'D', weight: 2 },
        { source: 'B', target: 'C', weight: 3 },
        { source: 'B', target: 'D', weight: 1 },
        { source: 'C', target: 'E', weight: 2 },
        { source: 'D', target: 'C', weight: 5 },
        { source: 'D', target: 'G', weight: 7 },
        { source: 'E', target: 'F', weight: 1 },
        { source: 'G', target: 'H', weight: 3 },
        { source: 'C', target: 'F', weight: 6 },
        { source: 'F', target: 'H', weight: 2 }
    ]
};

// ============================================
// EXPLICACIONES POR ALGORITMO Y VARIANTE
// ============================================

const dijkstraExplanations = {
    standard: {
        title: 'Dijkstra Estándar',
        description: 'Encuentra el camino más corto desde un nodo origen a todos los demás nodos en un grafo con pesos no negativos.',
        points: [
            '<strong>Estructura:</strong> Cola de prioridad (Min-Heap)',
            '<strong>Aplicación:</strong> GPS, routing de redes, planificación de rutas',
            '<strong>Complejidad:</strong> O((V + E) log V) con heap binario',
            '<strong>Restricción:</strong> No funciona con pesos negativos'
        ]
    },
    'path-reconstruction': {
        title: 'Dijkstra con Reconstrucción de Camino',
        description: 'Además de calcular distancias mínimas, mantiene un registro de predecesores para reconstruir el camino completo.',
        points: [
            '<strong>Estructura:</strong> Cola de prioridad + Array de predecesores',
            '<strong>Aplicación:</strong> Navegación GPS con ruta visual, planificación de rutas',
            '<strong>Complejidad:</strong> O((V + E) log V) tiempo | O(V) espacio adicional',
            '<strong>Ventaja:</strong> Permite obtener la secuencia completa de nodos del camino'
        ]
    },
    'all-paths': {
        title: 'Dijkstra - Todos los Caminos Mínimos',
        description: 'Encuentra todos los caminos de distancia mínima cuando existen múltiples rutas óptimas.',
        points: [
            '<strong>Estructura:</strong> Cola de prioridad + Grafo de predecesores',
            '<strong>Aplicación:</strong> Rutas alternativas en navegación, análisis de redundancia',
            '<strong>Complejidad:</strong> O((V + E) log V) con memoria adicional para múltiples caminos',
            '<strong>Utilidad:</strong> Proporciona rutas alternativas con la misma distancia óptima'
        ]
    }
};

const bellmanFordExplanations = {
    standard: {
        title: 'Bellman-Ford Estándar',
        description: 'Calcula distancias mínimas desde un origen, soportando aristas con pesos negativos.',
        points: [
            '<strong>Estructura:</strong> Array de distancias + Relajación de aristas',
            '<strong>Aplicación:</strong> Redes con costos variables, arbitraje en finanzas',
            '<strong>Complejidad:</strong> O(V × E) tiempo | O(V) espacio',
            '<strong>Ventaja:</strong> Funciona con pesos negativos y detecta ciclos negativos'
        ]
    },
    'cycle-detection': {
        title: 'Bellman-Ford con Detección de Ciclos Negativos',
        description: 'Identifica la presencia de ciclos con suma de pesos negativa, que invalidan el camino más corto.',
        points: [
            '<strong>Estructura:</strong> Array de distancias + Iteración extra de verificación',
            '<strong>Aplicación:</strong> Detección de arbitraje, validación de grafos',
            '<strong>Complejidad:</strong> O(V × E) tiempo',
            '<strong>Detección:</strong> Si tras V-1 iteraciones aún se pueden relajar aristas, existe un ciclo negativo'
        ]
    },
    spfa: {
        title: 'SPFA - Shortest Path Faster Algorithm',
        description: 'Optimización de Bellman-Ford usando una cola para procesar solo nodos con distancias actualizadas.',
        points: [
            '<strong>Estructura:</strong> Cola + Array de distancias + Marcas de "en cola"',
            '<strong>Aplicación:</strong> Alternativa más rápida a Bellman-Ford en la mayoría de casos',
            '<strong>Complejidad:</strong> O(V × E) peor caso | O(E) caso promedio',
            '<strong>Optimización:</strong> Evita procesar nodos cuyas distancias no han cambiado'
        ]
    }
};

const floydWarshallExplanations = {
    standard: {
        title: 'Floyd-Warshall Estándar',
        description: 'Calcula las distancias mínimas entre todos los pares de nodos usando programación dinámica.',
        points: [
            '<strong>Estructura:</strong> Matriz de distancias V×V',
            '<strong>Aplicación:</strong> Análisis de redes completas, planificación de rutas múltiples',
            '<strong>Complejidad:</strong> O(V³) tiempo | O(V²) espacio',
            '<strong>Ventaja:</strong> Resuelve todos los pares a la vez, muy simple de implementar'
        ]
    },
    'path-reconstruction': {
        title: 'Floyd-Warshall con Reconstrucción',
        description: 'Mantiene una matriz de nodos intermedios para reconstruir cualquier camino entre dos nodos.',
        points: [
            '<strong>Estructura:</strong> Matriz de distancias + Matriz de predecesores',
            '<strong>Aplicación:</strong> Tablas de routing completas con caminos',
            '<strong>Complejidad:</strong> O(V³) tiempo | O(V²) espacio',
            '<strong>Reconstrucción:</strong> Permite obtener el camino completo entre cualquier par de nodos'
        ]
    },
    'transitive-closure': {
        title: 'Floyd-Warshall - Clausura Transitiva',
        description: 'Determina qué nodos son alcanzables desde otros, sin calcular distancias exactas.',
        points: [
            '<strong>Estructura:</strong> Matriz booleana de alcanzabilidad',
            '<strong>Aplicación:</strong> Análisis de conectividad, detección de componentes',
            '<strong>Complejidad:</strong> O(V³) tiempo | O(V²) espacio',
            '<strong>Resultado:</strong> Matriz que indica si existe un camino entre cada par de nodos'
        ]
    }
};

// ============================================
// PSEUDOCÓDIGO POR ALGORITMO Y VARIANTE
// ============================================

const dijkstraPseudocodes = {
    standard: [
        { line: 1, text: '<span class="keyword">Dijkstra</span>(grafo, inicio):' },
        { line: 2, text: '  distancias ← {∞ para todos}' },
        { line: 3, text: '  distancias[inicio] ← 0' },
        { line: 4, text: '  cola_prioridad ← [(0, inicio)]' },
        { line: 5, text: '  <span class="keyword">mientras</span> cola no vacía:' },
        { line: 6, text: '    dist_actual, nodo ← cola.<span class="keyword">extraer_min()</span>' },
        { line: 7, text: '    <span class="keyword">si</span> dist_actual > distancias[nodo]: <span class="keyword">continuar</span>' },
        { line: 8, text: '    <span class="keyword">para cada</span> vecino, peso de nodo:' },
        { line: 9, text: '      nueva_dist ← distancias[nodo] + peso' },
        { line: 10, text: '      <span class="keyword">si</span> nueva_dist < distancias[vecino]:' },
        { line: 11, text: '        distancias[vecino] ← nueva_dist' },
        { line: 12, text: '        cola.<span class="keyword">insertar</span>(nueva_dist, vecino)' }
    ],
    'path-reconstruction': [
        { line: 1, text: '<span class="keyword">Dijkstra_Camino</span>(grafo, inicio):' },
        { line: 2, text: '  distancias ← {∞ para todos}, predecesores ← {}' },
        { line: 3, text: '  distancias[inicio] ← 0' },
        { line: 4, text: '  cola_prioridad ← [(0, inicio)]' },
        { line: 5, text: '  <span class="keyword">mientras</span> cola no vacía:' },
        { line: 6, text: '    dist_actual, nodo ← cola.<span class="keyword">extraer_min()</span>' },
        { line: 7, text: '    <span class="keyword">si</span> dist_actual > distancias[nodo]: <span class="keyword">continuar</span>' },
        { line: 8, text: '    <span class="keyword">para cada</span> vecino, peso de nodo:' },
        { line: 9, text: '      nueva_dist ← distancias[nodo] + peso' },
        { line: 10, text: '      <span class="keyword">si</span> nueva_dist < distancias[vecino]:' },
        { line: 11, text: '        distancias[vecino] ← nueva_dist' },
        { line: 12, text: '        predecesores[vecino] ← nodo' },
        { line: 13, text: '        cola.<span class="keyword">insertar</span>(nueva_dist, vecino)' }
    ],
    'all-paths': [
        { line: 1, text: '<span class="keyword">Dijkstra_TodosCaminos</span>(grafo, inicio):' },
        { line: 2, text: '  distancias ← {∞ para todos}, predecesores ← {[] para todos}' },
        { line: 3, text: '  distancias[inicio] ← 0' },
        { line: 4, text: '  cola_prioridad ← [(0, inicio)]' },
        { line: 5, text: '  <span class="keyword">mientras</span> cola no vacía:' },
        { line: 6, text: '    dist_actual, nodo ← cola.<span class="keyword">extraer_min()</span>' },
        { line: 7, text: '    <span class="keyword">si</span> dist_actual > distancias[nodo]: <span class="keyword">continuar</span>' },
        { line: 8, text: '    <span class="keyword">para cada</span> vecino, peso de nodo:' },
        { line: 9, text: '      nueva_dist ← distancias[nodo] + peso' },
        { line: 10, text: '      <span class="keyword">si</span> nueva_dist < distancias[vecino]:' },
        { line: 11, text: '        distancias[vecino] ← nueva_dist' },
        { line: 12, text: '        predecesores[vecino] ← [nodo]' },
        { line: 13, text: '        cola.<span class="keyword">insertar</span>(nueva_dist, vecino)' },
        { line: 14, text: '      <span class="keyword">si no si</span> nueva_dist == distancias[vecino]:' },
        { line: 15, text: '        predecesores[vecino].<span class="keyword">añadir</span>(nodo)' }
    ]
};

const bellmanFordPseudocodes = {
    standard: [
        { line: 1, text: '<span class="keyword">BellmanFord</span>(grafo, inicio):' },
        { line: 2, text: '  distancias ← {∞ para todos}' },
        { line: 3, text: '  distancias[inicio] ← 0' },
        { line: 4, text: '  <span class="keyword">para</span> i de 1 a V-1:' },
        { line: 5, text: '    <span class="keyword">para cada</span> arista (u, v, peso):' },
        { line: 6, text: '      <span class="keyword">si</span> distancias[u] + peso < distancias[v]:' },
        { line: 7, text: '        distancias[v] ← distancias[u] + peso' },
        { line: 8, text: '  <span class="keyword">retornar</span> distancias' }
    ],
    'cycle-detection': [
        { line: 1, text: '<span class="keyword">BellmanFord_Ciclos</span>(grafo, inicio):' },
        { line: 2, text: '  distancias ← {∞ para todos}' },
        { line: 3, text: '  distancias[inicio] ← 0' },
        { line: 4, text: '  <span class="keyword">para</span> i de 1 a V-1:' },
        { line: 5, text: '    <span class="keyword">para cada</span> arista (u, v, peso):' },
        { line: 6, text: '      <span class="keyword">si</span> distancias[u] + peso < distancias[v]:' },
        { line: 7, text: '        distancias[v] ← distancias[u] + peso' },
        { line: 8, text: '  <span class="comment">// Verificar ciclos negativos</span>' },
        { line: 9, text: '  <span class="keyword">para cada</span> arista (u, v, peso):' },
        { line: 10, text: '    <span class="keyword">si</span> distancias[u] + peso < distancias[v]:' },
        { line: 11, text: '      <span class="keyword">retornar</span> "Ciclo negativo detectado"' },
        { line: 12, text: '  <span class="keyword">retornar</span> distancias' }
    ],
    spfa: [
        { line: 1, text: '<span class="keyword">SPFA</span>(grafo, inicio):' },
        { line: 2, text: '  distancias ← {∞ para todos}, en_cola ← {false para todos}' },
        { line: 3, text: '  distancias[inicio] ← 0' },
        { line: 4, text: '  cola ← [inicio], en_cola[inicio] ← true' },
        { line: 5, text: '  <span class="keyword">mientras</span> cola no vacía:' },
        { line: 6, text: '    u ← cola.<span class="keyword">extraer_frente()</span>' },
        { line: 7, text: '    en_cola[u] ← false' },
        { line: 8, text: '    <span class="keyword">para cada</span> vecino v, peso de u:' },
        { line: 9, text: '      <span class="keyword">si</span> distancias[u] + peso < distancias[v]:' },
        { line: 10, text: '        distancias[v] ← distancias[u] + peso' },
        { line: 11, text: '        <span class="keyword">si</span> v no en_cola:' },
        { line: 12, text: '          cola.<span class="keyword">añadir</span>(v), en_cola[v] ← true' },
        { line: 13, text: '  <span class="keyword">retornar</span> distancias' }
    ]
};

const floydWarshallPseudocodes = {
    standard: [
        { line: 1, text: '<span class="keyword">FloydWarshall</span>(grafo):' },
        { line: 2, text: '  dist ← matriz V×V inicializada con ∞' },
        { line: 3, text: '  <span class="keyword">para cada</span> nodo i: dist[i][i] ← 0' },
        { line: 4, text: '  <span class="keyword">para cada</span> arista (u, v, peso): dist[u][v] ← peso' },
        { line: 5, text: '  <span class="keyword">para</span> k de 0 a V-1:' },
        { line: 6, text: '    <span class="keyword">para</span> i de 0 a V-1:' },
        { line: 7, text: '      <span class="keyword">para</span> j de 0 a V-1:' },
        { line: 8, text: '        <span class="keyword">si</span> dist[i][k] + dist[k][j] < dist[i][j]:' },
        { line: 9, text: '          dist[i][j] ← dist[i][k] + dist[k][j]' },
        { line: 10, text: '  <span class="keyword">retornar</span> dist' }
    ],
    'path-reconstruction': [
        { line: 1, text: '<span class="keyword">FloydWarshall_Caminos</span>(grafo):' },
        { line: 2, text: '  dist ← matriz V×V con ∞, next ← matriz V×V con null' },
        { line: 3, text: '  <span class="keyword">para cada</span> nodo i: dist[i][i] ← 0' },
        { line: 4, text: '  <span class="keyword">para cada</span> arista (u, v, peso):' },
        { line: 5, text: '    dist[u][v] ← peso, next[u][v] ← v' },
        { line: 6, text: '  <span class="keyword">para</span> k de 0 a V-1:' },
        { line: 7, text: '    <span class="keyword">para</span> i de 0 a V-1:' },
        { line: 8, text: '      <span class="keyword">para</span> j de 0 a V-1:' },
        { line: 9, text: '        <span class="keyword">si</span> dist[i][k] + dist[k][j] < dist[i][j]:' },
        { line: 10, text: '          dist[i][j] ← dist[i][k] + dist[k][j]' },
        { line: 11, text: '          next[i][j] ← next[i][k]' },
        { line: 12, text: '  <span class="keyword">retornar</span> dist, next' }
    ],
    'transitive-closure': [
        { line: 1, text: '<span class="keyword">ClausuraTransitiva</span>(grafo):' },
        { line: 2, text: '  alcanzable ← matriz booleana V×V (false)' },
        { line: 3, text: '  <span class="keyword">para cada</span> nodo i: alcanzable[i][i] ← true' },
        { line: 4, text: '  <span class="keyword">para cada</span> arista (u, v): alcanzable[u][v] ← true' },
        { line: 5, text: '  <span class="keyword">para</span> k de 0 a V-1:' },
        { line: 6, text: '    <span class="keyword">para</span> i de 0 a V-1:' },
        { line: 7, text: '      <span class="keyword">para</span> j de 0 a V-1:' },
        { line: 8, text: '        alcanzable[i][j] ← alcanzable[i][j] <span class="keyword">OR</span>' },
        { line: 9, text: '                          (alcanzable[i][k] <span class="keyword">AND</span> alcanzable[k][j])' },
        { line: 10, text: '  <span class="keyword">retornar</span> alcanzable' }
    ]
};

// ============================================
// INICIALIZACIÓN DEL GRAFO
// ============================================

function initGraph() {
    // Limpiar contenedor previo
    d3.select('#graph-container').html('');

    svg = d3.select('#graph-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Crear grupo para las aristas
    const linkGroup = svg.append('g').attr('class', 'links');

    // Crear grupo para los nodos
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    // Dibujar aristas con pesos
    const links = linkGroup.selectAll('g')
        .data(graphData.links)
        .enter()
        .append('g');

    links.append('line')
        .attr('class', 'link')
        .attr('x1', d => graphData.nodes.find(n => n.id === d.source).x)
        .attr('y1', d => graphData.nodes.find(n => n.id === d.source).y)
        .attr('x2', d => graphData.nodes.find(n => n.id === d.target).x)
        .attr('y2', d => graphData.nodes.find(n => n.id === d.target).y)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2);

    // Etiquetas de peso en las aristas
    links.append('text')
        .attr('class', 'weight-label')
        .attr('x', d => {
            const source = graphData.nodes.find(n => n.id === d.source);
            const target = graphData.nodes.find(n => n.id === d.target);
            return (source.x + target.x) / 2;
        })
        .attr('y', d => {
            const source = graphData.nodes.find(n => n.id === d.source);
            const target = graphData.nodes.find(n => n.id === d.target);
            return (source.y + target.y) / 2;
        })
        .attr('dy', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#666')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(d => d.weight);

    // Dibujar nodos
    const nodes = nodeGroup.selectAll('g')
        .data(graphData.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

    nodes.append('circle')
        .attr('r', 25)
        .attr('fill', '#f0f0f0')
        .attr('stroke', '#999')
        .attr('stroke-width', 2);

    nodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .text(d => d.id);

    resetGraph();
}

// ============================================
// SELECCIÓN DE ALGORITMO Y VARIANTES
// ============================================

function selectAlgorithm(algorithm) {
    currentAlgorithm = algorithm;

    // Actualizar botones de algoritmo
    document.querySelectorAll('.algo-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.algo-btn').classList.add('active');

    // Mostrar/ocultar paneles de variantes
    document.getElementById('dijkstraVariantPanel').classList.toggle('hidden', algorithm !== 'dijkstra');
    document.getElementById('bellmanFordVariantPanel').classList.toggle('hidden', algorithm !== 'bellman-ford');
    document.getElementById('floydWarshallVariantPanel').classList.toggle('hidden', algorithm !== 'floyd-warshall');

    // Actualizar leyenda según algoritmo
    const legendQueued = document.getElementById('legendQueued');
    const legendQueuedText = document.getElementById('legendQueuedText');
    const structureType = document.getElementById('structureType');
    const structureIndicator = document.getElementById('structureIndicator');

    if (algorithm === 'dijkstra') {
        legendQueued.className = 'legend-dot queued';
        legendQueuedText.textContent = 'En cola';
        structureType.textContent = 'Cola de Prioridad';
        structureType.className = 'structure-type bfs-type';
        structureIndicator.textContent = 'Min-Heap';
        selectDijkstraVariant('standard');
    } else if (algorithm === 'bellman-ford') {
        legendQueued.className = 'legend-dot queued-dfs';
        legendQueuedText.textContent = 'En proceso';
        structureType.textContent = 'Relajación';
        structureType.className = 'structure-type dfs-type';
        structureIndicator.textContent = 'Iteración';
        selectBellmanFordVariant('standard');
    } else if (algorithm === 'floyd-warshall') {
        legendQueued.className = 'legend-dot queued-dfs';
        legendQueuedText.textContent = 'En proceso';
        structureType.textContent = 'Matriz';
        structureType.className = 'structure-type dfs-type';
        structureIndicator.textContent = 'DP';
        selectFloydWarshallVariant('standard');
    }

    resetGraph();
}

function selectDijkstraVariant(variant) {
    currentVariant = variant;

    // Actualizar botones de variantes
    document.querySelectorAll('#dijkstraVariantPanel .variant-btn-h').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Actualizar pseudocódigo
    updatePseudocode(dijkstraPseudocodes[variant]);

    // Actualizar explicación
    const explanation = dijkstraExplanations[variant];
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

function selectBellmanFordVariant(variant) {
    currentVariant = variant;

    // Actualizar botones de variantes
    document.querySelectorAll('#bellmanFordVariantPanel .variant-btn-h-dfs').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Actualizar pseudocódigo
    updatePseudocode(bellmanFordPseudocodes[variant]);

    // Actualizar explicación
    const explanation = bellmanFordExplanations[variant];
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

function selectFloydWarshallVariant(variant) {
    currentVariant = variant;

    // Actualizar botones de variantes
    document.querySelectorAll('#floydWarshallVariantPanel .variant-btn-h-dfs').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Actualizar pseudocódigo
    updatePseudocode(floydWarshallPseudocodes[variant]);

    // Actualizar explicación
    const explanation = floydWarshallExplanations[variant];
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

function updatePseudocode(pseudocodeLines) {
    const pseudocodeDiv = document.getElementById('pseudocode');
    pseudocodeDiv.innerHTML = pseudocodeLines.map(line =>
        `<div class="line" data-line="${line.line}">${line.text}</div>`
    ).join('');
}

// ============================================
// IMPLEMENTACIÓN DE ALGORITMOS
// ============================================

function dijkstraStandard(start = 'A') {
    const distances = {};
    const visited = new Set();
    const pq = [{ node: start, dist: 0 }];
    const steps = [];

    // Inicializar distancias
    graphData.nodes.forEach(node => {
        distances[node.id] = node.id === start ? 0 : Infinity;
    });

    steps.push({
        action: 'init',
        node: start,
        distances: { ...distances },
        queue: [...pq],
        visited: new Set(),
        message: `Inicializar: distancia[${start}] = 0`
    });

    while (pq.length > 0) {
        // Extraer nodo con menor distancia
        pq.sort((a, b) => a.dist - b.dist);
        const { node: current, dist: currentDist } = pq.shift();

        if (visited.has(current)) continue;

        steps.push({
            action: 'visit',
            node: current,
            distances: { ...distances },
            queue: [...pq],
            visited: new Set(visited),
            currentNode: current,
            message: `Visitar ${current} con distancia ${currentDist}`
        });

        visited.add(current);

        // Relajar aristas
        const neighbors = graphData.links.filter(link => link.source === current);

        neighbors.forEach(link => {
            const neighbor = link.target;
            const newDist = distances[current] + link.weight;

            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                pq.push({ node: neighbor, dist: newDist });

                steps.push({
                    action: 'relax',
                    node: neighbor,
                    from: current,
                    distances: { ...distances },
                    queue: [...pq],
                    visited: new Set(visited),
                    currentNode: current,
                    message: `Relajar: distancia[${neighbor}] = ${newDist} (desde ${current})`
                });
            }
        });
    }

    return steps;
}

function bellmanFordStandard(start = 'A') {
    const distances = {};
    const steps = [];
    const V = graphData.nodes.length;

    // Inicializar distancias
    graphData.nodes.forEach(node => {
        distances[node.id] = node.id === start ? 0 : Infinity;
    });

    steps.push({
        action: 'init',
        distances: { ...distances },
        iteration: 0,
        message: `Inicializar: distancia[${start}] = 0`
    });

    // Relajar todas las aristas V-1 veces
    for (let i = 0; i < V - 1; i++) {
        let updated = false;

        graphData.links.forEach(link => {
            const u = link.source;
            const v = link.target;
            const weight = link.weight;

            if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                distances[v] = distances[u] + weight;
                updated = true;

                steps.push({
                    action: 'relax',
                    from: u,
                    to: v,
                    distances: { ...distances },
                    iteration: i + 1,
                    message: `Iteración ${i + 1}: Relajar ${u}→${v}, distancia[${v}] = ${distances[v]}`
                });
            }
        });

        if (!updated) break;
    }

    return steps;
}

function floydWarshallStandard() {
    const nodes = graphData.nodes.map(n => n.id);
    const V = nodes.length;
    const dist = {};
    const steps = [];

    // Inicializar matriz de distancias
    nodes.forEach(i => {
        dist[i] = {};
        nodes.forEach(j => {
            dist[i][j] = i === j ? 0 : Infinity;
        });
    });

    // Llenar con pesos de aristas
    graphData.links.forEach(link => {
        dist[link.source][link.target] = link.weight;
    });

    steps.push({
        action: 'init',
        dist: JSON.parse(JSON.stringify(dist)),
        message: 'Inicializar matriz de distancias'
    });

    // Algoritmo Floyd-Warshall
    nodes.forEach((k, kIndex) => {
        nodes.forEach((i, iIndex) => {
            nodes.forEach((j, jIndex) => {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];

                    steps.push({
                        action: 'update',
                        i, j, k,
                        dist: JSON.parse(JSON.stringify(dist)),
                        message: `Actualizar: dist[${i}][${j}] = ${dist[i][j]} (via ${k})`
                    });
                }
            });
        });
    });

    return steps;
}

// ============================================
// CONTROL DE ANIMACIÓN
// ============================================

function startSearch() {
    if (isAnimating) return;

    // Generar pasos según algoritmo y variante
    if (currentAlgorithm === 'dijkstra') {
        steps = dijkstraStandard();
    } else if (currentAlgorithm === 'bellman-ford') {
        steps = bellmanFordStandard();
    } else if (currentAlgorithm === 'floyd-warshall') {
        steps = floydWarshallStandard();
    }

    document.getElementById('totalSteps').textContent = steps.length;
    currentStep = 0;
    isAnimating = true;

    animateStep();
}

function stepSearch() {
    if (steps.length === 0) {
        if (currentAlgorithm === 'dijkstra') {
            steps = dijkstraStandard();
        } else if (currentAlgorithm === 'bellman-ford') {
            steps = bellmanFordStandard();
        } else if (currentAlgorithm === 'floyd-warshall') {
            steps = floydWarshallStandard();
        }
        document.getElementById('totalSteps').textContent = steps.length;
    }

    if (currentStep < steps.length) {
        executeStep(steps[currentStep]);
        currentStep++;
        document.getElementById('stepNumber').textContent = currentStep;
    }
}

function animateStep() {
    if (!isAnimating || currentStep >= steps.length) {
        isAnimating = false;
        return;
    }

    executeStep(steps[currentStep]);
    currentStep++;
    document.getElementById('stepNumber').textContent = currentStep;

    setTimeout(() => animateStep(), 2100 - animationSpeed);
}

function executeStep(step) {
    // Actualizar visualización del grafo según el paso
    const nodes = svg.selectAll('.node circle');

    if (step.action === 'init') {
        nodes.attr('fill', '#f0f0f0');
        if (step.node) {
            nodes.filter(d => d.id === step.node)
                .attr('fill', currentAlgorithm === 'dijkstra' ? '#49B9CE' : '#8A7AAF');
        }
    } else if (step.action === 'visit' || step.action === 'relax') {
        nodes.attr('fill', d => {
            if (step.visited && step.visited.has(d.id)) return '#90EE90';
            if (d.id === step.currentNode || d.id === step.node) {
                return currentAlgorithm === 'dijkstra' ? '#FFD700' : '#DDA0DD';
            }
            if (step.queue && step.queue.some(q => q.node === d.id)) {
                return currentAlgorithm === 'dijkstra' ? '#87CEEB' : '#D8BFD8';
            }
            return '#f0f0f0';
        });
    }

    // Actualizar orden de visita
    if (step.action === 'visit' && step.node) {
        const visitOrder = document.getElementById('visitOrder');
        const nodeSpan = document.createElement('span');
        nodeSpan.className = 'visit-node';
        nodeSpan.textContent = step.node;
        visitOrder.appendChild(nodeSpan);
    }

    // Actualizar estructura de datos
    updateStructureDisplay(step);
}

function updateStructureDisplay(step) {
    const structureItems = document.getElementById('structureItems');

    if (currentAlgorithm === 'dijkstra' && step.queue) {
        structureItems.innerHTML = step.queue
            .map(item => `<span class="structure-item bfs-item">${item.node}(${item.dist})</span>`)
            .join('');
    } else if (currentAlgorithm === 'bellman-ford') {
        structureItems.innerHTML = `<span class="structure-item dfs-item">Iteración ${step.iteration || 0}</span>`;
    } else if (currentAlgorithm === 'floyd-warshall') {
        structureItems.innerHTML = `<span class="structure-item dfs-item">Matriz DP</span>`;
    }
}

function resetGraph() {
    isAnimating = false;
    currentStep = 0;
    steps = [];

    document.getElementById('stepNumber').textContent = '0';
    document.getElementById('totalSteps').textContent = '0';
    document.getElementById('visitOrder').innerHTML = '';
    document.getElementById('structureItems').innerHTML = '';

    if (svg) {
        svg.selectAll('.node circle')
            .attr('fill', '#f0f0f0');

        svg.selectAll('.link')
            .attr('stroke', '#ccc')
            .attr('stroke-width', 2);
    }
}

function updateSpeed() {
    animationSpeed = parseInt(document.getElementById('speedSlider').value);
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initGraph();
    selectAlgorithm('dijkstra');
});
