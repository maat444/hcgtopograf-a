// --- ACTUALIZACIÓN DE AÑO DINÁMICO ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- ANIMACIÓN DE FONDO (TOPOGRAFÍA SATELITAL) ---
const canvas = document.getElementById('topoCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let lines = [];
const lineCount = 20;
const oliveColors = ['#01e1ff', '#0b60ff', '#05ff2f', '#26d9e6'];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initLines();
}

function initLines() {
    lines = [];
    for (let i = 0; i < lineCount; i++) {
        lines.push({
            y: Math.random() * height,
            amplitude: Math.random() * 50 + 20,
            frequency: Math.random() * 0.01 + 0.002,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.005,
            color: oliveColors[Math.floor(Math.random() * oliveColors.length)]
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar líneas de contorno
    lines.forEach((line, index) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.3; // Transparencia sutil

        for (let x = 0; x < width; x += 10) {
            // Fórmula de onda para simular terreno
            const yOffset = Math.sin(x * line.frequency + line.phase) * line.amplitude;
            const y = line.y + yOffset;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();

        // Mover la fase para la animación
        line.phase += line.speed;

        // Reiniciar líneas si salen de pantalla
        if (line.y > height + 100) line.y = -100;
        line.y += line.speed * 10;
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();


// ============================================
// FORMULARIO DE CONTACTO CON EMAILJS
// ============================================

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) {
        console.error('Formulario de contacto no encontrado');
        return;
    }

    // Verificar que EmailJS esté disponible
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está cargado. Verifica que el script esté incluido en el HTML.');
        return;
    }

    // Inicializar EmailJS con tu Public Key
    emailjs.init("WbZJkQyxs3HslGBAe");

    // Elemento para mostrar mensajes
    const formMessage = document.createElement('div');
    formMessage.id = 'formMessage';
    formMessage.style.cssText = `
        display: none;
        margin: 15px 0;
        padding: 12px;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
    `;
    contactForm.appendChild(formMessage);

    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Mostrar mensajes
    function showFormMessage(text, type = 'success') {
        formMessage.textContent = text;
        formMessage.style.display = 'block';

        if (type === 'success') {
            formMessage.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            formMessage.style.color = '#22c55e';
            formMessage.style.border = '1px solid #22c55e';
        } else {
            formMessage.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            formMessage.style.color = '#ef4444';
            formMessage.style.border = '1px solid #ef4444';
        }

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Validación de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Estado para prevenir múltiples envíos
    let isSubmitting = false;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        // Obtener valores
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validaciones
        if (!name || !email || !phone || !message) {
            showFormMessage('Por favor, completa todos los campos obligatorios.', 'error');
            isSubmitting = false;
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            isSubmitting = false;
            return;
        }

        // Actualizar botón
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';

        try {

            // Combinar toda la información
            const fullMessage = `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\nMensaje:\n${message}`;
            // Parámetros para EmailJS
            const templateParams = {
                from_name: name,
                from_email: email,
                from_phone: phone,
                message: fullMessage,
                to_email: 'compendiocircular8@gmail.com'
            };

            console.log('Enviando email con parámetros:', templateParams);

            // Enviar con EmailJS
            const response = await emailjs.send(
                'service_z3psntg',   // Service ID
                'template_tba06be',  // Template ID
                templateParams
            );

            console.log('Email enviado exitosamente:', response);

            // Mostrar éxito
            showFormMessage('¡Mensaje enviado exitosamente! Te responderemos pronto.', 'success');

            // Resetear formulario
            contactForm.reset();

        } catch (error) {
            console.error('Error al enviar email:', error);

            let errorMessage = 'Error al enviar el mensaje. Por favor, intenta nuevamente.';

            if (error.status === 0) {
                errorMessage = 'Error de conexión. Verifica tu internet.';
            } else if (error.text) {
                errorMessage = `Error: ${error.text}`;
            }

            showFormMessage(errorMessage, 'error');

        } finally {
            // Restaurar botón
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// --- CAMBIO DE COLOR NAVBAR AL SCROLL ---
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(22, 48, 133, 0.55)';
    } else {
        navbar.style.background = 'rgba(36, 31, 80, 0.55)';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Inicializar formulario de contacto con EmailJS
    setupContactForm();

    const cards = document.querySelectorAll('.service-card');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        cards.forEach(card => card.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Opcional: quitar la clase cuando ya no esté visible para volver a animar al registrar de nuevo
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    });

    cards.forEach(card => observer.observe(card));
});