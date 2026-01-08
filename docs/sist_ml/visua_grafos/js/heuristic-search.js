// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================

const width = 1000;
const height = 500;
let svg, simulation, nodesGroup, linksGroup;

// Estado global
let currentAlgorithm = 'astar';
let currentVariant = 'manhattan';
let animationSpeed = 800;
let isAnimating = false;
let currentStep = 0;
let steps = [];
let startNode = 'A';
let goalNode = 'H';

// Datos del grafo con coordenadas para heurística
const graphData = {
    nodes: [
        { id: 'A', x: 100, y: 250, coords: { x: 0, y: 5 } },   // Inicio
        { id: 'B', x: 200, y: 150, coords: { x: 2, y: 2 } },
        { id: 'C', x: 200, y: 350, coords: { x: 2, y: 8 } },
        { id: 'D', x: 350, y: 100, coords: { x: 5, y: 1 } },
        { id: 'E', x: 350, y: 250, coords: { x: 5, y: 5 } },
        { id: 'F', x: 350, y: 400, coords: { x: 5, y: 9 } },
        { id: 'G', x: 550, y: 200, coords: { x: 8, y: 3 } },
        { id: 'H', x: 700, y: 250, coords: { x: 10, y: 5 } },  // Meta
        { id: 'I', x: 550, y: 350, coords: { x: 8, y: 8 } }
    ],
    links: [
        { source: 'A', target: 'B', weight: 3 },
        { source: 'A', target: 'C', weight: 5 },
        { source: 'B', target: 'D', weight: 4 },
        { source: 'B', target: 'E', weight: 3 },
        { source: 'C', target: 'E', weight: 2 },
        { source: 'C', target: 'F', weight: 4 },
        { source: 'D', target: 'G', weight: 5 },
        { source: 'E', target: 'G', weight: 4 },
        { source: 'E', target: 'I', weight: 3 },
        { source: 'F', target: 'I', weight: 3 },
        { source: 'G', target: 'H', weight: 2 },
        { source: 'I', target: 'H', weight: 4 }
    ]
};

// ============================================
// FUNCIONES HEURÍSTICAS
// ============================================

function manhattanDistance(nodeId, goalId) {
    const node = graphData.nodes.find(n => n.id === nodeId);
    const goal = graphData.nodes.find(n => n.id === goalId);
    return Math.abs(node.coords.x - goal.coords.x) + Math.abs(node.coords.y - goal.coords.y);
}

