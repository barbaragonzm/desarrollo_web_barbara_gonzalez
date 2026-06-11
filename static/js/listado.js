let paginaActual = 1;
const filasPorPagina = 5;
let datosFiltrados = [];
let actividadIdActual = null;

// Paginación y tabla

function mostrarPagina() {
    const tbody = document.getElementById("cuerpoTabla");
    if (!tbody) return;
    tbody.innerHTML = "";

    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const items = datosFiltrados.slice(inicio, fin);

    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#888;">No se encontraron resultados.</td></tr>';
    } else {
        items.forEach(m => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${m.nombre}</td>
                <td>${m.tipo_persona}</td>
                <td>${m.email}</td>
                <td>${m.nombre_act}</td>
                <td>${m.tipo_act}</td>
                <td>${m.dia} / ${m.hora}</td>
                <td>${m.foto_ruta ? `<img src="${m.foto_ruta}" width="70" style="border-radius:4px;">` : 'Sin foto'}</td>
                <td><button class="btn-detalle" data-id="${m.id}"
                        data-nombre="${m.nombre_act}"
                        data-tipo="${m.tipo_act}"
                        data-dia="${m.dia}"
                        data-hora="${m.hora}"
                        data-duracion="${m.duracion}"
                        data-desc="${m.descripcion}"
                        data-miembro="${m.nombre}">Ver detalle</button></td>
            `;
            tbody.appendChild(fila);
        });
    }

    crearBotonesPaginacion();

    // Eventos en botones 
    document.querySelectorAll('.btn-detalle').forEach(btn => {
        btn.addEventListener('click', function() {
            abrirModal(this.dataset);
        });
    });
}

function crearBotonesPaginacion() {
    const div = document.getElementById("paginacion");
    const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina) || 1;

    div.innerHTML = `
        <button id="prev" ${paginaActual === 1 ? "disabled" : ""}>Anterior</button>
        <span> Página ${paginaActual} de ${totalPaginas} </span>
        <button id="next" ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente</button>
    `;
    document.getElementById("prev").onclick = () => { if (paginaActual > 1) { paginaActual--; mostrarPagina(); }};
    document.getElementById("next").onclick = () => { if (paginaActual < totalPaginas) { paginaActual++; mostrarPagina(); }};
}

function aplicarFiltros() {
    const nombre = document.getElementById("buscadorNombre")?.value || "";
    const tipos = Array.from(document.querySelectorAll(".filtro-tipo:checked")).map(i => i.value);
    const acts = Array.from(document.querySelectorAll(".filtro-actividad:checked")).map(i => i.value);

    let url = `/obtener_actividades?nombre=${encodeURIComponent(nombre)}`;
    tipos.forEach(t => url += `&tipos[]=${t}`);
    acts.forEach(a => url += `&actividades[]=${a}`);

    fetch(url)
        .then(r => r.json())
        .then(data => {
            datosFiltrados = data.actividades;
            paginaActual = 1;
            mostrarPagina();
        })
        .catch(() => {
            document.getElementById("cuerpoTabla").innerHTML =
                '<tr><td colspan="8" style="color:red;">Error al cargar datos.</td></tr>';
        });
}

document.getElementById("aplicarFiltros").addEventListener("click", e => {
    e.preventDefault();
    aplicarFiltros();
});

// Aplicar filtros al cargar
aplicarFiltros();

// Modal  + comentarios

function abrirModal(dataset) {
    actividadIdActual = dataset.id;

    document.getElementById("modal-titulo").textContent = dataset.nombre;
    document.getElementById("modal-contenido").innerHTML = `
        <div class="detalle-campo"><strong>Miembro:</strong> ${dataset.miembro}</div>
        <div class="detalle-campo"><strong>Tipo:</strong> ${dataset.tipo}</div>
        <div class="detalle-campo"><strong>Día:</strong> ${dataset.dia}</div>
        <div class="detalle-campo"><strong>Hora de inicio:</strong> ${dataset.hora}</div>
        <div class="detalle-campo"><strong>Duración:</strong> ${dataset.duracion}</div>
        <div class="detalle-campo"><strong>Descripción:</strong> ${dataset.desc || 'Sin descripción'}</div>
    `;

    // Limpiar formulario y mensajes
    document.getElementById("input-nombre-com").value = "";
    document.getElementById("input-texto-com").value = "";
    document.getElementById("errores-comentario").innerHTML = "";
    document.getElementById("msg-comentario").textContent = "";

    // Abrir modal
    document.getElementById("modal-overlay").classList.add("activo");

    // Cargar comentarios
    cargarComentarios(actividadIdActual);
}

function cerrarModal() {
    document.getElementById("modal-overlay").classList.remove("activo");
    actividadIdActual = null;
}

document.getElementById("modal-cerrar").addEventListener("click", cerrarModal);
document.getElementById("modal-overlay").addEventListener("click", function(e) {
    if (e.target === this) cerrarModal();
});

//  Carga de comentarios (fetch GET) 

function cargarComentarios(actividadId) {
    const contenedor = document.getElementById("lista-comentarios");
    contenedor.innerHTML = '<p style="color:#888;font-style:italic;">Cargando comentarios...</p>';

    fetch(`/actividad/${actividadId}/comentarios`)
        .then(r => r.json())
        .then(data => {
            if (data.comentarios.length === 0) {
                contenedor.innerHTML = '<p style="color:#aaa;font-style:italic;">Aún no hay comentarios. ¡Sé el primero!</p>';
            } else {
                contenedor.innerHTML = data.comentarios.map(c => `
                    <div class="comentario-item">
                       <div class="com-meta">${c.fecha} — <strong>${c.nombre}</strong></div>
                       <div class="com-texto">${c.texto}</div>
                    </div>
                `).join('');
            }
        })
        .catch(() => {
            contenedor.innerHTML = '<p style="color:#c0392b;">Error al cargar los comentarios.</p>';
        });
}

// Agregar comentario 

document.getElementById("btn-agregar-comentario").addEventListener("click", function() {
    const nombre = document.getElementById("input-nombre-com").value.trim();
    const texto = document.getElementById("input-texto-com").value.trim();
    const errDiv = document.getElementById("errores-comentario");
    const msgDiv = document.getElementById("msg-comentario");

    errDiv.innerHTML = "";
    msgDiv.textContent = "";

    // Validación en el cliente
    const errores = [];
    if (nombre.length < 3 || nombre.length > 80) {
        errores.push("El nombre debe tener entre 3 y 80 caracteres.");
    }
    if (texto.length < 5) {
        errores.push("El comentario debe tener al menos 5 caracteres.");
    }
    if (errores.length > 0) {
        errDiv.innerHTML = "<ul>" + errores.map(e => `<li>${e}</li>`).join("") + "</ul>";
        return;
    }

    const btn = document.getElementById("btn-agregar-comentario");
    btn.disabled = true;
    btn.textContent = "Enviando...";

    fetch(`/actividad/${actividadIdActual}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre, texto: texto })
    })
    .then(r => r.json().then(data => ({ status: r.status, data })))
    .then(({ status, data }) => {
        if (status === 201) {
            //  limpiar campos y recargar lista
            document.getElementById("input-nombre-com").value = "";
            document.getElementById("input-texto-com").value = "";
            msgDiv.textContent = "¡Comentario agregado con éxito!";
            cargarComentarios(actividadIdActual);
        } else {
            // Error del servidor
            const listaErr = data.errores || ["Error inesperado al guardar el comentario."];
            errDiv.innerHTML = "<ul>" + listaErr.map(e => `<li>${e}</li>`).join("") + "</ul>";
        }
    })
    .catch(() => {
        errDiv.innerHTML = "<ul><li>Error de red. Por favor intenta nuevamente.</li></ul>";
    })
    .finally(() => {
        btn.disabled = false;
        btn.textContent = "Agregar comentario";
    });
});

