// Cargar trabajos desde el Local Storage al iniciar la página
document.addEventListener('DOMContentLoaded', cargarTrabajosDesdeLocalStorage);

document.getElementById('publicar').addEventListener('click', function() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const listaTrabajos = document.getElementById('listaTrabajos');
    const selectTrabajos = document.getElementById('selectTrabajos');

    if (titulo && descripcion) {
        const trabajo = { titulo, descripcion };
        guardarTrabajoEnLocalStorage(trabajo);
        agregarTrabajoALaLista(trabajo);

        // Limpiar los campos
        document.getElementById('titulo').value = '';
        document.getElementById('descripcion').value = '';
    }
});

document.getElementById('borrar').addEventListener('click', function() {
    const selectTrabajos = document.getElementById('selectTrabajos');
    const tituloSeleccionado = selectTrabajos.value;

    if (tituloSeleccionado) {
        eliminarTrabajoDeLocalStorage(tituloSeleccionado);
        removeOptionFromSelect(tituloSeleccionado);
    }
});

function guardarTrabajoEnLocalStorage(trabajo) {
    const trabajos = JSON.parse(localStorage.getItem('trabajos')) || [];
    trabajos.push(trabajo);
    localStorage.setItem('trabajos', JSON.stringify(trabajos));
}

function cargarTrabajosDesdeLocalStorage() {
    const trabajos = JSON.parse(localStorage.getItem('trabajos')) || [];
    trabajos.forEach(agregarTrabajoALaLista);
}

function agregarTrabajoALaLista(trabajo) {
    const listaTrabajos = document.getElementById('listaTrabajos');
    const selectTrabajos = document.getElementById('selectTrabajos');

    const trabajoDiv = document.createElement('div');
    trabajoDiv.classList.add('trabajo');

    const trabajoTitulo = document.createElement('input');
    trabajoTitulo.type = 'text';
    trabajoTitulo.value = trabajo.titulo;
    trabajoTitulo.readOnly = true; // Solo lectura

    const trabajoDescripcion = document.createElement('textarea');
    trabajoDescripcion.value = trabajo.descripcion;
    trabajoDescripcion.readOnly = true; // Solo lectura

    const eliminarBoton = document.createElement('button');
    eliminarBoton.textContent = 'Eliminar';
    eliminarBoton.addEventListener('click', function() {
        listaTrabajos.removeChild(trabajoDiv);
        eliminarTrabajoDeLocalStorage(trabajo.titulo);
        removeOptionFromSelect(trabajo.titulo);
    });

    trabajoDiv.appendChild(trabajoTitulo);
    trabajoDiv.appendChild(trabajoDescripcion);
    trabajoDiv.appendChild(eliminarBoton);
    listaTrabajos.appendChild(trabajoDiv);

    const option = document.createElement('option');
    option.textContent = trabajo.titulo;
    option.value = trabajo.titulo;
    selectTrabajos.appendChild(option);
}

function eliminarTrabajoDeLocalStorage(titulo) {
    const trabajos = JSON.parse(localStorage.getItem('trabajos')) || [];
    const trabajosFiltrados = trabajos.filter(trabajo => trabajo.titulo !== titulo);
    localStorage.setItem('trabajos', JSON.stringify(trabajosFiltrados));
}

function removeOptionFromSelect(titulo) {
    const trabajos = document.getElementById('listaTrabajos');
    const options = document.getElementById('selectTrabajos').options;

    // Borrar el trabajo de la lista
    for (let i = 0; i < trabajos.children.length; i++) {
        if (trabajos.children[i].querySelector('input').value === titulo) {
            trabajos.removeChild(trabajos.children[i]);
            break;
        }
    }

    // Borrar el trabajo del menú de selección
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === titulo) {
            document.getElementById('selectTrabajos').removeChild(options[i]);
            break;
        }
    }
}