function euclideanDistance(nodeId, goalId) {
    const node = graphData.nodes.find(n => n.id === nodeId);
    const goal = graphData.nodes.find(n => n.id === goalId);
    const dx = node.coords.x - goal.coords.x;
    const dy = node.coords.y - goal.coords.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function chebyshevDistance(nodeId, goalId) {
    const node = graphData.nodes.find(n => n.id === nodeId);
    const goal = graphData.nodes.find(n => n.id === goalId);
    return Math.max(Math.abs(node.coords.x - goal.coords.x), Math.abs(node.coords.y - goal.coords.y));
}

function getHeuristic(nodeId, goalId, variant = currentVariant) {
    switch (variant) {
        case 'manhattan':
        case 'standard':
            return manhattanDistance(nodeId, goalId);
        case 'euclidean':
            return euclideanDistance(nodeId, goalId);
        case 'chebyshev':
            return chebyshevDistance(nodeId, goalId);
        case 'weighted':
            return 1.5 * manhattanDistance(nodeId, goalId); // w = 1.5
        default:
            return manhattanDistance(nodeId, goalId);
    }
}

// ============================================
// EXPLICACIONES POR ALGORITMO Y VARIANTE
// ============================================

const astarExplanations = {
    manhattan: {
        title: 'A* con Heurística Manhattan',
        description: 'Algoritmo de búsqueda informada que encuentra el camino más corto usando una función de evaluación f(n) = g(n) + h(n).',
        points: [
            '<strong>g(n):</strong> Costo real desde el inicio hasta el nodo n',
            '<strong>h(n):</strong> Estimación heurística desde n hasta la meta (distancia Manhattan)',
            '<strong>f(n):</strong> Costo total estimado del mejor camino que pasa por n',
            '<strong>Optimalidad:</strong> Garantiza camino óptimo si h es admisible (nunca sobreestima)',
            '<strong>Complejidad:</strong> O(b^d) tiempo y espacio, pero mucho más eficiente que Dijkstra'
        ]
    },
    euclidean: {
        title: 'A* con Heurística Euclidiana',
        description: 'Usa la distancia en línea recta (euclidiana) como estimación. Ideal para movimiento libre en cualquier dirección.',
        points: [
            '<strong>Heurística:</strong> h(n) = √((x₁-x₂)² + (y₁-y₂)²)',
            '<strong>Admisible:</strong> Nunca sobreestima para movimiento libre',
            '<strong>Aplicación:</strong> Robots móviles, drones, personajes en espacios abiertos',
            '<strong>Ventaja:</strong> Mejor guía que Manhattan para movimiento omnidireccional'
        ]
    },
    chebyshev: {
        title: 'A* con Heurística Chebyshev',
        description: 'Usa la distancia Chebyshev, óptima para movimiento en 8 direcciones (incluyendo diagonales).',
        points: [
            '<strong>Heurística:</strong> h(n) = max(|x₁-x₂|, |y₁-y₂|)',
            '<strong>Admisible:</strong> Para movimiento en 8 direcciones con mismo costo',
            '<strong>Aplicación:</strong> Juegos de estrategia, tableros de ajedrez',
            '<strong>Característica:</strong> Refleja el movimiento del rey en ajedrez'
        ]
    },
    weighted: {
        title: 'A* Ponderado (Weighted A*)',
        description: 'Multiplica la heurística por un factor w > 1. Sacrifica optimalidad por velocidad de búsqueda.',
        points: [
            '<strong>Función:</strong> f(n) = g(n) + w×h(n), donde w = 1.5',
            '<strong>Efecto:</strong> Sesga la búsqueda hacia la meta más agresivamente',
            '<strong>Garantía:</strong> Solución es a lo sumo w veces peor que la óptima',
            '<strong>Aplicación:</strong> Videojuegos en tiempo real, sistemas con limitaciones de tiempo',
            '<strong>Trade-off:</strong> Más rápido pero menos óptimo que A* estándar'
        ]
    }
};

const greedyExplanations = {
    standard: {
        title: 'Greedy Best-First Search Estándar',
        description: 'Búsqueda voraz que siempre expande el nodo que parece más cercano a la meta según h(n).',
        points: [
            '<strong>Función:</strong> Solo usa h(n), ignora g(n) completamente',
            '<strong>Estrategia:</strong> Siempre elige el nodo con menor h(n)',
            '<strong>Velocidad:</strong> Muy rápido, a menudo encuentra solución rápidamente',
            '<strong>Limitación:</strong> No garantiza optimalidad ni completitud',
            '<strong>Aplicación:</strong> Soluciones rápidas donde calidad no es crítica'
        ]
    },
    beam: {
        title: 'Beam Search',
        description: 'Variante que mantiene solo los k mejores nodos en memoria para reducir uso de espacio.',
        points: [
            '<strong>Estrategia:</strong> Solo mantiene k nodos con menor h(n) en cada nivel',
            '<strong>Parámetro:</strong> Beam width k (típicamente k=2 o k=3)',
            '<strong>Ventaja:</strong> Uso de memoria O(k×d) en lugar de O(b^d)',
            '<strong>Aplicación:</strong> Sistemas con memoria muy limitada',
            '<strong>Trade-off:</strong> Puede perder la solución óptima por descartar nodos'
        ]
    },
    'hill-climbing': {
        title: 'Hill Climbing',
        description: 'Búsqueda local que solo expande el mejor vecino inmediato, sin backtracking.',
        points: [
            '<strong>Estrategia:</strong> Solo expande el vecino con mejor h(n)',
            '<strong>Memoria:</strong> O(1) - solo almacena el nodo actual',
            '<strong>Problema:</strong> Puede quedarse atascado en máximos locales',
            '<strong>Aplicación:</strong> Optimización local, problemas de satisfacción',
            '<strong>Variantes:</strong> Steepest ascent, random restart, simulated annealing'
        ]
    }
};

const idasExplanations = {
    standard: {
        title: 'IDA* Estándar',
        description: 'Combina A* con profundización iterativa. Realiza DFS con límite f creciente.',
        points: [
            '<strong>Estrategia:</strong> DFS con corte cuando f(n) > límite',
            '<strong>Memoria:</strong> O(d) en lugar de O(b^d) de A*',
            '<strong>Completitud:</strong> Sí, si h es admisible',
            '<strong>Optimalidad:</strong> Sí, si h es admisible y consistente',
            '<strong>Trade-off:</strong> Reexpande nodos, pero usa mucha menos memoria'
        ]
    },
    rbfs: {
        title: 'RBFS (Recursive Best-First Search)',
        description: 'Variante recursiva que rastrea el segundo mejor valor f para decidir cuándo retroceder.',
        points: [
            '<strong>Idea clave:</strong> Almacena f del segundo mejor hijo para backtracking',
            '<strong>Memoria:</strong> O(d) espacio lineal',
            '<strong>Ventaja:</strong> Menos reexpansiones que IDA*',
            '<strong>Funcionamiento:</strong> Retrocede cuando f actual > f alternativo',
            '<strong>Aplicación:</strong> Alternativa más eficiente a IDA* en muchos casos'
        ]
    },
    sma: {
        title: 'SMA* (Simplified Memory-bounded A*)',
        description: 'Versión de A* que opera con memoria limitada, olvidando nodos peores cuando se llena.',
        points: [
            '<strong>Estrategia:</strong> Usa toda la memoria disponible',
            '<strong>Cuando se llena:</strong> Descarta nodo con peor f(n)',
            '<strong>Respaldo:</strong> Guarda f del hijo olvidado en el padre',
            '<strong>Regeneración:</strong> Puede regenerar nodos si son necesarios',
            '<strong>Aplicación:</strong> Cuando hay límite estricto de memoria conocido'
        ]
    }
};

// ============================================
// PSEUDOCÓDIGO
// ============================================

const astarPseudocodes = {
    manhattan: [
        { line: 1, text: '<span class="keyword">A*</span>(inicio, meta, h):' },
        { line: 2, text: '  abierta ← Cola_Prioridad([inicio])' },
        { line: 3, text: '  cerrada ← {}, g[inicio] ← 0' },
        { line: 4, text: '  f[inicio] ← g[inicio] + h(inicio)' },
        { line: 5, text: '  <span class="keyword">mientras</span> abierta no vacía:' },
        { line: 6, text: '    actual ← abierta.<span class="keyword">extraer_min_f()</span>' },
        { line: 7, text: '    <span class="keyword">si</span> actual == meta: <span class="keyword">retornar</span> reconstruir_camino()' },
        { line: 8, text: '    cerrada.<span class="keyword">añadir</span>(actual)' },
        { line: 9, text: '    <span class="keyword">para cada</span> vecino de actual:' },
        { line: 10, text: '      <span class="keyword">si</span> vecino en cerrada: <span class="keyword">continuar</span>' },
        { line: 11, text: '      g_temp ← g[actual] + costo(actual, vecino)' },
        { line: 12, text: '      <span class="keyword">si</span> vecino no en abierta o g_temp < g[vecino]:' },
        { line: 13, text: '        g[vecino] ← g_temp' },
        { line: 14, text: '        f[vecino] ← g[vecino] + h(vecino)' },
        { line: 15, text: '        abierta.<span class="keyword">insertar</span>(vecino, f[vecino])' }
    ],
    euclidean: [
        { line: 1, text: '<span class="keyword">A*_Euclidiana</span>(inicio, meta):' },
        { line: 2, text: '  h(n) ← √((x_n-x_meta)² + (y_n-y_meta)²)' },
        { line: 3, text: '  abierta ← Cola_Prioridad([inicio])' },
        { line: 4, text: '  g[inicio] ← 0, f[inicio] ← h(inicio)' },
        { line: 5, text: '  <span class="keyword">mientras</span> abierta no vacía:' },
        { line: 6, text: '    actual ← abierta.<span class="keyword">extraer_min_f()</span>' },
        { line: 7, text: '    <span class="keyword">si</span> actual == meta: <span class="keyword">retornar</span> éxito' },
        { line: 8, text: '    <span class="keyword">para cada</span> vecino:' },
        { line: 9, text: '      g_temp ← g[actual] + dist(actual, vecino)' },
        { line: 10, text: '      <span class="keyword">si</span> g_temp < g[vecino]:' },
        { line: 11, text: '        f[vecino] ← g_temp + h(vecino)' },
        { line: 12, text: '        abierta.<span class="keyword">actualizar</span>(vecino, f[vecino])' }
    ],
    chebyshev: [
        { line: 1, text: '<span class="keyword">A*_Chebyshev</span>(inicio, meta):' },
        { line: 2, text: '  h(n) ← max(|x_n-x_meta|, |y_n-y_meta|)' },
        { line: 3, text: '  abierta ← Cola_Prioridad([inicio])' },
        { line: 4, text: '  g[inicio] ← 0, f[inicio] ← h(inicio)' },
        { line: 5, text: '  <span class="keyword">mientras</span> abierta no vacía:' },
        { line: 6, text: '    actual ← abierta.<span class="keyword">extraer_min_f()</span>' },
        { line: 7, text: '    <span class="keyword">si</span> actual == meta: <span class="keyword">retornar</span> camino' },
        { line: 8, text: '    <span class="keyword">para cada</span> vecino:' },
        { line: 9, text: '      g_temp ← g[actual] + costo[actual][vecino]' },
        { line: 10, text: '      <span class="keyword">si</span> mejor que antes:' },
        { line: 11, text: '        f[vecino] ← g_temp + h_chebyshev(vecino)' }
    ],
    weighted: [
        { line: 1, text: '<span class="keyword">WA*</span>(inicio, meta, w):' },
        { line: 2, text: '  <span class="comment">// w > 1, típicamente w = 1.5 o 2.0</span>' },
        { line: 3, text: '  f[n] ← g[n] + w × h(n)' },
        { line: 4, text: '  abierta ← [(inicio, f[inicio])]' },
        { line: 5, text: '  <span class="keyword">mientras</span> abierta no vacía:' },
        { line: 6, text: '    actual ← abierta.<span class="keyword">extraer_min_f()</span>' },
        { line: 7, text: '    <span class="keyword">si</span> actual == meta: <span class="keyword">retornar</span> camino' },
        { line: 8, text: '    <span class="keyword">para cada</span> vecino:' },
        { line: 9, text: '      g[vecino] ← g[actual] + costo(actual, vecino)' },
        { line: 10, text: '      f[vecino] ← g[vecino] + w × h(vecino)' },
        { line: 11, text: '      abierta.<span class="keyword">insertar</span>(vecino)' }
    ]
};

const greedyPseudocodes = {
    standard: [
        { line: 1, text: '<span class="keyword dfs-keyword">Greedy_BFS</span>(inicio, meta):' },
        { line: 2, text: '  abierta ← Cola_Prioridad([inicio])' },
        { line: 3, text: '  cerrada ← {}' },
        { line: 4, text: '  <span class="keyword dfs-keyword">mientras</span> abierta no vacía:' },
        { line: 5, text: '    actual ← abierta.<span class="keyword dfs-keyword">extraer_min_h()</span>' },
        { line: 6, text: '    <span class="keyword dfs-keyword">si</span> actual == meta: <span class="keyword dfs-keyword">retornar</span> camino' },
        { line: 7, text: '    cerrada.<span class="keyword dfs-keyword">añadir</span>(actual)' },
        { line: 8, text: '    <span class="keyword dfs-keyword">para cada</span> vecino de actual:' },
        { line: 9, text: '      <span class="keyword dfs-keyword">si</span> vecino no en cerrada:' },
        { line: 10, text: '        abierta.<span class="keyword dfs-keyword">insertar</span>(vecino, h(vecino))' }
    ],
    beam: [
        { line: 1, text: '<span class="keyword dfs-keyword">Beam_Search</span>(inicio, meta, k):' },
        { line: 2, text: '  actual_nivel ← [inicio]' },
        { line: 3, text: '  <span class="keyword dfs-keyword">mientras</span> actual_nivel no vacío:' },
        { line: 4, text: '    <span class="keyword dfs-keyword">si</span> meta en actual_nivel: <span class="keyword dfs-keyword">retornar</span> éxito' },
        { line: 5, text: '    siguiente_nivel ← []' },
        { line: 6, text: '    <span class="keyword dfs-keyword">para cada</span> nodo en actual_nivel:' },
        { line: 7, text: '      siguiente_nivel.<span class="keyword dfs-keyword">añadir</span>(vecinos(nodo))' },
        { line: 8, text: '    <span class="comment">// Mantener solo k mejores</span>' },
        { line: 9, text: '    siguiente_nivel.<span class="keyword dfs-keyword">ordenar_por</span>(h)' },
        { line: 10, text: '    actual_nivel ← siguiente_nivel[:k]' }
    ],
    'hill-climbing': [
        { line: 1, text: '<span class="keyword dfs-keyword">Hill_Climbing</span>(inicio, meta):' },
        { line: 2, text: '  actual ← inicio' },
        { line: 3, text: '  <span class="keyword dfs-keyword">mientras</span> true:' },
        { line: 4, text: '    <span class="keyword dfs-keyword">si</span> actual == meta: <span class="keyword dfs-keyword">retornar</span> éxito' },
        { line: 5, text: '    vecinos ← expandir(actual)' },
        { line: 6, text: '    mejor ← vecino con menor h(n)' },
        { line: 7, text: '    <span class="keyword dfs-keyword">si</span> h(mejor) ≥ h(actual):' },
        { line: 8, text: '      <span class="keyword dfs-keyword">retornar</span> actual <span class="comment">// Máximo local</span>' },
        { line: 9, text: '    actual ← mejor' }
    ]
};

const idasPseudocodes = {
    standard: [
        { line: 1, text: '<span class="keyword dfs-keyword">IDA*</span>(inicio, meta):' },
        { line: 2, text: '  límite ← h(inicio)' },
        { line: 3, text: '  <span class="keyword dfs-keyword">mientras</span> true:' },
        { line: 4, text: '    resultado ← DFS_limitado(inicio, 0, límite)' },
        { line: 5, text: '    <span class="keyword dfs-keyword">si</span> resultado == ENCONTRADO: <span class="keyword dfs-keyword">retornar</span> camino' },
        { line: 6, text: '    <span class="keyword dfs-keyword">si</span> resultado == ∞: <span class="keyword dfs-keyword">retornar</span> FALLO' },
        { line: 7, text: '    límite ← resultado' },
        { line: 8, text: '<span class="keyword dfs-keyword">DFS_limitado</span>(nodo, g, límite):' },
        { line: 9, text: '  f ← g + h(nodo)' },
        { line: 10, text: '  <span class="keyword dfs-keyword">si</span> f > límite: <span class="keyword dfs-keyword">retornar</span> f' },
        { line: 11, text: '  <span class="keyword dfs-keyword">si</span> nodo == meta: <span class="keyword dfs-keyword">retornar</span> ENCONTRADO' },
        { line: 12, text: '  min ← ∞' },
        { line: 13, text: '  <span class="keyword dfs-keyword">para cada</span> vecino:' },
        { line: 14, text: '    t ← DFS_limitado(vecino, g+costo, límite)' },
        { line: 15, text: '    min ← min(min, t)' }
    ],
    rbfs: [
        { line: 1, text: '<span class="keyword dfs-keyword">RBFS</span>(inicio, meta):' },
        { line: 2, text: '  <span class="keyword dfs-keyword">retornar</span> RBFS_recursivo(inicio, ∞)' },
        { line: 3, text: '<span class="keyword dfs-keyword">RBFS_recursivo</span>(nodo, f_límite):' },
        { line: 4, text: '  <span class="keyword dfs-keyword">si</span> nodo == meta: <span class="keyword dfs-keyword">retornar</span> (éxito, f)' },
        { line: 5, text: '  sucesores ← expandir(nodo)' },
        { line: 6, text: '  <span class="keyword dfs-keyword">para cada</span> s en sucesores:' },
        { line: 7, text: '    f[s] ← max(g[s] + h[s], f[nodo])' },
        { line: 8, text: '  <span class="keyword dfs-keyword">mientras</span> true:' },
        { line: 9, text: '    mejor ← sucesor con menor f[s]' },
        { line: 10, text: '    <span class="keyword dfs-keyword">si</span> f[mejor] > f_límite: <span class="keyword dfs-keyword">retornar</span> (fallo, f[mejor])' },
        { line: 11, text: '    alternativo ← segundo mejor f' },
        { line: 12, text: '    resultado ← RBFS_recursivo(mejor, min(f_límite, alternativo))' }
    ],
    sma: [
        { line: 1, text: '<span class="keyword dfs-keyword">SMA*</span>(inicio, meta, MAX_MEM):' },
        { line: 2, text: '  abierta ← [inicio]' },
        { line: 3, text: '  <span class="keyword dfs-keyword">mientras</span> true:' },
        { line: 4, text: '    <span class="keyword dfs-keyword">si</span> abierta vacía: <span class="keyword dfs-keyword">retornar</span> fallo' },
        { line: 5, text: '    <span class="keyword dfs-keyword">si</span> |abierta| > MAX_MEM:' },
        { line: 6, text: '      peor ← nodo con mayor f(n)' },
        { line: 7, text: '      guardar_f_en_padre(peor)' },
        { line: 8, text: '      abierta.<span class="keyword dfs-keyword">eliminar</span>(peor)' },
        { line: 9, text: '    mejor ← nodo con menor f(n)' },
        { line: 10, text: '    <span class="keyword dfs-keyword">si</span> mejor == meta: <span class="keyword dfs-keyword">retornar</span> camino' },
        { line: 11, text: '    expandir(mejor)' }
    ]
};

// ============================================
// INICIALIZACIÓN DEL GRAFO
// ============================================

function initGraph() {
    d3.select('#graph-container').html('');

    svg = d3.select('#graph-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Definir filtros y markers
    const defs = svg.append('defs');

    // Filtro de brillo para animaciones
    const glow = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

    glow.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');

    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Gradiente para camino óptimo
    const pathGradient = defs.append('linearGradient')
        .attr('id', 'pathGradient')
        .attr('gradientUnits', 'userSpaceOnUse');

    pathGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#49B9CE');

    pathGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#90EE90');

    // Grupo para aristas
    linksGroup = svg.append('g').attr('class', 'links');

    // Dibujar aristas con pesos
    const links = linksGroup.selectAll('g')
        .data(graphData.links)
        .enter()
        .append('g')
        .attr('class', 'link-group');

    links.append('line')
        .attr('class', 'link')
        .attr('x1', d => graphData.nodes.find(n => n.id === d.source).x)
        .attr('y1', d => graphData.nodes.find(n => n.id === d.source).y)
        .attr('x2', d => graphData.nodes.find(n => n.id === d.target).x)
        .attr('y2', d => graphData.nodes.find(n => n.id === d.target).y)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2)
        .attr('data-source', d => d.source)
        .attr('data-target', d => d.target);

    // Etiquetas de peso
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

    // Grupo para nodos
    nodesGroup = svg.append('g').attr('class', 'nodes');

    const nodes = nodesGroup.selectAll('g')
        .data(graphData.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .attr('data-id', d => d.id);

    nodes.append('circle')
        .attr('r', 30)
        .attr('fill', d => {
            if (d.id === startNode) return '#49B9CE';
            if (d.id === goalNode) return '#90EE90';
            return '#f0f0f0';
        })
        .attr('stroke', '#999')
        .attr('stroke-width', 2);

    nodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .text(d => d.id);

    // Mostrar valores heurísticos iniciales
    displayHeuristicValues();
    resetGraph();
}

function displayHeuristicValues() {
    const heuristicDiv = document.getElementById('heuristicValues');
    heuristicDiv.innerHTML = graphData.nodes.map(node => {
        const h = getHeuristic(node.id, goalNode);
        return `<span class="heuristic-item" style="padding: 0.25rem 0.5rem; margin: 0.2rem; background: #f0f9ff; border-radius: 4px; font-size: 0.75rem; font-family: 'Courier New', monospace;">
            ${node.id}: ${h.toFixed(1)}
        </span>`;
    }).join('');
}

// ============================================
// SELECCIÓN DE ALGORITMO Y VARIANTES
// ============================================

function selectAlgorithm(algorithm) {
    currentAlgorithm = algorithm;

    document.querySelectorAll('.algo-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.algo-btn').classList.add('active');

    document.getElementById('astarVariantPanel').classList.toggle('hidden', algorithm !== 'astar');
    document.getElementById('greedyVariantPanel').classList.toggle('hidden', algorithm !== 'greedy');
    document.getElementById('idastarVariantPanel').classList.toggle('hidden', algorithm !== 'idastar');

    const legendQueued = document.getElementById('legendQueued');
    const legendQueuedText = document.getElementById('legendQueuedText');
    const structureType = document.getElementById('structureType');
    const structureIndicator = document.getElementById('structureIndicator');

    if (algorithm === 'astar') {
        legendQueued.className = 'legend-dot queued';
        legendQueuedText.textContent = 'En cola abierta';
        structureType.textContent = 'Cola de Prioridad (f)';
        structureType.className = 'structure-type bfs-type';
        structureIndicator.textContent = 'Min f(n)';
        selectAStarVariant('manhattan');
    } else if (algorithm === 'greedy') {
        legendQueued.className = 'legend-dot queued-dfs';
        legendQueuedText.textContent = 'En cola';
        structureType.textContent = 'Cola de Prioridad (h)';
        structureType.className = 'structure-type dfs-type';
        structureIndicator.textContent = 'Min h(n)';
        selectGreedyVariant('standard');
    } else if (algorithm === 'idastar') {
        legendQueued.className = 'legend-dot queued-dfs';
        legendQueuedText.textContent = 'En exploración';
        structureType.textContent = 'DFS con límite f';
        structureType.className = 'structure-type dfs-type';
        structureIndicator.textContent = 'Iterativo';
        selectIDAStarVariant('standard');
    }

    displayHeuristicValues();
    resetGraph();
}

function selectAStarVariant(variant) {
    currentVariant = variant;

    document.querySelectorAll('#astarVariantPanel .variant-btn-h').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    updatePseudocode(astarPseudocodes[variant]);

    const explanation = astarExplanations[variant];
    const algorithmExplanation = document.getElementById('algorithmExplanation');
    algorithmExplanation.className = 'algorithm-explanation';
    algorithmExplanation.innerHTML = `
        <h4>${explanation.title}</h4>
        <p>${explanation.description}</p>
        <ul>
            ${explanation.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
    `;

    displayHeuristicValues();
    resetGraph();
}

function selectGreedyVariant(variant) {
    currentVariant = variant;

    document.querySelectorAll('#greedyVariantPanel .variant-btn-h-dfs').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    updatePseudocode(greedyPseudocodes[variant]);

    const explanation = greedyExplanations[variant];
    const algorithmExplanation = document.getElementById('algorithmExplanation');
    algorithmExplanation.className = 'algorithm-explanation dfs-variant';
    algorithmExplanation.innerHTML = `
        <h4 class="dfs-active">${explanation.title}</h4>
        <p>${explanation.description}</p>
        <ul>
            ${explanation.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
    `;

    displayHeuristicValues();
    resetGraph();
}

function selectIDAStarVariant(variant) {
    currentVariant = variant;

    document.querySelectorAll('#idastarVariantPanel .variant-btn-h-dfs').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    updatePseudocode(idasPseudocodes[variant]);

    const explanation = idasExplanations[variant];
    const algorithmExplanation = document.getElementById('algorithmExplanation');
    algorithmExplanation.className = 'algorithm-explanation dfs-variant';
    algorithmExplanation.innerHTML = `
        <h4 class="dfs-active">${explanation.title}</h4>
        <p>${explanation.description}</p>
        <ul>
            ${explanation.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
    `;

    displayHeuristicValues();
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

function astarSearch() {
    const openSet = [{ node: startNode, g: 0, h: getHeuristic(startNode, goalNode), f: getHeuristic(startNode, goalNode), parent: null }];
    const closedSet = new Set();
    const gScore = {};
    const fScore = {};
    const parent = {};
    const steps = [];

    graphData.nodes.forEach(n => {
        gScore[n.id] = Infinity;
        fScore[n.id] = Infinity;
    });

    gScore[startNode] = 0;
    fScore[startNode] = getHeuristic(startNode, goalNode);

    steps.push({
        action: 'init',
        node: startNode,
        openSet: [...openSet],
        closedSet: new Set(),
        g: gScore[startNode],
        h: getHeuristic(startNode, goalNode),
        f: fScore[startNode],
        message: `Inicializar: f(${startNode}) = ${fScore[startNode].toFixed(1)}`
    });

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();

        if (current.node === goalNode) {
            steps.push({
                action: 'goal',
                node: current.node,
                openSet: [...openSet],
                closedSet: new Set(closedSet),
                path: reconstructPath(parent, current.node),
                message: `¡Meta alcanzada! Costo total: ${current.g.toFixed(1)}`
            });
            break;
        }

        closedSet.add(current.node);

        steps.push({
            action: 'visit',
            node: current.node,
            openSet: [...openSet],
            closedSet: new Set(closedSet),
            currentNode: current.node,
            g: current.g,
            h: current.h,
            f: current.f,
            message: `Visitar ${current.node}: g=${current.g.toFixed(1)}, h=${current.h.toFixed(1)}, f=${current.f.toFixed(1)}`
        });

        const neighbors = graphData.links
            .filter(link => link.source === current.node || link.target === current.node)
            .map(link => ({
                node: link.source === current.node ? link.target : link.source,
                cost: link.weight
            }));

        for (const neighbor of neighbors) {
            if (closedSet.has(neighbor.node)) continue;

            const tentativeG = gScore[current.node] + neighbor.cost;

            if (tentativeG < gScore[neighbor.node]) {
                parent[neighbor.node] = current.node;
                gScore[neighbor.node] = tentativeG;
                const h = getHeuristic(neighbor.node, goalNode);
                fScore[neighbor.node] = tentativeG + h;

                const existingIndex = openSet.findIndex(item => item.node === neighbor.node);
                const newItem = {
                    node: neighbor.node,
                    g: tentativeG,
                    h: h,
                    f: fScore[neighbor.node],
                    parent: current.node
                };

                if (existingIndex === -1) {
                    openSet.push(newItem);
                } else {
                    openSet[existingIndex] = newItem;
                }

                steps.push({
                    action: 'update',
                    node: neighbor.node,
                    from: current.node,
                    openSet: [...openSet],
                    closedSet: new Set(closedSet),
                    currentNode: current.node,
                    g: tentativeG,
                    h: h,
                    f: fScore[neighbor.node],
                    message: `Actualizar ${neighbor.node}: g=${tentativeG.toFixed(1)}, h=${h.toFixed(1)}, f=${fScore[neighbor.node].toFixed(1)}`
                });
            }
        }
    }

    return steps;
}

function greedySearch() {
    const openSet = [{ node: startNode, h: getHeuristic(startNode, goalNode), parent: null }];
    const closedSet = new Set();
    const parent = {};
    const steps = [];

    steps.push({
        action: 'init',
        node: startNode,
        openSet: [...openSet],
        closedSet: new Set(),
        h: getHeuristic(startNode, goalNode),
        message: `Iniciar desde ${startNode}: h=${getHeuristic(startNode, goalNode).toFixed(1)}`
    });

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.h - b.h);
        const current = openSet.shift();

        if (current.node === goalNode) {
            steps.push({
                action: 'goal',
                node: current.node,
                openSet: [...openSet],
                closedSet: new Set(closedSet),
                path: reconstructPath(parent, current.node),
                message: `¡Meta encontrada!`
            });
            break;
        }

        closedSet.add(current.node);

        steps.push({
            action: 'visit',
            node: current.node,
            openSet: [...openSet],
            closedSet: new Set(closedSet),
            currentNode: current.node,
            h: current.h,
            message: `Visitar ${current.node}: h=${current.h.toFixed(1)}`
        });

        const neighbors = graphData.links
            .filter(link => link.source === current.node || link.target === current.node)
            .map(link => link.source === current.node ? link.target : link.source)
            .filter(node => !closedSet.has(node));

        for (const neighbor of neighbors) {
            if (!openSet.find(item => item.node === neighbor)) {
                parent[neighbor] = current.node;
                const h = getHeuristic(neighbor, goalNode);

                openSet.push({
                    node: neighbor,
                    h: h,
                    parent: current.node
                });

                steps.push({
                    action: 'add',
                    node: neighbor,
                    from: current.node,
                    openSet: [...openSet],
                    closedSet: new Set(closedSet),
                    currentNode: current.node,
                    h: h,
                    message: `Añadir ${neighbor}: h=${h.toFixed(1)}`
                });
            }
        }
    }

    return steps;
}

