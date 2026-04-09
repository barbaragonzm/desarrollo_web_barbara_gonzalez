
let totalMiembros = 610;
document.getElementById("total-miembros").textContent = totalMiembros;

document.getElementById("registro-miembro").addEventListener("submit", function(event){
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const tipo = document.getElementById("tipo-integrante").value;
    const telefono = document.getElementById("telefono").value;
    let formularioValido = true;
    let errores = [];

    if(nombre === "" || nombre.length < 2){
        formularioValido = false;
        errores.push("Nombre invalido")
    }
    if(apellido === "" || apellido.length < 2){
        formularioValido = false;
        errores.push("Apellido invalido")
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email === "" || !emailRegex.test(email)){
    formularioValido = false;
    errores.push("Email invalido")
    }

     
    const telefonoNum = Number(telefono);
    if(telefono.length !== 9 || telefono[0] !== "9" || isNaN(telefonoNum)) {
        formularioValido = false;
        errores.push("Telefono invalido")
    }

     if(tipo === ""){
        formularioValido = false;
        errores.push("Tipo de integrante invalido")
     }

    const listErrores = document.getElementById("errores");

    if(!formularioValido){
        listErrores.innerHTML = "<ul>" + errores.map(e => `<li>${e}</li>`).join("") + "</ul>";
    } else {
        
        listErrores.innerHTML = "";

        const listaMiembros = document.getElementById("lista-miembros");
        listaMiembros.innerHTML += `
            <div class="miembro-item">
                <span class="nombre">${nombre}</span>
                <span class="apellido">${apellido}</span>
                <span class="tipo">${tipo}</span>
                <span class="email">${email}</span>
                <span class="telefono">${telefono}</span>
            </div>
        `;

        totalMiembros++;
        document.getElementById("total-miembros").textContent = totalMiembros;
        event.target.reset();
    }
});

