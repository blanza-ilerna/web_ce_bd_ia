/**
 * CONFIGURACIÓN DE MERMAID PARA iLERNA
 * ===============================================
 * Configuración personalizada de Mermaid.js con colores corporativos iLERNA
 * Colores oficiales:
 * - Primary (Azul): #49B9CE
 * - Secondary (Morado): #8A7AAF
 * - Fondos: #E8F7FA (azul claro), #F0EDF5 (morado claro)
 *
 * Autor: Bjlanza
 * Organización: ILERNA
 * ===============================================
 */

// Inicializar Mermaid con tema personalizado iLERNA
mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        // Colores primarios (Azul iLERNA - var(--color-primary))
        primaryColor: '#49B9CE',
        primaryTextColor: '#FFFFFF',
        primaryBorderColor: '#3a9bb0',  // Hover color para mayor contraste

        // Colores secundarios (Morado iLERNA - var(--color-secondary))
        secondaryColor: '#8A7AAF',
        secondaryTextColor: '#FFFFFF',
        secondaryBorderColor: '#6A5A8F',  // Versión más oscura para contraste

        // Colores terciarios (Morado oscuro para soporte de texto blanco)
        tertiaryColor: '#5E35B1',
        tertiaryTextColor: '#FFFFFF',
        tertiaryBorderColor: '#8A7AAF',

        // Colores para notas (Fondo morado claro - var(--bg-secondary-light))
        noteBkgColor: '#F0EDF5',
        noteTextColor: '#333333',
        noteBorderColor: '#8A7AAF',

        // Fondos generales (siempre blanco para máximo contraste)
        background: '#FFFFFF',
        mainBkg: '#FFFFFF',

        // Bordes y líneas (usando color primario iLERNA)
        nodeBorder: '#49B9CE',
        clusterBkg: '#E8F7FA',
        clusterBorder: '#49B9CE',
        edgeLabelBackground: '#FFFFFF',
        lineColor: '#49B9CE',

        // Tipografía (fuente corporativa iLERNA)
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '16px',

        // IMPORTANTE: Colores de texto - todos en blanco para contraste
        darkMode: false,
        textColor: '#FFFFFF',
        nodeTextColor: '#FFFFFF',
        clusterTextColor: '#333333',

        // Texto en labels y otros elementos
        labelTextColor: '#FFFFFF',

        // Color de texto por defecto (override completo)
        actorTextColor: '#FFFFFF',
        signalTextColor: '#FFFFFF',
        labelBoxBkgColor: '#49B9CE',
        labelBoxBorderColor: '#49B9CE',
        loopTextColor: '#FFFFFF'
    },

    // Configuración específica para mindmaps
    mindmap: {
        padding: 20,
        useMaxWidth: true
    },

    // Configuración para flowcharts
    flowchart: {
        padding: 20,
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
    },

    // Configuración para diagramas de secuencia
    sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1,
        useMaxWidth: true
    },

    // Configuración para diagramas de Gantt
    gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        barGap: 4,
        topPadding: 50,
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        numberSectionStyles: 4,
        axisFormat: '%Y-%m-%d',
        useMaxWidth: true
    }
});
