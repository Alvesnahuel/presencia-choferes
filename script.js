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
        
        // Aplicar clases según el estado
        const estado = chofer['Estado'].toLowerCase(); // Convertir a minúsculas para evitar errores
        if (estado === 'esperando carga') {
            estadoTd.classList.add('estado-esperando-carga');
        } else if (estado === 'en ruta') {
            estadoTd.classList.add('estado-en-ruta');
        } else if (estado === 'en pausa') {
            estadoTd.classList.add('estado-en-pausa');
        } else if (estado === 'EN DEPOSITO') { // Asegurarse de que el texto coincida exactamente
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
