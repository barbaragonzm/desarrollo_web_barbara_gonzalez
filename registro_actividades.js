//Validacion formulario registro de actividades 

document.getElementById("form-actividad").addEventListener("submit", function(event){
    event.preventDefault();

    
    const nombreActividad = document.getElementById("nombre-actividad").value;
    const tipoActividad = document.getElementById("tipo-actividad").value;
    const horasActividad = document.getElementById("horas").value;
    const linkActividad = document.getElementById("link").value;

    const diasChecks = document.querySelectorAll("input[name='dias[]']:checked");
    const diasSeleccionados = [];
    diasChecks.forEach(d => diasSeleccionados.push(d.value));

    let formularioValido = true;
    let errores = [];

    
    if(nombreActividad === "" || nombreActividad.length < 3){
        formularioValido = false;
        errores.push("Nombre actividad invalido")
    }
    if(tipoActividad === ""){
        formularioValido = false;
        errores.push("Tipo actividad invalido")
    }

     if(diasSeleccionados.length === 0 ){
        formularioValido = false;
        errores.push("No selecciono dias")

    }

    if(horasActividad === "" || horasActividad < 1 || horasActividad > 168){
        formularioValido = false;
        errores.push("Horas dedicadas invalidas")
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
    } 
    event.target.reset();
    
    
});