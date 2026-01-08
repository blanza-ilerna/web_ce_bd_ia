// ELIZA Chatbot Logic - iLERNA
// Curso de Especialización en Inteligencia Artificial y Big Data
// Recreación del chatbot ELIZA de Joseph Weizenbaum (1966)

document.addEventListener('DOMContentLoaded', () => {

    // --- ELIZA Logic ---
    // Reglas de reconocimiento de patrones y respuestas
    const rules = [
        {
            pattern: /necesito (.*)/i,
            responses: [
                "¿Por qué necesita {0}?",
                "¿Qué significaría para usted conseguir {0}?",
                "¿Está seguro de que realmente necesita {0}?"
            ]
        },
        {
            pattern: /por qué no puedes (.*)/i,
            responses: [
                "¿Cree que debería poder {0}?",
                "Quizás con el tiempo pueda {0}. ¿Eso le gustaría?",
                "¿Realmente quiere que pueda {0}?"
            ]
        },
        {
            pattern: /no puedo (.*)/i,
            responses: [
                "¿Cómo sabe que no puede {0}?",
                "¿Quizás podría {0} si lo intentara?",
                "¿Qué necesitaría para poder {0}?"
            ]
        },
        {
            pattern: /siento (.*)/i,
            responses: [
                "Cuénteme más sobre esos sentimientos.",
                "¿A menudo se siente {0}?",
                "¿Cuándo empezó a sentirse {0}?"
            ]
        },
        {
            pattern: /(estoy|me siento) (triste|deprimido|mal)/i,
            responses: [
                "Lamento oír que está {1}.",
                "¿Cree que venir aquí le ayudará a no estar {1}?",
                "Estoy seguro de que no es agradable estar {1}."
            ]
        },
        {
            pattern: /(estoy|me siento) (.*)/i,
            responses: [
                "¿Cómo llegó a estar {1}?",
                "¿Cuánto tiempo ha estado {1}?",
                "¿Disfruta estando {1}?"
            ]
        },
        {
            pattern: /soy (.*)/i,
            responses: [
                "¿Por qué dice que es {0}?",
                "¿Por qué cree que es {0}?",
                "¿Cómo se siente al ser {0}?"
            ]
        },
        {
            pattern: /recuerdo (.*)/i,
            responses: [
                "¿Piensa a menudo en {0}?",
                "¿Ese recuerdo le afecta de alguna manera?",
                "¿Qué más recuerda?"
            ]
        },
        {
            pattern: /sueño con (.*)/i,
            responses: [
                "Qué interesante. ¿Qué significa ese sueño para usted?",
                "¿Con qué frecuencia sueña con {0}?",
                "¿Los sueños le parecen importantes?"
            ]
        },
        {
            pattern: /(hola|buenas)/i,
            responses: [
                "Hola... ¿cómo se siente hoy?",
                "Buenas. ¿Qué le trae por aquí?"
            ]
        },
        {
            pattern: /quizá|tal vez/i,
            responses: [
                "Parece no estar muy seguro.",
                "Intente ser más positivo.",
                "¿No puede estar seguro?"
            ]
        },
        {
            pattern: /(madre|mamá)/i,
            responses: [
                "Cuénteme más sobre su madre.",
                "¿Qué relación tiene con su madre?",
                "¿Cómo le hace sentir su madre?"
            ]
        },
        {
            pattern: /(padre|papá)/i,
            responses: [
                "Hábleme de su padre.",
                "¿Cómo era su relación con su padre?",
                "¿Qué sentimientos le inspira su padre?"
            ]
        },
        {
            pattern: /(niño|infancia)/i,
            responses: [
                "¿Tiene buenos recuerdos de su infancia?",
                "¿Qué me puede contar de su infancia?",
                "¿Cree que su infancia le ha marcado?"
            ]
        },
        {
            pattern: /(gracias|adiós|ciao)/i,
            responses: [
                "De nada. Ha sido un placer hablar con usted.",
                "Adiós. Espero que nuestra conversación le haya sido de ayuda.",
                "Hasta la próxima sesión."
            ]
        },
        {
            pattern: /.*/,
            responses: [
                "Continúe...",
                "Entiendo.",
                "Por favor, siga.",
                "¿Qué le hace pensar eso?",
                "Cuénteme más.",
                "Muy interesante.",
                "¿Y qué opina usted de eso?"
            ]
        }
    ];

    // Objeto para recordar el último índice de respuesta usado por cada regla
    let lastResponseIndex = {};

    /**
     * Genera una respuesta de ELIZA basada en el input del usuario
     * @param {string} userInput - Texto ingresado por el usuario
     * @returns {string} - Respuesta generada por ELIZA
     */
    function getElizaResponse(userInput) {
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            const match = userInput.match(rule.pattern);

            if (match) {
                let responseIndex = Math.floor(Math.random() * rule.responses.length);

                // Evitar repetir la misma respuesta para la misma regla si es posible
                if (rule.responses.length > 1 && lastResponseIndex[i] === responseIndex) {
                    responseIndex = (responseIndex + 1) % rule.responses.length;
                }
                lastResponseIndex[i] = responseIndex;

                let response = rule.responses[responseIndex];

                // Reflexión de pronombres (transformar primera persona a segunda)
                if (match.length > 1) {
                    const captured = match.slice(1).find(c => c !== undefined) || '';
                    const reflected = captured
                        .replace(/mi /gi, "su ")
                        .replace(/mis /gi, "sus ")
                        .replace(/soy/gi, "es")
                        .replace(/estoy/gi, "está")
                        .replace(/yo/gi, "usted")
                        .replace(/ me /gi, " le ");
                    response = response.replace(/\{(\d+)\}/g, (m, d) => reflected);
                }
                return response;
            }
        }
    }

    // --- DOM Manipulation ---
    const messagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const submitButton = document.getElementById('chat-submit');

    /**
     * Añade un mensaje al contenedor de chat
     * @param {string} sender - 'user', 'eliza' o 'eliza-typing'
     * @param {string} text - Contenido del mensaje
     * @returns {HTMLElement} - Elemento DOM del mensaje creado
     */
    function addMessage(sender, text) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `chat-message ${sender}-message`;

        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble';

        if (sender === 'eliza-typing') {
            messageBubble.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        } else {
            messageBubble.textContent = text;
        }

        messageWrapper.appendChild(messageBubble);
        messagesContainer.appendChild(messageWrapper);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageWrapper;
    }

    // Mensaje inicial de ELIZA
    addMessage('eliza', 'Hola. Soy ELIZA. ¿De qué le gustaría hablar?');

    // Manejador del formulario de chat
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = chatInput.value.trim();
        if (!userInput) return;

        // Añadir mensaje del usuario
        addMessage('user', userInput);
        chatInput.value = '';
        chatInput.disabled = true;
        submitButton.disabled = true;

        // Mostrar indicador de escritura
        const typingIndicator = addMessage('eliza-typing', '');

        // Simular el "pensamiento" de ELIZA
        setTimeout(() => {
            messagesContainer.removeChild(typingIndicator);
            const elizaResponse = getElizaResponse(userInput);
            addMessage('eliza', elizaResponse);
            chatInput.disabled = false;
            submitButton.disabled = false;
            chatInput.focus();
        }, 1000 + Math.random() * 500); // Delay aleatorio entre 1-1.5 segundos
    });

    console.log('ELIZA chatbot inicializado correctamente');
});
