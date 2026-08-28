
document.addEventListener("DOMContentLoaded", () => {

    // Poner el año actual automáticamente en el footer
    const anioSpan = document.getElementById('anio-actual');
    if (anioSpan) {
        anioSpan.textContent = new Date().getFullYear();
    }

    // Inyectar las constantes en todos los lugares que tengan estas clases
    const inyectarDato = (clase, valor) => {
        document.querySelectorAll(clase).forEach(elemento => {
            elemento.textContent = valor;
        });
    };

    // Usamos el objeto MAYCOOP_DATOS de tu archivo constantes.js
    if (typeof MAYCOOP_DATOS !== 'undefined') {
        inyectarDato('.dato-tel-comercial', MAYCOOP_DATOS.telComercial);
        inyectarDato('.dato-tel-cobranzas', MAYCOOP_DATOS.telCobranzas);
        inyectarDato('.dato-email', MAYCOOP_DATOS.email);
        inyectarDato('.dato-direccion', MAYCOOP_DATOS.direccionCABA);
        inyectarDato('.dato-socios', MAYCOOP_DATOS.totalSocios);
        inyectarDato('.dato-creditos', MAYCOOP_DATOS.totalCreditos);
    }
});