function reconstructPath(parent, goal) {
    const path = [goal];
    let current = goal;

    while (parent[current]) {
        current = parent[current];
        path.unshift(current);
    }

    return path;
}

// ============================================
// CONTROL DE ANIMACIÓN
// ============================================

function startSearch() {
    if (isAnimating) return;

    if (currentAlgorithm === 'astar') {
        steps = astarSearch();
    } else if (currentAlgorithm === 'greedy') {
        steps = greedySearch();
    } else {
        steps = astarSearch(); // IDA* usa A* para demo
    }

    document.getElementById('totalSteps').textContent = steps.length;
    currentStep = 0;
    isAnimating = true;

    animateStep();
}

function stepSearch() {
    if (steps.length === 0) {
        if (currentAlgorithm === 'astar') {
            steps = astarSearch();
        } else if (currentAlgorithm === 'greedy') {
            steps = greedySearch();
        } else {
            steps = astarSearch();
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
    const nodes = svg.selectAll('.node circle');
    const links = svg.selectAll('.link');

    // Animar nodos
    nodes.transition()
        .duration(300)
        .attr('fill', d => {
            if (d.id === startNode) return '#49B9CE';
            if (d.id === goalNode) return '#90EE90';
            if (step.closedSet && step.closedSet.has(d.id)) return '#90EE90';
            if (d.id === step.currentNode || d.id === step.node) {
                return currentAlgorithm === 'astar' ? '#FFD700' : '#DDA0DD';
            }
            if (step.openSet && step.openSet.some(item => item.node === d.id)) {
                return currentAlgorithm === 'astar' ? '#87CEEB' : '#D8BFD8';
            }
            return '#f0f0f0';
        })
        .attr('r', d => {
            if (d.id === step.currentNode || d.id === step.node) return 35;
            return 30;
        })
        .attr('filter', d => {
            if (d.id === step.currentNode || d.id === step.node) return 'url(#glow)';
            return null;
        });

    // Resaltar camino si se encontró
    if (step.path) {
        links.transition()
            .duration(500)
            .attr('stroke', function(d) {
                const source = d.source;
                const target = d.target;
                for (let i = 0; i < step.path.length - 1; i++) {
                    if ((step.path[i] === source && step.path[i + 1] === target) ||
                        (step.path[i] === target && step.path[i + 1] === source)) {
                        return 'url(#pathGradient)';
                    }
                }
                return '#ccc';
            })
            .attr('stroke-width', function(d) {
                const source = d.source;
                const target = d.target;
                for (let i = 0; i < step.path.length - 1; i++) {
                    if ((step.path[i] === source && step.path[i + 1] === target) ||
                        (step.path[i] === target && step.path[i + 1] === source)) {
                        return 4;
                    }
                }
                return 2;
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

    if (currentAlgorithm === 'astar' && step.openSet) {
        structureItems.innerHTML = step.openSet
            .slice(0, 5)
            .map(item => `<span class="structure-item bfs-item">${item.node}(f=${item.f.toFixed(1)})</span>`)
            .join('');
    } else if (currentAlgorithm === 'greedy' && step.openSet) {
        structureItems.innerHTML = step.openSet
            .slice(0, 5)
            .map(item => `<span class="structure-item dfs-item">${item.node}(h=${item.h.toFixed(1)})</span>`)
            .join('');
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
            .transition()
            .duration(300)
            .attr('fill', d => {
                if (d.id === startNode) return '#49B9CE';
                if (d.id === goalNode) return '#90EE90';
                return '#f0f0f0';
            })
            .attr('r', 30)
            .attr('filter', null);

        svg.selectAll('.link')
            .transition()
            .duration(300)
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
    selectAlgorithm('astar');
});
