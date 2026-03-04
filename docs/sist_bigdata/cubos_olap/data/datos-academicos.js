/**
 * DATASET ACADÉMICO - CUBO OLAP
 * Datos de ejemplo para el microsite de Cubos OLAP
 * iLERNA - Curso de Especialización en IA y Big Data
 */

const datasetAcademico = {
  // DIMENSIÓN 1: TIEMPO (Jerarquía: Curso → Semestre → Mes)
  dimensionTiempo: {
    niveles: ['Curso', 'Semestre', 'Mes'],
    datos: [
      // Curso 2023-2024
      {
        id: 1,
        nivel: 'Curso',
        valor: '2023-2024',
        hijos: [11, 12]
      },
      {
        id: 11,
        nivel: 'Semestre',
        valor: '2023-S1',
        padre: 1,
        hijos: [111, 112, 113]
      },
      {
        id: 111,
        nivel: 'Mes',
        valor: 'Sep 2023',
        padre: 11
      },
      {
        id: 112,
        nivel: 'Mes',
        valor: 'Oct 2023',
        padre: 11
      },
      {
        id: 113,
        nivel: 'Mes',
        valor: 'Nov 2023',
        padre: 11
      },
      {
        id: 12,
        nivel: 'Semestre',
        valor: '2023-S2',
        padre: 1,
        hijos: [121, 122, 123]
      },
      {
        id: 121,
        nivel: 'Mes',
        valor: 'Ene 2024',
        padre: 12
      },
      {
        id: 122,
        nivel: 'Mes',
        valor: 'Feb 2024',
        padre: 12
      },
      {
        id: 123,
        nivel: 'Mes',
        valor: 'Mar 2024',
        padre: 12
      },
      // Curso 2024-2025
      {
        id: 2,
        nivel: 'Curso',
        valor: '2024-2025',
        hijos: [21]
      },
      {
        id: 21,
        nivel: 'Semestre',
        valor: '2024-S1',
        padre: 2,
        hijos: [211, 212, 213]
      },
      {
        id: 211,
        nivel: 'Mes',
        valor: 'Sep 2024',
        padre: 21
      },
      {
        id: 212,
        nivel: 'Mes',
        valor: 'Oct 2024',
        padre: 21
      },
      {
        id: 213,
        nivel: 'Mes',
        valor: 'Nov 2024',
        padre: 21
      }
    ]
  },

  // DIMENSIÓN 2: ESTUDIANTES (Jerarquía: Centro → Campus → Modalidad → Ciclo)
  dimensionEstudiantes: {
    niveles: ['Centro', 'Campus', 'Modalidad', 'Ciclo'],
    datos: [
      {
        id: 1,
        nivel: 'Centro',
        valor: 'Ilerna Total',
        hijos: [11, 12, 13]
      },
      // Campus Madrid
      {
        id: 11,
        nivel: 'Campus',
        valor: 'Madrid',
        padre: 1,
        hijos: [111, 112]
      },
      {
        id: 111,
        nivel: 'Modalidad',
        valor: 'Presencial',
        padre: 11,
        hijos: [1111]
      },
      {
        id: 1111,
        nivel: 'Ciclo',
        valor: 'IA y Big Data',
        padre: 111,
        numEstudiantes: 45
      },
      {
        id: 112,
        nivel: 'Modalidad',
        valor: 'Online',
        padre: 11,
        hijos: [1121]
      },
      {
        id: 1121,
        nivel: 'Ciclo',
        valor: 'IA y Big Data',
        padre: 112,
        numEstudiantes: 32
      },
      // Campus Barcelona
      {
        id: 12,
        nivel: 'Campus',
        valor: 'Barcelona',
        padre: 1,
        hijos: [121, 122]
      },
      {
        id: 121,
        nivel: 'Modalidad',
        valor: 'Presencial',
        padre: 12,
        hijos: [1211]
      },
      {
        id: 1211,
        nivel: 'Ciclo',
        valor: 'IA y Big Data',
        padre: 121,
        numEstudiantes: 38
      },
      {
        id: 122,
        nivel: 'Modalidad',
        valor: 'Online',
        padre: 12,
        hijos: [1221]
      },
      {
        id: 1221,
        nivel: 'Ciclo',
        valor: 'IA y Big Data',
        padre: 122,
        numEstudiantes: 28
      },
      // Campus Valencia
      {
        id: 13,
        nivel: 'Campus',
        valor: 'Valencia',
        padre: 1,
        hijos: [131, 132]
      },
      {
        id: 131,
        nivel: 'Modalidad',
        valor: 'Presencial',
        padre: 13,
        hijos: [1311]
      },
      {
        id: 1311,
        nivel: 'Ciclo',
        valor: 'IA y Big Data',
        padre: 131,
        numEstudiantes: 35
      },
      {
        id: 132,
        nivel: 'Modalidad',
        valor: 'Online',
        padre: 13,
        hijos: [1321]
      },
      {
        id: 1321,
        nivel: 'Ciclo',
        valor: 'IA y Big Data',
        padre: 132,
        numEstudiantes: 25
      }
    ]
  },

  // DIMENSIÓN 3: ASIGNATURAS (Jerarquía: Familia → Ciclo → Asignatura)
  dimensionAsignaturas: {
    niveles: ['Familia', 'Ciclo', 'Asignatura'],
    datos: [
      {
        id: 1,
        nivel: 'Familia',
        valor: 'Informática y Comunicaciones',
        hijos: [11]
      },
      {
        id: 11,
        nivel: 'Ciclo',
        valor: 'IA y Big Data',
        padre: 1,
        hijos: [111, 112, 113, 114, 115]
      },
      {
        id: 111,
        nivel: 'Asignatura',
        valor: 'Sistemas Big Data',
        padre: 11,
        creditos: 8
      },
      {
        id: 112,
        nivel: 'Asignatura',
        valor: 'Programación IA',
        padre: 11,
        creditos: 8
      },
      {
        id: 113,
        nivel: 'Asignatura',
        valor: 'Modelos IA',
        padre: 11,
        creditos: 6
      },
      {
        id: 114,
        nivel: 'Asignatura',
        valor: 'Sistemas ML',
        padre: 11,
        creditos: 6
      },
      {
        id: 115,
        nivel: 'Asignatura',
        valor: 'Big Data Aplicaciones',
        padre: 11,
        creditos: 7
      }
    ]
  },

  // MEDIDAS (MÉTRICAS DEL CUBO)
  medidas: {
    // Nota Media (0-10)
    notaMedia: [
      // 2023-S1
      { tiempo: 11, estudiante: 1111, asignatura: 111, valor: 7.8 },
      { tiempo: 11, estudiante: 1111, asignatura: 112, valor: 7.2 },
      { tiempo: 11, estudiante: 1111, asignatura: 113, valor: 8.1 },
      { tiempo: 11, estudiante: 1111, asignatura: 114, valor: 7.5 },
      { tiempo: 11, estudiante: 1111, asignatura: 115, valor: 7.9 },

      { tiempo: 11, estudiante: 1121, asignatura: 111, valor: 7.1 },
      { tiempo: 11, estudiante: 1121, asignatura: 112, valor: 6.8 },
      { tiempo: 11, estudiante: 1121, asignatura: 113, valor: 7.3 },
      { tiempo: 11, estudiante: 1121, asignatura: 114, valor: 7.0 },
      { tiempo: 11, estudiante: 1121, asignatura: 115, valor: 7.2 },

      { tiempo: 11, estudiante: 1211, asignatura: 111, valor: 8.2 },
      { tiempo: 11, estudiante: 1211, asignatura: 112, valor: 7.9 },
      { tiempo: 11, estudiante: 1211, asignatura: 113, valor: 8.5 },
      { tiempo: 11, estudiante: 1211, asignatura: 114, valor: 8.0 },
      { tiempo: 11, estudiante: 1211, asignatura: 115, valor: 8.3 },

      { tiempo: 11, estudiante: 1221, asignatura: 111, valor: 7.0 },
      { tiempo: 11, estudiante: 1221, asignatura: 112, valor: 6.9 },
      { tiempo: 11, estudiante: 1221, asignatura: 113, valor: 7.4 },
      { tiempo: 11, estudiante: 1221, asignatura: 114, valor: 7.1 },
      { tiempo: 11, estudiante: 1221, asignatura: 115, valor: 7.3 },

      { tiempo: 11, estudiante: 1311, asignatura: 111, valor: 7.6 },
      { tiempo: 11, estudiante: 1311, asignatura: 112, valor: 7.4 },
      { tiempo: 11, estudiante: 1311, asignatura: 113, valor: 7.8 },
      { tiempo: 11, estudiante: 1311, asignatura: 114, valor: 7.3 },
      { tiempo: 11, estudiante: 1311, asignatura: 115, valor: 7.7 },

      { tiempo: 11, estudiante: 1321, asignatura: 111, valor: 6.9 },
      { tiempo: 11, estudiante: 1321, asignatura: 112, valor: 6.7 },
      { tiempo: 11, estudiante: 1321, asignatura: 113, valor: 7.2 },
      { tiempo: 11, estudiante: 1321, asignatura: 114, valor: 6.8 },
      { tiempo: 11, estudiante: 1321, asignatura: 115, valor: 7.0 },

      // 2023-S2 (mejora general)
      { tiempo: 12, estudiante: 1111, asignatura: 111, valor: 8.1 },
      { tiempo: 12, estudiante: 1111, asignatura: 112, valor: 7.6 },
      { tiempo: 12, estudiante: 1111, asignatura: 113, valor: 8.4 },
      { tiempo: 12, estudiante: 1111, asignatura: 114, valor: 7.9 },
      { tiempo: 12, estudiante: 1111, asignatura: 115, valor: 8.2 },

      { tiempo: 12, estudiante: 1121, asignatura: 111, valor: 7.4 },
      { tiempo: 12, estudiante: 1121, asignatura: 112, valor: 7.2 },
      { tiempo: 12, estudiante: 1121, asignatura: 113, valor: 7.7 },
      { tiempo: 12, estudiante: 1121, asignatura: 114, valor: 7.3 },
      { tiempo: 12, estudiante: 1121, asignatura: 115, valor: 7.6 },

      { tiempo: 12, estudiante: 1211, asignatura: 111, valor: 8.5 },
      { tiempo: 12, estudiante: 1211, asignatura: 112, valor: 8.3 },
      { tiempo: 12, estudiante: 1211, asignatura: 113, valor: 8.8 },
      { tiempo: 12, estudiante: 1211, asignatura: 114, valor: 8.4 },
      { tiempo: 12, estudiante: 1211, asignatura: 115, valor: 8.6 },

      { tiempo: 12, estudiante: 1221, asignatura: 111, valor: 7.3 },
      { tiempo: 12, estudiante: 1221, asignatura: 112, valor: 7.2 },
      { tiempo: 12, estudiante: 1221, asignatura: 113, valor: 7.8 },
      { tiempo: 12, estudiante: 1221, asignatura: 114, valor: 7.4 },
      { tiempo: 12, estudiante: 1221, asignatura: 115, valor: 7.6 },

      { tiempo: 12, estudiante: 1311, asignatura: 111, valor: 7.9 },
      { tiempo: 12, estudiante: 1311, asignatura: 112, valor: 7.8 },
      { tiempo: 12, estudiante: 1311, asignatura: 113, valor: 8.2 },
      { tiempo: 12, estudiante: 1311, asignatura: 114, valor: 7.7 },
      { tiempo: 12, estudiante: 1311, asignatura: 115, valor: 8.0 },

      { tiempo: 12, estudiante: 1321, asignatura: 111, valor: 7.2 },
      { tiempo: 12, estudiante: 1321, asignatura: 112, valor: 7.0 },
      { tiempo: 12, estudiante: 1321, asignatura: 113, valor: 7.5 },
      { tiempo: 12, estudiante: 1321, asignatura: 114, valor: 7.1 },
      { tiempo: 12, estudiante: 1321, asignatura: 115, valor: 7.4 },

      // 2024-S1 (mejora continua)
      { tiempo: 21, estudiante: 1111, asignatura: 111, valor: 8.4 },
      { tiempo: 21, estudiante: 1111, asignatura: 112, valor: 8.0 },
      { tiempo: 21, estudiante: 1111, asignatura: 113, valor: 8.7 },
      { tiempo: 21, estudiante: 1111, asignatura: 114, valor: 8.2 },
      { tiempo: 21, estudiante: 1111, asignatura: 115, valor: 8.5 },

      { tiempo: 21, estudiante: 1121, asignatura: 111, valor: 7.7 },
      { tiempo: 21, estudiante: 1121, asignatura: 112, valor: 7.5 },
      { tiempo: 21, estudiante: 1121, asignatura: 113, valor: 8.0 },
      { tiempo: 21, estudiante: 1121, asignatura: 114, valor: 7.6 },
      { tiempo: 21, estudiante: 1121, asignatura: 115, valor: 7.9 },

      { tiempo: 21, estudiante: 1211, asignatura: 111, valor: 8.8 },
      { tiempo: 21, estudiante: 1211, asignatura: 112, valor: 8.6 },
      { tiempo: 21, estudiante: 1211, asignatura: 113, valor: 9.1 },
      { tiempo: 21, estudiante: 1211, asignatura: 114, valor: 8.7 },
      { tiempo: 21, estudiante: 1211, asignatura: 115, valor: 8.9 },

      { tiempo: 21, estudiante: 1221, asignatura: 111, valor: 7.6 },
      { tiempo: 21, estudiante: 1221, asignatura: 112, valor: 7.5 },
      { tiempo: 21, estudiante: 1221, asignatura: 113, valor: 8.1 },
      { tiempo: 21, estudiante: 1221, asignatura: 114, valor: 7.7 },
      { tiempo: 21, estudiante: 1221, asignatura: 115, valor: 7.9 },

      { tiempo: 21, estudiante: 1311, asignatura: 111, valor: 8.2 },
      { tiempo: 21, estudiante: 1311, asignatura: 112, valor: 8.1 },
      { tiempo: 21, estudiante: 1311, asignatura: 113, valor: 8.5 },
      { tiempo: 21, estudiante: 1311, asignatura: 114, valor: 8.0 },
      { tiempo: 21, estudiante: 1311, asignatura: 115, valor: 8.3 },

      { tiempo: 21, estudiante: 1321, asignatura: 111, valor: 7.5 },
      { tiempo: 21, estudiante: 1321, asignatura: 112, valor: 7.3 },
      { tiempo: 21, estudiante: 1321, asignatura: 113, valor: 7.8 },
      { tiempo: 21, estudiante: 1321, asignatura: 114, valor: 7.4 },
      { tiempo: 21, estudiante: 1321, asignatura: 115, valor: 7.7 }
    ],

    // Tasa de aprobados (%)
    tasaAprobados: [
      // 2023-S1
      { tiempo: 11, estudiante: 1111, asignatura: 111, valor: 85 },
      { tiempo: 11, estudiante: 1111, asignatura: 112, valor: 78 },
      { tiempo: 11, estudiante: 1111, asignatura: 113, valor: 88 },
      { tiempo: 11, estudiante: 1111, asignatura: 114, valor: 82 },
      { tiempo: 11, estudiante: 1111, asignatura: 115, valor: 86 },
      // ... más datos
    ],

    // Asistencia (%)
    asistencia: [
      { tiempo: 11, estudiante: 1111, asignatura: 111, valor: 92 },
      { tiempo: 11, estudiante: 1111, asignatura: 112, valor: 88 },
      { tiempo: 11, estudiante: 1111, asignatura: 113, valor: 95 },
      // ... más datos
    ]
  },

  // Métodos auxiliares para consultar el cubo
  obtenerValor: function(tiempo, estudiante, asignatura, medida = 'notaMedia') {
    const datos = this.medidas[medida];
    const registro = datos.find(d =>
      d.tiempo === tiempo &&
      d.estudiante === estudiante &&
      d.asignatura === asignatura
    );
    return registro ? registro.valor : null;
  },

  obtenerPromedioGlobal: function(medida = 'notaMedia') {
    const datos = this.medidas[medida];
    const suma = datos.reduce((acc, d) => acc + d.valor, 0);
    return (suma / datos.length).toFixed(2);
  },

  obtenerEtiquetaDimension: function(dimension, id) {
    let datos;
    switch(dimension) {
      case 'tiempo':
        datos = this.dimensionTiempo.datos;
        break;
      case 'estudiante':
        datos = this.dimensionEstudiantes.datos;
        break;
      case 'asignatura':
        datos = this.dimensionAsignaturas.datos;
        break;
    }
    const item = datos.find(d => d.id === id);
    return item ? item.valor : 'Desconocido';
  }
};

// Exportar para uso en el microsite
if (typeof module !== 'undefined' && module.exports) {
  module.exports = datasetAcademico;
}
