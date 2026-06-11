// Cargar miembros desde el servidor al iniciar la página
let MIEMBROS_DATA = [];

fetch("/api/miembros")
    .then(r => r.json())
    .then(data => { MIEMBROS_DATA = data; })
    .catch(() => console.error("No se pudieron cargar los miembros."));


//  Validación del formulario 

document.getElementById("form-actividad").addEventListener("submit", function(event) {
    event.preventDefault();

    // Armar duración desde los dos selects
    const horas = document.getElementById("duracion_horas").value.padStart(2, "0");
    const minutos = document.getElementById("duracion_minutos").value;
    document.getElementById("duracion").value = horas + ":" + minutos;

    const miembroId      = document.getElementById("miembro_id").value;
    const nombreActividad = document.getElementById("nombre-actividad").value;
    const tipoActividad  = document.getElementById("tipo-actividad").value;
    const linkActividad  = document.getElementById("link").value;
    const horaInicio     = document.getElementById("hora_inicio").value;
    const duracion       = document.getElementById("duracion").value;
    const descripcion    = document.getElementById("descripcion").value;
    const dia            = document.getElementById("dia").value;

    let formularioValido = true;
    let errores = [];

    if (!miembroId || miembroId === "") {
        formularioValido = false;
        errores.push("Debe seleccionar un miembro de la lista de sugerencias.");
    }

    if (nombreActividad === "" || nombreActividad.length < 3) {
        formularioValido = false;
        errores.push("Nombre de actividad inválido (mínimo 3 caracteres).");
    }

    if (tipoActividad === "") {
        formularioValido = false;
        errores.push("Debe seleccionar un tipo de actividad.");
    }

    if (dia === "") {
        formularioValido = false;
        errores.push("Debe seleccionar un día.");
    }

    if (horaInicio === "") {
        formularioValido = false;
        errores.push("Hora de inicio inválida.");
    }

    if (duracion === "" || duracion === "00:00") {
        formularioValido = false;
        errores.push("La duración debe ser mayor a 0.");
    }

    if (descripcion.length < 5) {
        formularioValido = false;
        errores.push("La descripción debe tener al menos 5 caracteres.");
    }

    if (linkActividad === "" || !linkActividad.startsWith("http")) {
        formularioValido = false;
        errores.push("Enlace inválido (debe comenzar con http).");
    }

    const listErrores = document.getElementById("errores");

    if (!formularioValido) {
        listErrores.innerHTML = "<ul>" + errores.map(e => `<li>${e}</li>`).join("") + "</ul>";
    } else {
        listErrores.innerHTML = "";
        const mensaje = document.getElementById("mensaje-actividad");
        mensaje.textContent = `¡Su actividad "${nombreActividad}" fue registrada con éxito!`;
        mensaje.style.color = "#1f6feb";
        mensaje.style.fontWeight = "bold";
        this.submit();
    }
});


//  Buscador de miembros con autocompletado 

const inputBuscador = document.getElementById("buscador-miembro");
const inputHidden   = document.getElementById("miembro_id");
const listaSug      = document.getElementById("sugerencias-miembro");

inputBuscador.addEventListener("input", function() {
    const texto = this.value.trim().toLowerCase();
    inputHidden.value = "";
    listaSug.innerHTML = "";

    if (texto.length < 1) { listaSug.style.display = "none"; return; }

    const coincidencias = MIEMBROS_DATA.filter(m =>
        m.nombre.toLowerCase().includes(texto)
    ).slice(0, 8);

    if (coincidencias.length === 0) { listaSug.style.display = "none"; return; }

    coincidencias.forEach(m => {
        const li = document.createElement("li");
        li.textContent = m.nombre;
        li.style.cssText = "padding:8px 12px; cursor:pointer; border-bottom:1px solid #f0f0f0; font-size:0.95rem;";
        li.addEventListener("mouseenter", () => li.style.background = "#e8f0fe");
        li.addEventListener("mouseleave", () => li.style.background = "#fff");
        li.addEventListener("click", () => {
            inputBuscador.value = m.nombre;
            inputHidden.value   = m.id;
            listaSug.style.display = "none";
        });
        listaSug.appendChild(li);
    });
    listaSug.style.display = "block";
});

document.addEventListener("click", function(e) {
    if (!inputBuscador.contains(e.target) && !listaSug.contains(e.target)) {
        listaSug.style.display = "none";
    }
});