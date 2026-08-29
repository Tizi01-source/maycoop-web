/* =========================================
   LÓGICA PRINCIPAL DEL SITIO
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // INYECCIÓN DE DATOS GLOBALES
    const anioSpan = document.getElementById('anio-actual');
    if (anioSpan) {
        anioSpan.textContent = new Date().getFullYear();
    }

    const aniosExperiencia = new Date().getFullYear() - MAYCOOP_DATOS.anioFundacion;

    const inyectarDato = (clase, valor) => {
        document.querySelectorAll(clase).forEach(elemento => {
            elemento.textContent = valor;
        });
    };

    if (typeof MAYCOOP_DATOS !== 'undefined') {
        // Inyectamos los datos con los nombres de las constantes
        inyectarDato('.dato-tel-comercial', MAYCOOP_DATOS.telComercial);
        inyectarDato('.dato-tel-cobranzas', MAYCOOP_DATOS.telCobranzas);
        inyectarDato('.dato-email', MAYCOOP_DATOS.email);
        inyectarDato('.dato-direccion', MAYCOOP_DATOS.direccionCABA);
        inyectarDato('.dato-socios', MAYCOOP_DATOS.totalSocios);
        inyectarDato('.dato-creditos', MAYCOOP_DATOS.totalCreditos);
        inyectarDato('.dato-anios', aniosExperiencia);

        // Genera links automáticos para los íconos de WhatsApp
        const numeroLimpio = "549" + MAYCOOP_DATOS.telComercial.replace(/\D/g, "");

        document.querySelectorAll('a i.fa-whatsapp').forEach(icono => {
            const linkPadre = icono.parentElement;

            if (linkPadre) {
                let mensaje = "Hola, me comunico desde la web de Maycoop.";

                if (linkPadre.classList.contains('btn-whatsapp-inversiones')) {
                    mensaje = "Hola, quiero recibir asesoramiento sobre inversiones y Obligaciones Negociables.";
                }

                linkPadre.href = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
                linkPadre.target = "_blank";
            }
        });
    }

    // INICIAR CALCULADORA (Para index.html)
    inicializarCalculadora();

    // INICIAR ACORDEÓN FAQs (institucional.html)
    inicializarAcordeonFAQs();

    // INICIAR FORMULARIO CONTACTO (institucional.html)
    inicializarFormularioContacto();

    // INICIAR FORMULARIO PRÉSTAMOS (prestamos.html)
    inicializarFormularioPrestamo();

    // 6. INICIAR FORMULARIO REFERIDOS (referidos.html)
    inicializarFormularioReferidos();

    // INICIAR MENÚ MÓVIL
    inicializarMenuMovil();

    // INICIAR CARRUSEL AUTOMÁTICO (index.html)
    inicializarCarrusel();
});

/* --- LÓGICA DE LA CALCULADORA --- */
function inicializarCalculadora() {

    const contenedorCalculadora = document.querySelector('.caja-simulador');

    if (!contenedorCalculadora) return; // Si no hay calculadora en esta página, frena acá.

    // Valores por defecto
    let montoSolicitado = 10000;
    let cantidadCuotas = 6;
    let tasaInteresMensual = 0.08; // 8% mensual estimativo

    const botones = contenedorCalculadora.querySelectorAll('.btn-opcion');
    const displayCuota = contenedorCalculadora.querySelector('.resultado-cuota h3');

    const calcularCuota = () => {
        // Fórmula del Sistema Francés
        const cuota = (montoSolicitado * tasaInteresMensual * Math.pow(1 + tasaInteresMensual, cantidadCuotas)) / (Math.pow(1 + tasaInteresMensual, cantidadCuotas) - 1);

        // Mostrar en pesos
        displayCuota.textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(cuota);
    };

    botones.forEach(boton => {

        boton.addEventListener('click', (e) => {
            const textoBoton = e.target.textContent;
            const contenedorBotones = e.target.parentElement;

            // Cambiar clase 'activo'
            contenedorBotones.querySelectorAll('.btn-opcion').forEach(btn => btn.classList.remove('activo'));
            e.target.classList.add('activo');

            // Leer si el usuario tocó Plata o Cuotas
            if (textoBoton.includes('$')) {
                montoSolicitado = parseInt(textoBoton.replace('$', '').replace('.', ''));
            } else {
                cantidadCuotas = parseInt(textoBoton.split(' ')[0]);
            }

            calcularCuota();
        });
    });

    // Ejecutar el primer cálculo al abrir la web
    calcularCuota();
}

