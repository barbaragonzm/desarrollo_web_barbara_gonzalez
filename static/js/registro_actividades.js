//Validacion formulario registro de actividades 

document.getElementById("form-actividad").addEventListener("submit", function(event){
    event.preventDefault();

    const miembroId = document.getElementById("miembro_id").value;
    const nombreActividad = document.getElementById("nombre-actividad").value;
    const tipoActividad = document.getElementById("tipo-actividad").value;
    const linkActividad = document.getElementById("link").value;
    const horaInicio = document.getElementById("hora_inicio").value;
    const duracion = document.getElementById("duracion").value;
    const descripcion = document.getElementById("descripcion").value;
    const dia = document.getElementById("dia").value;

    let formularioValido = true;
    let errores = [];

    if (miembroId === "") {
    formularioValido = false;
    errores.push("Debe seleccionar el miembro que realiza la actividad.");
    }

    if(nombreActividad === "" || nombreActividad.length < 3){
        formularioValido = false;
        errores.push("Nombre actividad invalido")
    }
    if(tipoActividad === ""){
        formularioValido = false;
        errores.push("Tipo actividad invalido")
    }

     if(dia === ""){
        formularioValido = false;
        errores.push("No selecciono dia")

    }

    if(horaInicio === ""){
        formularioValido = false;
        errores.push("Hora de inicio invalida")
    }

    if (duracion === "" || duracion === "00:00") {
    formularioValido = false;
    errores.push("La duración debe ser mayor a 0.");
    }

    if (descripcion.length < 5) {
    formularioValido = false;
    errores.push("Por favor, agregue una descripción breve (mínimo 5 caracteres).");
    }

    if(linkActividad === "" || (linkActividad !=="" && !linkActividad.startsWith("http"))){
        formularioValido = false;
        errores.push("Enlace invalido")
    }

    const listErrores = document.getElementById("errores");

    if(!formularioValido){
        listErrores.innerHTML = "<ul>" + errores.map(e => `<li>${e}</li>`).join("") + "</ul>";
    }else{
        const mensaje = document.getElementById("mensaje-actividad");
        mensaje.textContent = `¡Su actividad "${nombreActividad}" fue registrada con éxito!`;
        mensaje.style.color = "#1f6feb"; 
        mensaje.style.fontWeight = "bold";


        this.submit();
    } 
    
});