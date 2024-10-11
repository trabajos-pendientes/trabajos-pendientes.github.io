// Cargar trabajos desde el Local Storage al iniciar la página
document.addEventListener('DOMContentLoaded', cargarTrabajosDesdeLocalStorage);

document.getElementById('publicar').addEventListener('click', function() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const listaTrabajos = document.getElementById('listaTrabajos');

    if (titulo && descripcion) {
        const trabajo = { titulo, descripcion };
        guardarTrabajoEnLocalStorage(trabajo);
        agregarTrabajoALaLista(trabajo);

        // Enviar trabajo a Discord
        enviarTrabajoADiscord(trabajo);

        // Limpiar los campos
        document.getElementById('titulo').value = '';
        document.getElementById('descripcion').value = '';
    }
});

function enviarTrabajoADiscord(trabajo) {
    const webhookURL = 'https://discord.com/api/webhooks/1294434757257592852/wCfTijvI_oBQl3kWXicN2BP_Tgn4UgKiRF1ZMlqPg4ZhdSugFQaf3Icw_diYb3Dk09bW'; // Reemplaza con tu URL de webhook

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: `Nuevo trabajo añadido:\n**Título:** ${trabajo.titulo}\n**Descripción:** ${trabajo.descripcion}`
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar el trabajo a Discord');
        }
        return response.json();
    })
    .then(data => {
        console.log('Trabajo enviado correctamente a Discord:', data);
        alert('Trabajo publicado y enviado a Discord.');
    })
    .catch(error => {
        console.error('Error al enviar el trabajo a Discord:', error);
        alert('Error al enviar el trabajo a Discord.');
    });
}

document.getElementById('borrar').addEventListener('click', function() {
    const listaTrabajos = document.getElementById('listaTrabajos');
    const trabajos = listaTrabajos.getElementsByClassName('trabajo');

    // Borrar todos los trabajos
    while (trabajos.length > 0) {
        eliminarTrabajoDeLocalStorage(trabajos[0].querySelector('input').value);
        listaTrabajos.removeChild(trabajos[0]);
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
    });

    trabajoDiv.appendChild(trabajoTitulo);
    trabajoDiv.appendChild(trabajoDescripcion);
    trabajoDiv.appendChild(eliminarBoton);
    listaTrabajos.appendChild(trabajoDiv);
}

function eliminarTrabajoDeLocalStorage(titulo) {
    const trabajos = JSON.parse(localStorage.getItem('trabajos')) || [];
    const trabajosFiltrados = trabajos.filter(trabajo => trabajo.titulo !== titulo);
    localStorage.setItem('trabajos', JSON.stringify(trabajosFiltrados));
}
