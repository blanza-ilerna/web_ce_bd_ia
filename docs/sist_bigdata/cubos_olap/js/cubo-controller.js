/**
 * CONTROLADOR DEL CUBO 3D OLAP
 * Gestiona la interacción, rotación y operaciones del cubo
 * iLERNA - Microsite Cubos OLAP
 */

class CuboOLAPController {
  constructor() {
    this.cuboWrapper = null;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotation = { x: -20, y: -30 };
    this.autoRotate = true;
    this.dimensionActual = {
      tiempo: null,
      estudiante: null,
      asignatura: null
    };
    this.medidaActual = 'notaMedia';
    this.init();
  }

  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.cuboWrapper = document.querySelector('.cubo-wrapper');
    if (!this.cuboWrapper) {
      console.error('No se encontró .cubo-wrapper');
      return;
    }

    this.setupEventListeners();
    this.actualizarInfoCubo();
    this.cargarDatosCubo();
  }

  setupEventListeners() {
    const scene = document.querySelector('.cubo-scene');
    if (!scene) return;

    // Mouse events
    scene.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());

    // Touch events para móvil
    scene.addEventListener('touchstart', (e) => this.onTouchStart(e));
    document.addEventListener('touchmove', (e) => this.onTouchMove(e));
    document.addEventListener('touchend', () => this.onTouchEnd());

    // Prevenir selección de texto al arrastrar
    scene.addEventListener('dragstart', (e) => e.preventDefault());

    // Botones de control
    this.setupControlButtons();

    // Selectores de dimensiones
    this.setupDimensionSelectors();
  }

  setupControlButtons() {
    // Botón Reset
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetCubo());
    }

    // Botón Rotar X
    const btnRotateX = document.getElementById('btn-rotate-x');
    if (btnRotateX) {
      btnRotateX.addEventListener('click', () => this.rotarEje('x'));
    }

    // Botón Rotar Y
    const btnRotateY = document.getElementById('btn-rotate-y');
    if (btnRotateY) {
      btnRotateY.addEventListener('click', () => this.rotarEje('y'));
    }

    // Botón Rotar Z
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

    // Acordeón de controles
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

    // Selector Estudiante (Campus)
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

    // Slider de velocidad de rotación
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
    this.cuboWrapper.style.animation = 'none';
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
  // EVENTOS TOUCH (Móvil)
  // ============================================

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.autoRotate = false;
      this.cuboWrapper.style.animation = 'none';
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
      `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg)`;
  }

  rotarEje(eje) {
    this.autoRotate = false;
    this.cuboWrapper.style.animation = 'none';

    switch(eje) {
      case 'x':
        this.rotation.x += 90;
        break;
      case 'y':
        this.rotation.y += 90;
        break;
      case 'z':
        // Rotar en Z es más complejo, simulamos con ambos ejes
        this.rotation.x += 45;
        this.rotation.y += 45;
        break;
    }

    this.cuboWrapper.style.transition = 'transform 0.8s ease';
    this.actualizarRotacion();

    setTimeout(() => {
      this.cuboWrapper.style.transition = 'transform 0.5s ease';
    }, 800);
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;

    if (this.autoRotate) {
      this.cuboWrapper.style.animation = 'cuboRotate 20s infinite linear';
      this.rotation = { x: -20, y: -30 };
    } else {
      this.cuboWrapper.style.animation = 'none';
    }

    const btn = document.getElementById('btn-auto-rotate');
    if (btn) {
      btn.textContent = this.autoRotate ? '⏸️ Pausar' : '▶️ Auto-rotar';
    }
  }

  ajustarVelocidadRotacion(speed) {
    if (!this.autoRotate) return;

    // speed: 1 (lento) a 10 (rápido)
    const duration = 25 - (speed * 1.5); // 23.5s (lento) a 10s (rápido)
    this.cuboWrapper.style.animation = `cuboRotate ${duration}s infinite linear`;
  }

  resetCubo() {
    this.rotation = { x: -20, y: -30 };
    this.autoRotate = true;
    this.cuboWrapper.style.animation = 'cuboRotate 20s infinite linear';
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

    this.actualizarCubo();

    setTimeout(() => {
      this.cuboWrapper.style.transition = 'transform 0.5s ease';
    }, 800);
  }

  // ============================================
  // ACTUALIZACIÓN DEL CUBO CON DATOS
  // ============================================

  cargarDatosCubo() {
    // Configuración de cada cara con sus dimensiones
    const carasConfig = [
      {
        selector: '.cubo-front',
        titulo: '📅 Tiempo × 📊 Asignaturas',
        filas: ['2023-S1', '2023-S2', '2024-S1'],
        columnas: ['Sist BD', 'Prog IA', 'Model IA', 'Sist ML', 'BD Aplic']
      },
      {
        selector: '.cubo-back',
        titulo: '📅 Tiempo (Histórico)',
        filas: ['2022-S2', '2023-S1', '2023-S2', '2024-S1'],
        columnas: ['Q1', 'Q2', 'Q3', 'Q4']
      },
      {
        selector: '.cubo-right',
        titulo: '👥 Campus × 📊 Asignaturas',
        filas: ['Madrid', 'Barcelona', 'Valencia'],
        columnas: ['Sist BD', 'Prog IA', 'Model IA', 'Sist ML']
      },
      {
        selector: '.cubo-left',
        titulo: '👥 Modalidad × 📅 Tiempo',
        filas: ['Presencial', 'Online'],
        columnas: ['2023-S1', '2023-S2', '2024-S1']
      },
      {
        selector: '.cubo-top',
        titulo: '📊 Asignaturas × 👥 Campus',
        filas: ['Sistemas BD', 'Programación IA', 'Modelos IA'],
        columnas: ['MAD', 'BCN', 'VLC']
      },
      {
        selector: '.cubo-bottom',
        titulo: '📊 Todas las Asignaturas',
        filas: ['Fila 1', 'Fila 2', 'Fila 3', 'Fila 4'],
        columnas: ['Col 1', 'Col 2', 'Col 3', 'Col 4', 'Col 5']
      }
    ];

    carasConfig.forEach(config => {
      const elemento = document.querySelector(config.selector);
      if (elemento) {
        this.generarCeldasCara(elemento, config);
      }
    });
  }

  generarCeldasCara(elemento, config) {
    // Limpiar contenido anterior
    elemento.innerHTML = '';

    // Guardar configuración en el elemento para referencia
    elemento.dataset.config = JSON.stringify(config);

    // Generar las 25 celdas (5x5 grid completo - estilo Rubik)
    const numCeldas = 25;
    for (let i = 0; i < numCeldas; i++) {
      const celda = document.createElement('div');
      celda.className = 'celda';
      celda.dataset.index = i;
      celda.dataset.row = Math.floor(i / 5);
      celda.dataset.col = i % 5;

      // Generar nota aleatoria entre 6.5 y 9.5
      const nota = (Math.random() * 3 + 6.5).toFixed(1);
      celda.textContent = nota;
      celda.dataset.valor = nota;

      // Color según el valor (estilo más vibrante para Rubik)
      const notaNum = parseFloat(nota);
      if (notaNum >= 9.0) {
        celda.style.background = 'rgba(46, 125, 50, 0.6)'; // Verde oscuro
      } else if (notaNum >= 8.0) {
        celda.style.background = 'rgba(76, 175, 80, 0.5)'; // Verde claro
      } else if (notaNum >= 7.0) {
        celda.style.background = 'rgba(255, 193, 7, 0.5)'; // Amarillo
      } else {
        celda.style.background = 'rgba(244, 67, 54, 0.5)'; // Rojo
      }

      // Tooltip con info detallada
      celda.title = `${config.titulo}\nNota: ${nota}\nFila: ${Math.floor(i / 5) + 1}\nColumna: ${(i % 5) + 1}`;

      // Click para seleccionar celda
      celda.addEventListener('click', () => this.seleccionarCelda(celda));

      elemento.appendChild(celda);
    }
  }

  seleccionarCelda(celda) {
    // Toggle selección
    celda.classList.toggle('selected');
  }

  // ============================================
  // OPERACIONES OLAP
  // ============================================

  operacionSlice() {
    console.log('📍 Operación SLICE: Cortando una dimensión...');

    // Limpiar estados anteriores
    this.limpiarOperaciones();

    // Slice: Seleccionar solo una fila (por ejemplo, fila 2)
    const todasLasCeldas = document.querySelectorAll('.celda');
    todasLasCeldas.forEach(celda => {
      const fila = parseInt(celda.dataset.row);
      if (fila === 2) {
        // Resaltar la fila seleccionada
        celda.classList.add('highlight');
      } else {
        // Atenuar las demás
        celda.classList.add('dimmed');
      }
    });

    // Mostrar mensaje
    this.mostrarMensajeOperacion('SLICE', 'Dimensión Tiempo: Solo 2024-S1 (Fila 3)', 'primary');

    // Rotar cubo para mostrar mejor la operación
    this.rotation.x = -10;
    this.rotation.y = 0;
    this.actualizarRotacion();
  }

  operacionDice() {
    console.log('🎲 Operación DICE: Creando subcubo...');

    // Limpiar estados anteriores
    this.limpiarOperaciones();

    // Dice: Seleccionar un subcubo (filas 1-3, columnas 1-3)
    const todasLasCeldas = document.querySelectorAll('.celda');
    todasLasCeldas.forEach(celda => {
      const fila = parseInt(celda.dataset.row);
      const col = parseInt(celda.dataset.col);

      if (fila >= 1 && fila <= 3 && col >= 1 && col <= 3) {
        // Resaltar el subcubo
        celda.classList.add('highlight');
      } else {
        // Atenuar las demás
        celda.classList.add('dimmed');
      }
    });

    // Mostrar mensaje
    this.mostrarMensajeOperacion('DICE', 'Subcubo: 2023 + Madrid/Barcelona + 3 Asignaturas', 'secondary');
  }

  operacionDrillDown() {
    console.log('🔍 Operación DRILL DOWN: Profundizando...');

    // Limpiar estados anteriores
    this.limpiarOperaciones();

    // Drill Down: Expandir una celda mostrando más detalle
    const todasLasCeldas = document.querySelectorAll('.celda');

    // Seleccionar celda central para drill down
    todasLasCeldas.forEach(celda => {
      const index = parseInt(celda.dataset.index);

      if (index === 12) {
        // Celda central - expandir
        celda.classList.add('highlight');
        celda.style.transform = 'scale(1.2)';
        celda.style.zIndex = '100';
      } else if ([6, 7, 8, 11, 13, 16, 17, 18].includes(index)) {
        // Celdas alrededor - mostrar como "detalle"
        celda.classList.add('selected');
      } else {
        celda.classList.add('dimmed');
      }
    });

    // Mostrar mensaje
    this.mostrarMensajeOperacion('DRILL DOWN', 'Curso → Semestre → Mes (detallando)', 'primary');

    // Zoom in en el cubo
    this.cuboWrapper.style.transform =
      `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg) scale(1.15)`;
  }

  operacionDrillUp() {
    console.log('📊 Operación DRILL UP: Agregando...');

    // Limpiar estados anteriores
    this.limpiarOperaciones();

    // Drill Up: Agrupar celdas
    const todasLasCeldas = document.querySelectorAll('.celda');

    // Agrupar por bloques de 2x2
    todasLasCeldas.forEach(celda => {
      const fila = parseInt(celda.dataset.row);
      const col = parseInt(celda.dataset.col);

      // Agrupar en bloques
      if (fila < 2 && col < 2) {
        celda.style.background = 'rgba(73, 185, 206, 0.6)'; // Grupo 1
        celda.classList.add('selected');
      } else if (fila < 2 && col >= 2) {
        celda.style.background = 'rgba(138, 122, 175, 0.6)'; // Grupo 2
        celda.classList.add('selected');
      } else if (fila >= 2 && col < 2) {
        celda.style.background = 'rgba(76, 175, 80, 0.6)'; // Grupo 3
        celda.classList.add('selected');
      } else {
        celda.classList.add('dimmed');
      }
    });

    // Mostrar mensaje
    this.mostrarMensajeOperacion('DRILL UP', 'Mes → Semestre → Curso (agregando)', 'secondary');

    // Zoom out en el cubo
    this.cuboWrapper.style.transform =
      `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg) scale(0.9)`;
  }

  operacionPivot() {
    console.log('🔄 Operación PIVOT: Rotando ejes...');

    // Limpiar estados anteriores
    this.limpiarOperaciones();

    // Pivot: Rotar 90° en Y para intercambiar ejes
    this.rotation.y += 90;
    this.cuboWrapper.style.transition = 'transform 1s ease';
    this.actualizarRotacion();

    // Resaltar todas las celdas durante la rotación
    const todasLasCeldas = document.querySelectorAll('.celda');
    todasLasCeldas.forEach(celda => {
      celda.classList.add('highlight');
    });

    // Mostrar mensaje
    this.mostrarMensajeOperacion('PIVOT', 'Intercambiando ejes: Asignaturas ↔ Estudiantes', 'primary');

    // Quitar highlight después de la animación
    setTimeout(() => {
      todasLasCeldas.forEach(celda => {
        celda.classList.remove('highlight');
      });
      this.cuboWrapper.style.transition = 'transform 0.5s ease';
    }, 1000);
  }

  limpiarOperaciones() {
    const todasLasCeldas = document.querySelectorAll('.celda');
    todasLasCeldas.forEach(celda => {
      celda.classList.remove('highlight', 'selected', 'dimmed');
      celda.style.transform = '';
      celda.style.zIndex = '';

      // Restaurar color original según valor
      const nota = parseFloat(celda.dataset.valor);
      if (nota >= 9.0) {
        celda.style.background = 'rgba(46, 125, 50, 0.6)';
      } else if (nota >= 8.0) {
        celda.style.background = 'rgba(76, 175, 80, 0.5)';
      } else if (nota >= 7.0) {
        celda.style.background = 'rgba(255, 193, 7, 0.5)';
      } else {
        celda.style.background = 'rgba(244, 67, 54, 0.5)';
      }
    });

    // Restaurar escala del cubo
    this.cuboWrapper.style.transform =
      `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg) scale(1)`;

    // Limpiar mensaje
    const mensaje = document.getElementById('operacion-mensaje');
    if (mensaje) {
      mensaje.style.display = 'none';
    }
  }

  mostrarMensajeOperacion(operacion, descripcion, tipo) {
    const mensaje = document.getElementById('operacion-mensaje');
    if (!mensaje) return;

    // Configurar mensaje
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

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      if (mensaje) {
        mensaje.style.display = 'none';
      }
    }, 5000);
  }

  actualizarCubo() {
    // Aquí se actualizarán los valores del cubo según las dimensiones seleccionadas
    this.actualizarInfoCubo();
    this.resaltarCarasActivas();
  }

  resaltarCarasActivas() {
    // Resaltar caras según dimensiones seleccionadas
    const todasLasCaras = document.querySelectorAll('.cubo-face');
    todasLasCaras.forEach(cara => {
      cara.style.borderColor = 'var(--cubo-border)';
      cara.style.borderWidth = '2px';
    });

    // Si hay dimensión de tiempo seleccionada, resaltar front
    if (this.dimensionActual.tiempo) {
      const front = document.querySelector('.cubo-front');
      if (front) {
        front.style.borderColor = 'var(--cubo-highlight)';
        front.style.borderWidth = '4px';
      }
    }

    // Si hay dimensión de estudiante, resaltar right
    if (this.dimensionActual.estudiante) {
      const right = document.querySelector('.cubo-right');
      if (right) {
        right.style.borderColor = 'var(--cubo-highlight)';
        right.style.borderWidth = '4px';
      }
    }

    // Si hay dimensión de asignatura, resaltar top
    if (this.dimensionActual.asignatura) {
      const top = document.querySelector('.cubo-top');
      if (top) {
        top.style.borderColor = 'var(--cubo-highlight)';
        top.style.borderWidth = '4px';
      }
    }
  }

  actualizarInfoCubo() {
    const infoCubo = document.getElementById('cubo-info');
    if (!infoCubo) return;

    const tiempo = this.dimensionActual.tiempo || 'Todos';
    const estudiante = this.dimensionActual.estudiante || 'Todos';
    const asignatura = this.dimensionActual.asignatura || 'Todas';

    let valorMedida = '-';

    // Si hay datos cargados, calcular medida
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

// Inicializar controlador cuando cargue la página
let cuboController;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cuboController = new CuboOLAPController();
  });
} else {
  cuboController = new CuboOLAPController();
}
