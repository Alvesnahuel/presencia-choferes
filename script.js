// ID de la hoja de Google Sheets
const SHEET_ID = '1ove7LHy9idtZRgoQ8bGmbmPks2WQpLtOzjZJSAXGUBA/'; // Reemplaza con tu ID real

// Nombre de la hoja (puede ser "Hoja1" u otro nombre si lo cambiaste)
const SHEET_NAME = 'Hoja1';

// URL de la API de Google Sheets en formato JSON usando OpenSheet
const API_URL = `https://opensheet.vercel.app/${SHEET_ID}/${SHEET_NAME}`;

let estadoChart; // Variable para almacenar el gráfico

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

// Función para actualizar la tabla
function actualizarTabla(choferes) {
    const tbody = document.querySelector('#choferes-table tbody');
    tbody.innerHTML = ''; // Limpiar tabla

    let ultimaActualizacion = '';

    choferes.forEach(chofer => {
        const tr = document.createElement('tr');

        const nombreTd = document.createElement('td');
        nombreTd.textContent = chofer['Nombre del Chofer'];
        tr.appendChild(nombreTd);

        const estadoTd = document.createElement('td');
        estadoTd.textContent = chofer['Estado'];
        // Aplicar clases según el estado
        const estado = chofer['Estado'].toLowerCase();
        if (estado === 'disponible') {
            estadoTd.classList.add('estado-disponible');
        } else if (estado === 'en ruta') {
            estadoTd.classList.add('estado-en-ruta');
        } else if (estado === 'en pausa') {
            estadoTd.classList.add('estado-en-pausa');
        }
        tr.appendChild(estadoTd);

        const actualizacionTd = document.createElement('td');
        actualizacionTd.textContent = chofer['Última Actualización'];
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
    if (ultimaActualizacion) {
        ultimaActualizacionElem.textContent = `Última actualización: ${ultimaActualizacion.toLocaleString()}`;
    }
}

// Función para actualizar el gráfico
function actualizarGrafico(choferes) {
    const estados = choferes.map(chofer => chofer['Estado'].toLowerCase());
    const conteo = {
        disponible: estados.filter(e => e === 'disponible').length,
        en_ruta: estados.filter(e => e === 'en ruta').length,
        en_pausa: estados.filter(e => e === 'en pausa').length
    };

    const ctx = document.getElementById('estadoChart').getContext('2d');

    if (estadoChart) {
        estadoChart.destroy();
    }

    estadoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Disponible', 'En Ruta', 'En Pausa'],
            datasets: [{
                label: '# de Choferes',
                data: [conteo.disponible, conteo.en_ruta, conteo.en_pausa],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)', // Verde
                    'rgba(255, 193, 7, 0.7)',  // Amarillo
                    'rgba(220, 53, 69, 0.7)'   // Rojo
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 18
                        }
                    }
                }
            }
        }
    });
}

// Función principal para cargar y actualizar datos
async function cargarDatos() {
    const choferes = await obtenerDatos();
    actualizarTabla(choferes);
    actualizarGrafico(choferes);
}

// Cargar datos inicialmente
cargarDatos();

// Actualizar datos cada 60 segundos
setInterval(cargarDatos, 60000);
