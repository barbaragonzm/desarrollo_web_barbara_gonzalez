// Variables del buscador
var inputBuscar   = document.getElementById("input-buscar");
var divResultados = document.getElementById("resultados-buscar");

// Variables del selector de nota 
var actividadActual = null;  // id de la actividad que se esta evaluando
var temporizador    = null;  // para el debounce

// Escuchar lo que escribe el usuario 
inputBuscar.addEventListener("input", function() {
    var texto = inputBuscar.value.trim();

    clearTimeout(temporizador);

    if (texto.length < 3) {
        divResultados.innerHTML = "";
        return;
    }

    // Esperamos antes de llamar al servidor
    temporizador = setTimeout(function() {
        fetchBuscar(texto);
    }, 350);
});


// Llamada fetch al servidor Spring Boot 
var fetchBuscar = function(texto) {
    fetch("http://localhost:8080/api/buscar?texto=" + encodeURIComponent(texto))
        .then(function(response) {
            return response.json();
        })
        .then(function(ajaxResponse) {
            mostrarResultados(ajaxResponse["data"], texto);
        })
        .catch(function(error) {
            console.error("Error en la busqueda:", error);
        });
};


// Mostrar los resultados en el div
function mostrarResultados(actividades, textoBuscado) {
    // Limpiar resultados anteriores
    divResultados.innerHTML = "";

    if (actividades.length === 0) {
        divResultados.innerHTML = "<p style='color:#888; font-style:italic; margin-top:10px;'>No se encontraron actividades para \"" + textoBuscado + "\".</p>";
        return;
    }

    for (var i = 0; i < actividades.length; i++) {
        var a = actividades[i];

        // Calcular texto de la nota
        var notaTexto;
        if (a.cantidadNotas === 0 || a.notaPromedio === null) {
            notaTexto = "-";
        } else {
            notaTexto = parseFloat(a.notaPromedio).toFixed(1);
        }

        var div = document.createElement("div");
        div.className = "resultado-buscar";
        div.setAttribute("data-id", a.id);
        div.innerHTML =
            "<h3>" + resaltar(a.nombre, textoBuscado) + "</h3>" +
            "<p><strong>Miembro:</strong> " + resaltar(a.nombreMiembro, textoBuscado) + "</p>" +
            "<p><strong>Día:</strong> " + a.dia + "</p>" +
            "<p><strong>Tipo:</strong> " + a.tipo + "</p>" +
            "<p><strong>Comuna:</strong> " + resaltar(a.comuna, textoBuscado) + "</p>" +
            "<p><strong>Descripción:</strong> " + resaltar(a.descripcion || "", textoBuscado) + "</p>" +
            "<div class='fila-nota'>" +
                "<span>Nota: <strong class='valor-nota'>" + notaTexto + "</strong></span>" +
                "<span class='cantidad-notas'>&nbsp;(" + a.cantidadNotas + " evaluaciones)</span>" +
                "&nbsp;&nbsp;" +
                "<button class='btn-evaluar' onclick='mostrarEvaluador(" + a.id + ", this)'>Evaluar</button>" +
                "<span class='evaluador' style='display:none; margin-left:10px;'>" +
                    "<select class='select-nota'>" +
                        "<option value='1'>1</option>" +
                        "<option value='2'>2</option>" +
                        "<option value='3'>3</option>" +
                        "<option value='4'>4</option>" +
                        "<option value='5' selected>5</option>" +
                        "<option value='6'>6</option>" +
                        "<option value='7'>7</option>" +
                    "</select>" +
                    "&nbsp;<button onclick='guardarNota(" + a.id + ", this)'>Confirmar</button>" +
                    "&nbsp;<button onclick='ocultarEvaluador(this)'>Cancelar</button>" +
                "</span>" +
            "</div>";

        divResultados.appendChild(div);
    }
}


// Resaltar el texto buscado 
function resaltar(texto, patron) {
    if (!texto || !patron) return texto || "";
    var patronEscapado = patron.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var regex = new RegExp(patronEscapado, "gi");
    return texto.replace(regex, function(match) {
        return "<mark>" + match + "</mark>";
    });
}


// Mostrar/ocultar el selector de nota 
function mostrarEvaluador(idActividad, boton) {
    var filaNote = boton.parentElement;
    filaNote.querySelector(".evaluador").style.display = "inline";
    boton.style.display = "none";
}

function ocultarEvaluador(botonCancelar) {
    var evaluador = botonCancelar.parentElement;
    var filaNota  = evaluador.parentElement;
    evaluador.style.display = "none";
    filaNota.querySelector(".btn-evaluar").style.display = "inline";
}


// Guardar la nota con fetch POST (llamada asincrona)
function guardarNota(idActividad, botonConfirmar) {
    var evaluador = botonConfirmar.parentElement;
    var nota = parseInt(evaluador.querySelector(".select-nota").value, 10);

    // Validacion en el cliente
    if (isNaN(nota) || nota < 1 || nota > 7) {
        alert("La nota debe ser un numero entero entre 1 y 7.");
        return;
    }

    fetch("http://localhost:8080/api/actividades/" + idActividad + "/nota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota: nota })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.ok) {
            // Actualizar la nota y el contador en pantalla sin recargar
            var card = document.querySelector(".resultado-buscar[data-id='" + idActividad + "']");
            var notaTexto = parseFloat(data.notaPromedio).toFixed(1);
            card.querySelector(".valor-nota").textContent = notaTexto;
            card.querySelector(".cantidad-notas").textContent = " (" + data.cantidadNotas + " evaluaciones)";
            // Ocultar el evaluador
            ocultarEvaluador(botonConfirmar);
        } else {
            alert(data.mensaje);
        }
    })
    .catch(function(error) {
        console.error("Error al guardar la nota:", error);
    });
}
