// ID de la hoja de Google Sheets
const SHEET_ID = '1ove7LHy9idtZRgoQ8bGmbmPks2WQpLtOzjZJSAXGUBA'; // Reemplaza con tu ID real
const SHEET_NAME = 'Hoja1';

// URL de la API de Google Sheets en formato JSON usando OpenSheet
const API_URL = `https://opensheet.vercel.app/${SHEET_ID}/${SHEET_NAME}`;

let ultimaActualizacionGlobal = null; // Variable para almacenar la última actualización

// Función para obtener los datos de Google Sheets
async function obtenerDatos() {
    try {
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return [];
    }
}

// Función para formatear la fecha y hora
function formatearFechaHora(fecha) {
    const opciones = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleString('es-ES', opciones);
}

// Normalizar texto (para manejar mayúsculas/minúsculas y tildes)
function normalizarTexto(texto) {
    return texto
        .toUpperCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ""); // Remueve tildes
}

// Función para actualizar la tabla
function actualizarTabla(choferes) {
    const tbody = document.querySelector('#choferes-table tbody');
    tbody.innerHTML = ''; // Limpiar tabla

    let ultimaActualizacion = null;

    choferes.forEach(chofer => {
        const tr = document.createElement('tr');

        const nombreTd = document.createElement('td');
        nombreTd.textContent = chofer['Nombre del Chofer'];
        tr.appendChild(nombreTd);

        const estadoTd = document.createElement('td');
        estadoTd.textContent = chofer['Estado'];

        // Normalizar estado y aplicar clases
        const estado = normalizarTexto(chofer['Estado']);

        if (estado === 'ESPERANDO CARGA') {
            estadoTd.classList.add('estado-ESPERANDO-CARGA');
        } else if (estado === 'DESPACHADO') {
            estadoTd.classList.add('estado-DESPACHADO');
        } else if (estado === 'EN PAUSA') {
            estadoTd.classList.add('estado-EN-PAUSA');
        } else if (estado === 'EN DEPOSITO' || estado === 'EN DEPÓSITO') {
            estadoTd.classList.add('estado-EN-DEPOSITO');
        }
        
        tr.appendChild(estadoTd);

        const actualizacionTd = document.createElement('td');
        actualizacionTd.textContent = formatearFechaHora(chofer['Última Actualización']);
        tr.appendChild(actualizacionTd);

        const ubicacionTd = document.createElement('td');
        ubicacionTd.textContent = chofer['Ubicación'];
        tr.appendChild(ubicacionTd);

        tbody.appendChild(tr);

        // Actualizar la última actualización si es más reciente
        const fechaActualizacion = new Date(chofer['Última Actualización']);
        if (!ultimaActualizacion || fechaActualizacion > ultimaActualizacion) {
            ultimaActualizacion = fechaActualizacion;
        }
    });

    // Mostrar la última actualización en el DOM
    const ultimaActualizacionElem = document.getElementById('ultima-actualizacion');
    if (ultimaActualizacion && (!ultimaActualizacionGlobal || ultimaActualizacion > ultimaActualizacionGlobal)) {
        ultimaActualizacionGlobal = ultimaActualizacion;
        ultimaActualizacionElem.textContent = `Última actualización: ${formatearFechaHora(ultimaActualizacion)}`;
    }
}

// Función principal para cargar y actualizar datos
async function cargarDatos() {
    const choferes = await obtenerDatos();
    actualizarTabla(choferes);
}

// Cargar datos inicialmente
cargarDatos();

// Actualizar datos cada 60 segundos
setInterval(cargarDatos, 10000);

