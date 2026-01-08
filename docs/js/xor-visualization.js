/**
 * XOR Interactive Visualization
 * Curso de Especialización en Inteligencia Artificial y Big Data - ILERNA
 * Author: Bjlanza
 */

document.addEventListener('DOMContentLoaded', () => {
    const points = [
        { x: 0, y: 0, label: '(0, 0)', output: 0 },
        { x: 0, y: 1, label: '(0, 1)', output: 1 },
        { x: 1, y: 0, label: '(1, 0)', output: 1 },
        { x: 1, y: 1, label: '(1, 1)', output: 0 },
    ];

    const outputEl = document.getElementById('xor-output');
    const svgCircles = points.map((p, i) => document.getElementById(`xor-circle-${i}`));
    const buttons = points.map((p, i) => document.getElementById(`xor-button-${i}`));

    function updateSelection(point, index) {
        // Update output text
        outputEl.innerHTML = `Para la entrada <strong style="font-weight: 700;">${point.label}</strong>, la salida esperada es <span style="font-weight: 800; padding: 0.25rem 0.5rem; border-radius: 0.25rem; background-color: ${point.output === 1 ? '#A3E0EA' : '#FFE4E6'}; color: ${point.output === 1 ? '#1e7e9c' : '#9D2449'}">${point.output}</span>.`;

        // Update SVG circles
        svgCircles.forEach((circle, i) => {
            if (i === index) {
                circle.setAttribute('r', '10');
                circle.setAttribute('stroke', '#6b5b95');
                circle.setAttribute('stroke-width', '3');
            } else {
                circle.setAttribute('r', '6');
                circle.setAttribute('stroke', 'none');
            }
        });

        // Update buttons
        buttons.forEach((button, i) => {
            if (i === index) {
                button.style.backgroundColor = '#8A7AAF';
                button.style.color = 'white';
                button.style.borderColor = '#6b5b95';
            } else {
                button.style.backgroundColor = 'white';
                button.style.color = '#333333';
                button.style.borderColor = 'transparent';
            }
        });
    }

    points.forEach((point, index) => {
        if (svgCircles[index]) {
            svgCircles[index].addEventListener('click', () => updateSelection(point, index));
        }
        if (buttons[index]) {
            buttons[index].addEventListener('click', () => updateSelection(point, index));
        }
    });
});
