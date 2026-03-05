/**
 * CONTROLADOR DEL CUBO 3D OLAP - VERSIÓN 5x5x5 REAL
 * Gestiona 125 celdas en espacio 3D con operaciones OLAP verdaderas
 * iLERNA - Microsite Cubos OLAP
 */

class CuboOLAPController {
  constructor() {
    this.cuboWrapper = null;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotation = { x: -20, y: -30, z: 0 };
    this.autoRotate = false; // Deshabilitado por defecto para evitar conflictos
    this.dimensionActual = {
      tiempo: null,
      estudiante: null,
      asignatura: null
    };
    this.medidaActual = 'notaMedia';

    // Configuración del cubo 5x5x5
    this.cubeSize = 5;
    this.cellSize = 60; // Tamaño de cada celda en px
    this.cellGap = 5;   // Separación entre celdas
    this.totalSize = (this.cellSize + this.cellGap) * this.cubeSize;

    // Almacenar las 125 celdas
    this.cells = [];

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.cuboWrapper = document.getElementById('cubo-wrapper');
    if (!this.cuboWrapper) {
      console.error('No se encontró #cubo-wrapper');
      return;
    }

    this.crearCubo3D();
    this.setupEventListeners();
    this.actualizarInfoCubo();
  }

  /**
   * Crea el cubo 5x5x5 con 125 celdas posicionadas en 3D
   */
  crearCubo3D() {
    console.log('🎲 Creando cubo OLAP 5x5x5 (125 celdas)...');

    this.cuboWrapper.innerHTML = '';
    this.cells = [];

    const offset = this.totalSize / 2; // Centrar el cubo

    // Crear las 125 celdas (5 x 5 x 5)
    for (let z = 0; z < this.cubeSize; z++) {
      for (let y = 0; y < this.cubeSize; y++) {
        for (let x = 0; x < this.cubeSize; x++) {
          const celda = this.crearCelda(x, y, z, offset);
          this.cuboWrapper.appendChild(celda);
          this.cells.push(celda);
        }
      }
    }

    console.log(`✅ Cubo creado: ${this.cells.length} celdas`);
  }

