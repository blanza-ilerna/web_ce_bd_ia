# Estilos Comunes para Lecciones - iLERNA

Este directorio contiene los estilos CSS reutilizables para todas las lecciones del curso de Inteligencia Artificial y Big Data.

## Archivos

### `lecciones.css`
**Archivo principal de estilos comunes** que debe ser incluido en todas las lecciones.

#### Estructura del archivo:

1. **Reset y configuración global**
   - Box-sizing universal
   - Tipografía Montserrat
   - Background gradiente

2. **Header**
   - Logo de iLERNA
   - Títulos y subtítulos

3. **Secciones**
   - Contenedores con sombras
   - Títulos jerárquicos (h2, h3, h4)

4. **Colores temáticos**
   - `.color-ani` / `.color-primary` → #49B9CE (azul)
   - `.color-agi` / `.color-secondary` → #8A7AAF (morado)
   - `.color-warning` → #E65100 (naranja)
   - `.color-success` → #2E7D32 (verde)
   - `.color-error` → #C62828 (rojo)

5. **Componentes reutilizables**
   - `.highlight-box` - Cajas de destaque con gradiente
   - `.feature-card` - Tarjetas con hover effect
   - `.example-item` - Items de ejemplos
   - `.important-note` - Notas importantes
   - `.bordered-box` - Cajas con bordes de colores
   - `.prediction-box` - Cajas de predicciones
   - `.warning-box` - Cajas de advertencia
   - `.curiosity-box` - Datos curiosos
   - `.expert-quote` - Citas de expertos
   - `.scenario-box` - Cajas de escenarios
   - `.comparison-grid` - Comparaciones positivo/negativo
   - `.final-card` - Tarjetas de reflexión final
   - `.challenge-box` - Desafíos

6. **Tablas**
   - Estilos con gradiente en header
   - Alternancia de colores en filas

7. **SVG y visualizaciones**
   - Contenedores responsivos
   - Sombras y bordes

8. **Footer**
   - Pingüino animado (bounce)
   - Enlaces a iLERNA

9. **Responsive**
   - Breakpoint 768px (tablets)
   - Breakpoint 480px (móviles)

## Uso en HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Título de la Lección - iLERNA</title>

    <!-- CSS Común de Lecciones -->
    <link rel="stylesheet" href="../css/lecciones.css">

    <!-- Prism.js para código (opcional) -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Header con logo -->
        <header>
            <div class="logo">
                <!-- SVG del logo iLERNA -->
            </div>
            <h1>Título de la Lección</h1>
            <p>Subtítulo descriptivo</p>
        </header>

        <!-- Secciones de contenido -->
        <section>
            <h2>Sección Principal</h2>
            <p>Contenido...</p>

            <!-- Tarjetas -->
            <div class="grid-features">
                <div class="feature-card primary">
                    <h4 class="color-primary">Título</h4>
                    <p>Descripción...</p>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer>
            <div style="margin-bottom: 1.5rem;">
                <h3>iLERNA</h3>
                <p class="subtitle">Curso de Especialización en Inteligencia Artificial y Big Data</p>
                <a href="https://www.ilerna.es/" target="_blank">www.ilerna.es</a>
            </div>
            <p class="description">Centro oficial de FP online y presencial.</p>

            <div class="penguin">
                <span>🐧</span>
            </div>
        </footer>
    </div>

    <!-- Scripts -->
    <script src="../js/lecciones.js"></script>
</body>
</html>
```

## Componentes Comunes

### Caja de Destaque
```html
<div class="highlight-box primary">
    <p class="title">Título</p>
    <p class="content">Contenido de la caja...</p>
</div>
```

### Tarjeta de Característica
```html
<div class="feature-card primary">
    <h4 class="color-primary">🎯 Título</h4>
    <p>Descripción de la característica...</p>
</div>
```

### Dato Curioso
```html
<div class="curiosity-box">
    <h4>💡 Dato Curioso</h4>
    <p>Información interesante...</p>
    <div class="inner-box">
        <p>Información adicional...</p>
    </div>
</div>
```

### Caja de Advertencia
```html
<div class="warning-box">
    <p class="title">⚠️ Advertencia</p>
    <p class="content">Mensaje de advertencia...</p>
</div>
```

### Cita de Experto
```html
<div class="expert-quote">
    <p class="quote-text">"Cita textual del experto..."</p>
    <p class="quote-author">— Nombre del Experto, Título</p>
</div>
```

## Paleta de Colores

| Color | Código | Uso |
|-------|--------|-----|
| Azul primario | `#49B9CE` | Elementos principales, enlaces, ANI |
| Morado secundario | `#8A7AAF` | Elementos secundarios, AGI |
| Naranja advertencia | `#E65100` | Advertencias, ASI |
| Verde éxito | `#2E7D32` | Positivo |
| Rojo error | `#C62828` | Negativo |
| Gris texto | `#555555` | Texto general |
| Gris oscuro | `#333333` | Títulos |

## Archivos Específicos de Lección

Si una lección necesita estilos personalizados adicionales:

1. Crear `css/nombre-leccion.css`
2. Incluir después de `lecciones.css`:

```html
<link rel="stylesheet" href="../css/lecciones.css">
<link rel="stylesheet" href="../css/nombre-leccion.css">
```

## Mantenimiento

- **NO modificar** `lecciones.css` para necesidades específicas de una lección
- Crear archivos CSS específicos solo cuando sea necesario
- Mantener la consistencia en nombres de clases
- Documentar nuevos componentes aquí

## Compatibilidad

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Responsive: móvil, tablet, desktop
- Fuente: Montserrat (Google Fonts)

---

**iLERNA** - Curso de Especialización en Inteligencia Artificial y Big Data