/* --- LÓGICA ACORDEÓN FAQs --- */
function inicializarAcordeonFAQs() {

    const botonesFaq = document.querySelectorAll('.faq-pregunta');
    if (botonesFaq.length === 0) return; // Si no hay acordeón, frena acá

    botonesFaq.forEach(boton => {

        boton.addEventListener('click', () => {
            const respuesta = boton.nextElementSibling;
            const icono = boton.querySelector('i');

            // Si tocaste una que ya está abierta, la cierra
            if (respuesta.style.display === 'block') {
                respuesta.style.display = 'none';
                icono.style.transform = 'rotate(0deg)';
                boton.style.color = 'var(--gris-carbon)';
            } else {
                // Primero cerramos todas las demás para que quede limpio
                document.querySelectorAll('.faq-respuesta').forEach(r => r.style.display = 'none');
                document.querySelectorAll('.faq-pregunta i').forEach(i => i.style.transform = 'rotate(0deg)');
                document.querySelectorAll('.faq-pregunta').forEach(b => b.style.color = 'var(--gris-carbon)');

                // Después abrimos la que el usuario clickeó
                respuesta.style.display = 'block';
                icono.style.transform = 'rotate(180deg)';
                boton.style.color = 'var(--turquesa)';
            }
        });
    });
}

/* --- LÓGICA FORMULARIO DE CONTACTO (Formspree) --- */
function inicializarFormularioContacto() {

    // Buscamos el formulario dentro de la caja de contacto rápido
    const formContacto = document.querySelector('.form-contacto-rapido form');
    if (!formContacto) return; // Si no estamos en la página institucional, frena acá

    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página recargue al enviar

        // Capturamos los inputs
        const nombre = document.getElementById('nombre-contacto').value;
        const correo = document.getElementById('correo-contacto').value;
        const asunto = document.getElementById('asunto-contacto').value;
        const mensaje = document.getElementById('mensaje-contacto').value;
        const boton = formContacto.querySelector('button[type="submit"]');

        // Formateamos el asunto tal como pediste
        const asuntoFormateado = `MAIL DE: ${nombre} - "${asunto}"`;

        // Efecto visual de "Enviando..."
        const textoOriginal = boton.textContent;
        boton.textContent = 'ENVIANDO...';
        boton.disabled = true;

        try {
            const response = await fetch('https://formspree.io/f/mbgjjqyq', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nombre,
                    email: correo,
                    subject: asuntoFormateado,
                    message: mensaje
                })
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Mensaje enviado!',
                    text: 'Nos pondremos en contacto a la brevedad.',
                    icon: 'success',
                    confirmButtonColor: '#C71565'
                });
                formContacto.reset(); // Limpia los campos
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al enviar el mensaje. Por favor, intentá de nuevo.',
                    icon: 'error',
                    confirmButtonColor: '#C71565'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error de conexión',
                text: 'Revisá tu internet e intentá nuevamente.',
                icon: 'warning',
                confirmButtonColor: '#C71565'
            });
        } finally {
            // Restauramos el botón a su estado normal
            boton.textContent = textoOriginal;
            boton.disabled = false;
        }
    });
}

/* --- LÓGICA FORMULARIO DE PRÉSTAMOS (Formspree) --- */
function inicializarFormularioPrestamo() {

    // Buscamos el formulario por su clase solo en la pagina de prestamo
    const formPrestamo = document.querySelector('.seccion-formulario form.formulario-prestamo');

    // Un pequeño filtro: si estamos en referidos, ese form también tiene esta clase,
    // así que nos aseguramos de que estamos en préstamos verificando que exista el campo "monto"
    const inputMonto = document.getElementById('monto');
    if (!formPrestamo || !inputMonto) return;

    formPrestamo.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Capturamos los inputs
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const dni = document.getElementById('dni').value;
        const correo = document.getElementById('correo').value;
        const telefono = document.getElementById('telefono').value;

        const cuit = document.getElementById('cuit').value;
        const organismo = document.getElementById('organismo').value;
        const monto = document.getElementById('monto').value;
        const cuotas = document.getElementById('cuotas').value;
        const destino = document.getElementById('destino').value || "No especificado"; // Por si lo deja vacío

        const boton = formPrestamo.querySelector('button[type="submit"]');
        const textoOriginal = boton.textContent;

        boton.textContent = 'PROCESANDO SOLICITUD...';
        boton.disabled = true;

        // Formateamos un Asunto que llame la atención en la bandeja de entrada
        const asuntoFormateado = `🚨 NUEVA SOLICITUD DE PRÉSTAMO: ${nombre} ${apellido} - $${monto}`;

        // Armamos el cuerpo del mensaje bien estructurado
        const cuerpoMensaje = `
DATOS PERSONALES:
- Nombre completo: ${nombre} ${apellido}
- DNI: ${dni}
- Teléfono: ${telefono}
- Correo: ${correo}

DATOS CREDITICIOS:
- CUIT/CUIL: ${cuit}
- Organismo: ${organismo}
- Monto Solicitado: $${monto}
- Cantidad de Cuotas: ${cuotas}
- Destino del préstamo: ${destino}
        `;

        try {
            const response = await fetch('https://formspree.io/f/xyeyyldy', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre_cliente: nombre,
                    apellido_cliente: apellido,
                    email: correo, // Le pasamos el email así formspree sabe a quién responderle
                    subject: asuntoFormateado,
                    message: cuerpoMensaje
                })
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Solicitud enviada!',
                    text: 'El departamento de créditos la analizará y te contactará.',
                    icon: 'success',
                    confirmButtonColor: '#C71565'
                });
                formPrestamo.reset();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al enviar el mensaje. Por favor, intentá de nuevo.',
                    icon: 'error',
                    confirmButtonColor: '#C71565'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error de conexión',
                text: 'Revisá tu internet e intentá nuevamente.',
                icon: 'warning',
                confirmButtonColor: '#C71565'
            });
        } finally {
            boton.textContent = textoOriginal;
            boton.disabled = false;
        }
    });
}