  /**
   * Crea una celda individual en posición (x, y, z)
   */
  crearCelda(x, y, z, offset) {
    const celda = document.createElement('div');
    celda.className = 'celda-3d';
    celda.dataset.x = x;
    celda.dataset.y = y;
    celda.dataset.z = z;
    celda.dataset.index = x + y * this.cubeSize + z * this.cubeSize * this.cubeSize;

    // Posición en el espacio 3D
    const posX = x * (this.cellSize + this.cellGap) - offset;
    const posY = y * (this.cellSize + this.cellGap) - offset;
    const posZ = z * (this.cellSize + this.cellGap) - offset;

    celda.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px)`;

    // Generar valor aleatorio (nota entre 6.5 y 9.5)
    const nota = (Math.random() * 3 + 6.5).toFixed(1);
    celda.textContent = nota;
    celda.dataset.valor = nota;

    // Color según valor
    this.aplicarColorCelda(celda, parseFloat(nota));

    // Tooltip
    celda.title = `Posición: (${x}, ${y}, ${z})\nNota: ${nota}\nÍndice: ${celda.dataset.index}`;

    // Eventos
    celda.addEventListener('click', () => this.seleccionarCelda(celda));
    celda.addEventListener('mouseenter', () => this.highlightCelda(celda, true));
    celda.addEventListener('mouseleave', () => this.highlightCelda(celda, false));

    return celda;
  }

  aplicarColorCelda(celda, nota) {
    if (nota >= 9.0) {
      celda.style.background = 'rgba(46, 125, 50, 0.85)'; // Verde oscuro
      celda.dataset.color = 'excelente';
    } else if (nota >= 8.0) {
      celda.style.background = 'rgba(76, 175, 80, 0.8)'; // Verde claro
      celda.dataset.color = 'notable';
    } else if (nota >= 7.0) {
      celda.style.background = 'rgba(255, 193, 7, 0.8)'; // Amarillo
      celda.dataset.color = 'bien';
    } else {
      celda.style.background = 'rgba(244, 67, 54, 0.8)'; // Rojo
      celda.dataset.color = 'suficiente';
    }
  }

  highlightCelda(celda, highlight) {
    if (highlight) {
      celda.classList.add('hover-active');
    } else {
      celda.classList.remove('hover-active');
    }
  }

  seleccionarCelda(celda) {
    celda.classList.toggle('selected');
  }

  setupEventListeners() {
    const scene = document.querySelector('.cubo-scene');
    if (!scene) return;

    // Mouse events
    scene.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());

    // Touch events
    scene.addEventListener('touchstart', (e) => this.onTouchStart(e));
    document.addEventListener('touchmove', (e) => this.onTouchMove(e));
    document.addEventListener('touchend', () => this.onTouchEnd());

    scene.addEventListener('dragstart', (e) => e.preventDefault());

    this.setupControlButtons();
    this.setupDimensionSelectors();
  }

  setupControlButtons() {
    // Botón Reset
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetCubo());
    }

    // Botones de rotación
    const btnRotateX = document.getElementById('btn-rotate-x');
    if (btnRotateX) {
      btnRotateX.addEventListener('click', () => this.rotarEje('x'));
    }

    const btnRotateY = document.getElementById('btn-rotate-y');
    if (btnRotateY) {
      btnRotateY.addEventListener('click', () => this.rotarEje('y'));
    }

    const btnRotateZ = document.getElementById('btn-rotate-z');
    if (btnRotateZ) {
      btnRotateZ.addEventListener('click', () => this.rotarEje('z'));
    }

    // Botón Auto-rotar
    const btnAutoRotate = document.getElementById('btn-auto-rotate');
    if (btnAutoRotate) {
      btnAutoRotate.addEventListener('click', () => this.toggleAutoRotate());
    }

    // Botones de operaciones OLAP
    const btnSlice = document.getElementById('btn-slice');
    if (btnSlice) {
      btnSlice.addEventListener('click', () => this.operacionSlice());
    }

    const btnDice = document.getElementById('btn-dice');
    if (btnDice) {
      btnDice.addEventListener('click', () => this.operacionDice());
    }

    const btnDrillDown = document.getElementById('btn-drill-down');
    if (btnDrillDown) {
      btnDrillDown.addEventListener('click', () => this.operacionDrillDown());
    }

    const btnDrillUp = document.getElementById('btn-drill-up');
    if (btnDrillUp) {
      btnDrillUp.addEventListener('click', () => this.operacionDrillUp());
    }

    const btnPivot = document.getElementById('btn-pivot');
    if (btnPivot) {
      btnPivot.addEventListener('click', () => this.operacionPivot());
    }

    // Acordeón principal
    const toggleControls = document.getElementById('toggle-controls');
    const controlsContent = document.getElementById('controls-content');
    const toggleIcon = document.getElementById('toggle-icon');

    if (toggleControls && controlsContent && toggleIcon) {
      toggleControls.addEventListener('click', () => {
        controlsContent.classList.toggle('collapsed');
        toggleIcon.classList.toggle('collapsed');
      });
    }

    // Sub-acordeones
    const subAccordionHeaders = document.querySelectorAll('.sub-accordion-header');
    subAccordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const targetId = header.dataset.target;
        const content = document.getElementById(targetId);
        const icon = header.querySelector('.sub-toggle-icon');

        if (content && icon) {
          content.classList.toggle('collapsed');
          icon.classList.toggle('collapsed');
        }
      });
    });
  }

  setupDimensionSelectors() {
    // Selector Tiempo
    const selectTiempo = document.getElementById('select-tiempo');
    if (selectTiempo) {
      selectTiempo.addEventListener('change', (e) => {
        this.dimensionActual.tiempo = e.target.value;
        this.actualizarCubo();
      });
    }

    // Selector Estudiante
    const selectEstudiante = document.getElementById('select-estudiante');
    if (selectEstudiante) {
      selectEstudiante.addEventListener('change', (e) => {
        this.dimensionActual.estudiante = e.target.value;
        this.actualizarCubo();
      });
    }

    // Selector Asignatura
    const selectAsignatura = document.getElementById('select-asignatura');
    if (selectAsignatura) {
      selectAsignatura.addEventListener('change', (e) => {
        this.dimensionActual.asignatura = e.target.value;
        this.actualizarCubo();
      });
    }

    // Slider velocidad
    const sliderSpeed = document.getElementById('slider-speed');
    if (sliderSpeed) {
      sliderSpeed.addEventListener('input', (e) => {
        const speed = e.target.value;
        this.ajustarVelocidadRotacion(speed);
      });
    }
  }

  // ============================================
  // EVENTOS DE MOUSE
  // ============================================

  onMouseDown(e) {
    this.isDragging = true;
    this.autoRotate = false;
    this.previousMousePosition = {
      x: e.clientX,
      y: e.clientY
    };
  }

  onMouseMove(e) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;

    this.rotation.y += deltaX * 0.5;
    this.rotation.x -= deltaY * 0.5;

    this.actualizarRotacion();

    this.previousMousePosition = {
      x: e.clientX,
      y: e.clientY
    };
  }

  onMouseUp() {
    this.isDragging = false;
  }

  // ============================================
  // EVENTOS TOUCH
  // ============================================

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.autoRotate = false;
      this.previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  }

  onTouchMove(e) {
    if (!this.isDragging || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
    const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

    this.rotation.y += deltaX * 0.5;
    this.rotation.x -= deltaY * 0.5;

    this.actualizarRotacion();

    this.previousMousePosition = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };

    e.preventDefault();
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  // ============================================
  // ROTACIÓN Y TRANSFORMACIONES
  // ============================================

  actualizarRotacion() {
    if (!this.cuboWrapper) return;
    this.cuboWrapper.style.transform =
      `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg) rotateZ(${this.rotation.z}deg)`;
  }

  rotarEje(eje) {
    this.autoRotate = false;

    switch(eje) {
      case 'x':
        this.rotation.x += 90;
        break;
      case 'y':
        this.rotation.y += 90;
        break;
      case 'z':
        this.rotation.z += 90;
        break;
    }

    this.cuboWrapper.style.transition = 'transform 0.8s ease';
    this.actualizarRotacion();

    setTimeout(() => {
      this.cuboWrapper.style.transition = 'transform 0.3s ease';
    }, 800);
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;

    const btn = document.getElementById('btn-auto-rotate');
    if (btn) {
      btn.textContent = this.autoRotate ? '⏸️ Pausar' : '▶️ Auto-rotar';
    }

    if (this.autoRotate) {
      this.startAutoRotate();
    } else {
      this.stopAutoRotate();
    }
  }

  startAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }

    this.autoRotateInterval = setInterval(() => {
      if (this.autoRotate) {
        this.rotation.y += 0.5;
        this.actualizarRotacion();
      }
    }, 30);
  }

  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  ajustarVelocidadRotacion(speed) {
    // speed: 1 (lento) a 10 (rápido)
    const interval = 50 - (speed * 3); // 47ms a 20ms
    if (this.autoRotate) {
      this.stopAutoRotate();
      this.startAutoRotate();
    }
  }

  resetCubo() {
    this.rotation = { x: -20, y: -30, z: 0 };
    this.autoRotate = false;
    this.stopAutoRotate();

    this.cuboWrapper.style.transition = 'transform 0.8s ease';
    this.actualizarRotacion();

    // Resetear selectores
    const selectores = ['select-tiempo', 'select-estudiante', 'select-asignatura'];
    selectores.forEach(id => {
      const select = document.getElementById(id);
      if (select) select.selectedIndex = 0;
    });

    this.dimensionActual = {
      tiempo: null,
      estudiante: null,
      asignatura: null
    };

    // Limpiar operaciones
    this.limpiarOperaciones();
    this.actualizarCubo();

    setTimeout(() => {
      this.cuboWrapper.style.transition = 'transform 0.3s ease';
    }, 800);

    const btn = document.getElementById('btn-auto-rotate');
    if (btn) {
      btn.textContent = '▶️ Auto-rotar';
    }
  }

  // ============================================
  // OPERACIONES OLAP
  // ============================================

  operacionSlice() {
    console.log('📍 Operación SLICE: Seleccionando un plano...');

    this.limpiarOperaciones();

    // SLICE: Seleccionar todas las celdas con z = 2 (plano central en eje Z/Tiempo)
    this.cells.forEach(celda => {
      const z = parseInt(celda.dataset.z);

      if (z === 2) {
        celda.classList.add('highlight');
      } else {
        celda.classList.add('dimmed');
      }
    });

    this.mostrarMensajeOperacion('SLICE', 'Fijando dimensión Tiempo = 2024-S1 (Z=2)', 'primary');

    // Rotar para mejor vista del plano
    this.rotation.x = 0;
    this.rotation.y = 0;
    this.actualizarRotacion();
  }

  operacionDice() {
    console.log('🎲 Operación DICE: Creando subcubo...');

    this.limpiarOperaciones();

    // DICE: Seleccionar subcubo 3x3x3 en el centro (x:1-3, y:1-3, z:1-3)
    this.cells.forEach(celda => {
      const x = parseInt(celda.dataset.x);
      const y = parseInt(celda.dataset.y);
      const z = parseInt(celda.dataset.z);

      if (x >= 1 && x <= 3 && y >= 1 && y <= 3 && z >= 1 && z <= 3) {
        celda.classList.add('highlight');
      } else {
        celda.classList.add('dimmed');
      }
    });

    this.mostrarMensajeOperacion('DICE', 'Subcubo 3×3×3: Rangos seleccionados en todas las dimensiones', 'secondary');
  }

  operacionDrillDown() {
    console.log('🔍 Operación DRILL DOWN: Profundizando...');

    this.limpiarOperaciones();

    // DRILL DOWN: Expandir celda central y mostrar detalle alrededor
    const centerIndex = Math.floor(this.cells.length / 2); // Celda 62

    this.cells.forEach((celda, index) => {
      const x = parseInt(celda.dataset.x);
      const y = parseInt(celda.dataset.y);
      const z = parseInt(celda.dataset.z);

      // Celda central
      if (x === 2 && y === 2 && z === 2) {
        celda.classList.add('highlight');
        celda.style.transform += ' scale(1.3)';
        celda.style.zIndex = '1000';
      }
      // Celdas adyacentes (6 caras del centro)
      else if (
        (x === 2 && y === 2 && (z === 1 || z === 3)) ||
        (x === 2 && z === 2 && (y === 1 || y === 3)) ||
        (y === 2 && z === 2 && (x === 1 || x === 3))
      ) {
        celda.classList.add('selected');
      } else {
        celda.classList.add('dimmed');
      }
    });

    this.mostrarMensajeOperacion('DRILL DOWN', 'Nivel General → Nivel Detallado (expandiendo celda central)', 'primary');
  }

  operacionDrillUp() {
    console.log('📊 Operación DRILL UP: Agregando...');

    this.limpiarOperaciones();

    // DRILL UP: Agrupar en bloques 2x2x2 de colores diferentes
    const colores = [
      'rgba(73, 185, 206, 0.8)',   // Azul
      'rgba(138, 122, 175, 0.8)',  // Morado
      'rgba(76, 175, 80, 0.8)',    // Verde
      'rgba(255, 193, 7, 0.8)',    // Amarillo
      'rgba(244, 67, 54, 0.8)'     // Rojo
    ];

    this.cells.forEach(celda => {
      const x = parseInt(celda.dataset.x);
      const y = parseInt(celda.dataset.y);
      const z = parseInt(celda.dataset.z);

      // Agrupar en bloques 2x2x2
      const blockX = Math.floor(x / 2);
      const blockY = Math.floor(y / 2);
      const blockZ = Math.floor(z / 2);
      const blockIndex = blockX + blockY * 3 + blockZ * 9;

      celda.style.background = colores[blockIndex % colores.length];
      celda.classList.add('selected');
    });

    this.mostrarMensajeOperacion('DRILL UP', 'Nivel Detallado → Nivel Agregado (agrupando en bloques)', 'secondary');
  }

  operacionPivot() {
    console.log('🔄 Operación PIVOT: Rotando ejes del cubo...');

    this.limpiarOperaciones();

    // PIVOT: Rotar el cubo 90° en Y para intercambiar ejes X ↔ Z
    this.rotation.y += 90;
    this.cuboWrapper.style.transition = 'transform 1.2s ease';
    this.actualizarRotacion();

    // Resaltar todas las celdas durante la rotación
    this.cells.forEach(celda => {
      celda.classList.add('highlight');
    });

    this.mostrarMensajeOperacion('PIVOT', '🔄 Intercambiando ejes: Asignaturas (X) ↔ Tiempo (Z)', 'primary');

    // Quitar highlight después de la animación
    setTimeout(() => {
      this.cells.forEach(celda => {
        celda.classList.remove('highlight');
      });
      this.cuboWrapper.style.transition = 'transform 0.3s ease';
    }, 1200);
  }

  limpiarOperaciones() {
    this.cells.forEach(celda => {
      celda.classList.remove('highlight', 'selected', 'dimmed');
      celda.style.zIndex = '';

      // Restaurar transform original (posición 3D)
      const x = parseInt(celda.dataset.x);
      const y = parseInt(celda.dataset.y);
      const z = parseInt(celda.dataset.z);
      const offset = this.totalSize / 2;

      const posX = x * (this.cellSize + this.cellGap) - offset;
      const posY = y * (this.cellSize + this.cellGap) - offset;
      const posZ = z * (this.cellSize + this.cellGap) - offset;

      celda.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px)`;

      // Restaurar color original
      const nota = parseFloat(celda.dataset.valor);
      this.aplicarColorCelda(celda, nota);
    });

    // Limpiar mensaje
    const mensaje = document.getElementById('operacion-mensaje');
    if (mensaje) {
      mensaje.style.display = 'none';
    }
  }

  mostrarMensajeOperacion(operacion, descripcion, tipo) {
    const mensaje = document.getElementById('operacion-mensaje');
    if (!mensaje) return;

    const colorFondo = tipo === 'primary' ?
      'linear-gradient(135deg, #49B9CE 0%, #3a9bb0 100%)' :
      'linear-gradient(135deg, #8A7AAF 0%, #6d5f8a 100%)';

    mensaje.style.background = colorFondo;
    mensaje.style.color = 'white';
    mensaje.style.fontWeight = '600';
    mensaje.style.display = 'block';
    mensaje.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">🎯 ${operacion}</div>
      <div style="font-size: 0.9rem; opacity: 0.95;">${descripcion}</div>
    `;

    // Auto-ocultar después de 6 segundos
    setTimeout(() => {
      if (mensaje) {
        mensaje.style.display = 'none';
      }
    }, 6000);
  }

  actualizarCubo() {
    this.actualizarInfoCubo();
  }

  actualizarInfoCubo() {
    const infoCubo = document.getElementById('cubo-info');
    if (!infoCubo) return;

    const tiempo = this.dimensionActual.tiempo || 'Todos';
    const estudiante = this.dimensionActual.estudiante || 'Todos';
    const asignatura = this.dimensionActual.asignatura || 'Todas';

    let valorMedida = '-';

    if (typeof datasetAcademico !== 'undefined') {
      if (this.dimensionActual.tiempo && this.dimensionActual.estudiante && this.dimensionActual.asignatura) {
        const valor = datasetAcademico.obtenerValor(
          parseInt(this.dimensionActual.tiempo),
          parseInt(this.dimensionActual.estudiante),
          parseInt(this.dimensionActual.asignatura),
          this.medidaActual
        );
        valorMedida = valor !== null ? valor.toFixed(2) : 'N/A';
      } else {
        valorMedida = datasetAcademico.obtenerPromedioGlobal(this.medidaActual);
      }
    }

    infoCubo.innerHTML = `
      <p><strong>Tiempo:</strong> ${tiempo}</p>
      <p><strong>Estudiante:</strong> ${estudiante}</p>
      <p><strong>Asignatura:</strong> ${asignatura}</p>
      <p><strong>Nota Media:</strong> ${valorMedida}</p>
    `;
  }
}

// Inicializar controlador
let cuboController;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cuboController = new CuboOLAPController();
  });
} else {
  cuboController = new CuboOLAPController();
}
