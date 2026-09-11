document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MODO OSCURO / CLARO ---
    const btnTema = document.getElementById('btnTema');
    
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            document.body.classList.toggle('oscuro');
            
            const esOscuro = document.body.classList.contains('oscuro');
            btnTema.innerHTML = esOscuro 
                ? '<i class="fa-solid fa-sun nav-icono"></i><span class="nav-texto">Modo claro</span>' 
                : '<i class="fa-solid fa-moon nav-icono"></i><span class="nav-texto">Modo oscuro</span>';
        });
    }

    // --- 2. FILTRADO DE PROYECTOS ---
    const botonesFiltro = document.querySelectorAll('.filtro-btn');
    const tarjetasProyecto = document.querySelectorAll('.tarjeta-proyecto');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            boton.classList.add('activo');

            const categoriaFiltro = boton.getAttribute('data-filtro');

            tarjetasProyecto.forEach(tarjeta => {
                const categoriaTarjeta = tarjeta.getAttribute('data-categoria');

                if (categoriaFiltro === 'todos' || categoriaTarjeta === categoriaFiltro) {
                    tarjeta.style.display = 'flex';
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });

    // --- 3. FORMULARIO DE CONTACTO CON FETCH REAL ---
    const formContacto = document.getElementById('formContacto');
    const mensajeEstado = document.getElementById('mensajeEstado');
    
    // REEMPLAZA ESTA URL CON TU LINK DE FORMSPREE O APPS SCRIPT
    const ENDPOINT_URL = "https://formspree.io/f/xjyvzkdw";

    if (formContacto && mensajeEstado) {
        formContacto.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            const btnSubmit = formContacto.querySelector('button[type="submit"]');

            // 1. Validación de campos incompletos
            if (nombre === '' || email === '' || mensaje === '') {
                mensajeEstado.textContent = 'Por favor completa todos los campos requeridos.';
                mensajeEstado.style.borderColor = 'var(--alerta)';
                mensajeEstado.style.color = 'var(--alerta)';
                mensajeEstado.hidden = false;
                return;
            }

            // 2. Validación de formato de correo incorrecto mediante Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                mensajeEstado.textContent = 'Correo inválido. Sugerencia: verifica que contenga "@" y un dominio válido (ejemplo: tu.correo@duocuc.cl).';
                mensajeEstado.style.borderColor = 'var(--alerta)';
                mensajeEstado.style.color = 'var(--alerta)';
                mensajeEstado.hidden = false;
                return;
            }

            // Guardamos el texto original del botón
            const textoOriginalBoton = btnSubmit ? btnSubmit.textContent : 'Enviar';

            try {
                // Estado visual de "Enviando..." mientras se ejecuta la petición
                if (btnSubmit) {
                    btnSubmit.disabled = true;
                    btnSubmit.textContent = 'Enviando...';
                }

                mensajeEstado.textContent = 'Enviando tu mensaje...';
                mensajeEstado.style.borderColor = 'var(--primario, #3b82f6)';
                mensajeEstado.style.color = 'var(--primario, #3b82f6)';
                mensajeEstado.hidden = false;

                // 3. Envío asíncrono con fetch()
                const response = await fetch(ENDPOINT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: nombre,
                        email: email,
                        mensaje: mensaje
                    })
                });

                if (response.ok) {
                    // Éxito al enviar
                    mensajeEstado.textContent = '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.';
                    mensajeEstado.style.borderColor = 'var(--exito)';
                    mensajeEstado.style.color = 'var(--exito)';
                    mensajeEstado.hidden = false;

                    formContacto.reset();
                } else {
                    throw new Error('Respuesta del servidor no OK');
                }
            } catch (error) {
                // Captura de errores si falla la red o la URL
                console.error("Error al enviar mensaje:", error);
                mensajeEstado.textContent = 'Hubo un problema al enviar el mensaje. Inténtalo de nuevo más tarde.';
                mensajeEstado.style.borderColor = 'var(--alerta)';
                mensajeEstado.style.color = 'var(--alerta)';
                mensajeEstado.hidden = false;
            } finally {
                // Restauramos el botón a su estado original
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = textoOriginalBoton;
                }

                // Ocultamos el mensaje de estado después de 6 segundos
                setTimeout(() => {
                    mensajeEstado.hidden = true;
                }, 6000);
            }
        });
    }

    // --- 4. SCROLLSPY (NAVEGACIÓN ACTIVA SEGÚN SECCIÓN) ---
    const secciones = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let actual = '';

        secciones.forEach(seccion => {
            const seccionTop = seccion.offsetTop - 100;
            if (window.scrollY >= seccionTop) {
                actual = seccion.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('activo');
            if (link.getAttribute('href') === `#${actual}`) {
                link.classList.add('activo');
            }
        });
    });

    // --- 5. BARRA DE PROGRESO DE LECTURA ---
    const barraProgreso = document.getElementById('barraProgreso');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && barraProgreso) {
            const porcentaje = (window.scrollY / totalHeight) * 100;
            barraProgreso.style.width = `${porcentaje}%`;
        }
    });

    // --- 6. BOTÓN VOLVER ARRIBA ---
    const btnVolverArriba = document.getElementById('btnVolverArriba');
    if (btnVolverArriba) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btnVolverArriba.classList.add('visible');
            } else {
                btnVolverArriba.classList.remove('visible');
            }
        });

        btnVolverArriba.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});