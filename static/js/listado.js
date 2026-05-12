
let paginaActual = 1;
const filasPorPagina = 5; 
let datosFiltrados = []; 


function mostrarPagina() {
    const tbody = document.getElementById("cuerpoTabla");
    if (!tbody) {
        console.error("No se encontró el elemento con ID 'cuerpoTabla' en el HTML");
        return;
    }

    tbody.innerHTML = ""; 
  

    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const itemsParaMostrar = datosFiltrados.slice(inicio, fin);

    itemsParaMostrar.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${m.nombre}</td>
            <td>${m.tipo_persona}</td>
            <td>${m.email}</td>
            <td>${m.nombre_act}</td>
            <td>${m.tipo_act}</td>
            <td>${m.dia} / ${m.hora}</td>
            <td>
                ${m.foto_ruta ? `<img src="${m.foto_ruta}" width="80">` : 'Sin foto'}
            </td>
            <td><a href="#">Ver más</a></td>
            <td>${m.descripcion || ''}</td>
        `;
        tbody.appendChild(fila);
    });

    crearBotonesPaginacion();
}


function aplicarFiltros() {
    const inputBusqueda = document.getElementById("buscadorNombre");
    const nombre = inputBusqueda ? inputBusqueda.value : "";
    const tipos = Array.from(document.querySelectorAll(".filtro-tipo:checked")).map(i => i.value);
    const actividades = Array.from(document.querySelectorAll(".filtro-actividad:checked")).map(i => i.value);

    let url = `/obtener_actividades?nombre=${encodeURIComponent(nombre)}`;
    tipos.forEach(t => url += `&tipos[]=${t}`);
    actividades.forEach(a => url += `&actividades[]=${a}`);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            datosFiltrados = data.actividades; 
            paginaActual = 1; 
            mostrarPagina();
        });
}


function crearBotonesPaginacion() {
    const div = document.getElementById("paginacion");
    const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina) || 1;
    
    div.innerHTML = `
        <button id="prev" ${paginaActual === 1 ? "disabled" : ""}>Anterior</button>
        <span>Página ${paginaActual} de ${totalPaginas}</span>
        <button id="next" ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente</button>
    `;

    document.getElementById("prev").onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPagina();
        }
    };
    
    document.getElementById("next").onclick = () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarPagina();
        }
    };
}


document.getElementById("aplicarFiltros").addEventListener("click", function(event){
    event.preventDefault(); 
    aplicarFiltros();
});


aplicarFiltros();