/* --- LÓGICA FORMULARIO DE REFERIDOS (Formspree) --- */
function inicializarFormularioReferidos() {

    // Buscamos el formulario. Como usa la misma clase CSS que préstamos,
    // lo diferenciamos buscando un ID único de esta página ('dni-referente').
    const formReferidos = document.querySelector('.seccion-formulario form.formulario-prestamo');
    const inputDniReferente = document.getElementById('dni-referente');
    if (!formReferidos || !inputDniReferente) return; // Si no estamos en Referidos, frena acá.

    formReferidos.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Capturamos los datos
        const dniReferente = document.getElementById('dni-referente').value;
        const nombreReferido = document.getElementById('nombre-referido').value;
        const apellidoReferido = document.getElementById('apellido-referido').value;
        const dniReferido = document.getElementById('dni-referido').value;
        const correoReferido = document.getElementById('correo-referido').value;
        const telefonoReferido = document.getElementById('telefono-referido').value;

        const boton = formReferidos.querySelector('button[type="submit"]');
        const textoOriginal = boton.textContent;

        boton.textContent = 'PROCESANDO DATOS...';
        boton.disabled = true;

        // Armamos un asunto claro para identificar quién refiere a quién
        const asuntoFormateado = `🤝 NUEVO REFERIDO: De DNI ${dniReferente} para ${nombreReferido} ${apellidoReferido}`;

        // Cuerpo del mensaje dividido para lectura rápida
        const cuerpoMensaje = `
DATOS DEL REFERENTE (Socio que recomienda):
- DNI: ${dniReferente}

DATOS DEL INTERESADO (Nuevo cliente referido):
- Nombre completo: ${nombreReferido} ${apellidoReferido}
- DNI: ${dniReferido}
- Teléfono: ${telefonoReferido}
- Correo: ${correoReferido}
        `;

        try {
            const response = await fetch('https://formspree.io/f/xjyvvjaj', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dni_referente: dniReferente,
                    nombre_referido: nombreReferido,
                    email: correoReferido, // Le pasamos el mail del referido
                    subject: asuntoFormateado,
                    message: cuerpoMensaje
                })
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Datos enviados!',
                    text: 'Nos pondremos en contacto con tu referido a la brevedad.',
                    icon: 'success',
                    confirmButtonColor: '#C71565'
                });
                formReferidos.reset();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al enviar el mensaje. Por favor, intentá de nuevo.',
                    icon: 'error',
                    confirmButtonColor: '#C71565'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error de conexión',
                text: 'Revisá tu internet e intentá nuevamente.',
                icon: 'warning',
                confirmButtonColor: '#C71565'
            });
        } finally {
            boton.textContent = textoOriginal;
            boton.disabled = false;
        }
    });
}

/* --- LÓGICA DEL MENÚ MÓVIL --- */
function inicializarMenuMovil() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mostrar');
        // Cambiar el ícono de barras a 'X'
        const icono = menuToggle.querySelector('i');
        if (navLinks.classList.contains('mostrar')) {
            icono.classList.remove('fa-bars');
            icono.classList.add('fa-xmark');
        } else {
            icono.classList.remove('fa-xmark');
            icono.classList.add('fa-bars');
        }
    });
}

/* --- LÓGICA DEL CARRUSEL AUTOMÁTICO --- */
function inicializarCarrusel() {
    const carrusel = document.querySelector('.testimonios-grid');
    if (!carrusel) return;

    let scrollAmount = 0;

    // Gira solo cada 4 segundos
    setInterval(() => {
        // Solo ejecuta el giro automático si estamos en un celular (menor a 768px)
        if (window.innerWidth <= 768) {
            // Calcula el ancho de la tarjeta + el espacio (gap)
            const cardWidth = carrusel.querySelector('.testimonio-card').offsetWidth + 20;
            scrollAmount += cardWidth;

            // Si llegamos al final, volvemos a la primera tarjeta
            if (scrollAmount >= carrusel.scrollWidth - carrusel.offsetWidth) {
                scrollAmount = 0;
            }

            // Mueve el carrusel suavemente
            carrusel.scrollTo({
                top: 0,
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }, 4000); // 4000 = 4 segundos
}








