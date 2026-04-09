
const miembros = [
  { nombre: "Ana", apellido: "González", tipo: "Estudiante", correo: "ana1@mail.com", telefono: "912345678", actividad: "artistica" },
  { nombre: "Luis", apellido: "Pérez", tipo: "Funcionario", correo: "luis2@mail.com", telefono: "987654321", actividad: "deportiva" },
  { nombre: "Carla", apellido: "Ruiz", tipo: "Académico", correo: "carla3@mail.com", telefono: "956874321", actividad: "academica" },
  { nombre: "Pedro", apellido: "Soto", tipo: "Estudiante", correo: "pedro4@mail.com", telefono: "923456789", actividad: "social" },
  { nombre: "Marta", apellido: "López", tipo: "Funcionario", correo: "marta5@mail.com", telefono: "945678123", actividad: "tecnologica" },
  { nombre: "Jorge", apellido: "Ramírez", tipo: "Académico", correo: "jorge6@mail.com", telefono: "912367890", actividad: "bienestar" },
  { nombre: "Lucía", apellido: "Campos", tipo: "Estudiante", correo: "lucia7@mail.com", telefono: "934567812", actividad: "recreativa" },
  { nombre: "Sofía", apellido: "Torres", tipo: "Estudiante", correo: "sofia8@mail.com", telefono: "911223344", actividad: "artistica" },
  { nombre: "Diego", apellido: "Vargas", tipo: "Funcionario", correo: "diego9@mail.com", telefono: "922334455", actividad: "deportiva" },
  { nombre: "Paula", apellido: "Molina", tipo: "Académico", correo: "paula10@mail.com", telefono: "933445566", actividad: "academica" },
  { nombre: "Tomás", apellido: "Cruz", tipo: "Estudiante", correo: "tomas11@mail.com", telefono: "944556677", actividad: "social" },
  { nombre: "Valentina", apellido: "Rojas", tipo: "Funcionario", correo: "valentina12@mail.com", telefono: "955667788", actividad: "tecnologica" },
  { nombre: "Martín", apellido: "Fuentes", tipo: "Académico", correo: "martin13@mail.com", telefono: "966778899", actividad: "bienestar" },
  { nombre: "Camila", apellido: "Ortega", tipo: "Estudiante", correo: "camila14@mail.com", telefono: "977889900", actividad: "recreativa" },
  { nombre: "Andrés", apellido: "Silva", tipo: "Estudiante", correo: "andres15@mail.com", telefono: "988990011", actividad: "artistica" },
  { nombre: "Isabel", apellido: "Vega", tipo: "Funcionario", correo: "isabel16@mail.com", telefono: "999001122", actividad: "deportiva" },
  { nombre: "Felipe", apellido: "Castro", tipo: "Académico", correo: "felipe17@mail.com", telefono: "910112233", actividad: "academica" },
  { nombre: "Natalia", apellido: "Pinto", tipo: "Estudiante", correo: "natalia18@mail.com", telefono: "921223344", actividad: "social" },
  { nombre: "Sebastián", apellido: "Reyes", tipo: "Funcionario", correo: "sebastian19@mail.com", telefono: "932334455", actividad: "tecnologica" },
  { nombre: "Carolina", apellido: "Herrera", tipo: "Académico", correo: "carolina20@mail.com", telefono: "943445566", actividad: "bienestar" },
  { nombre: "Javier", apellido: "Rivas", tipo: "Estudiante", correo: "javier21@mail.com", telefono: "954556677", actividad: "recreativa" },
  { nombre: "María", apellido: "Salazar", tipo: "Estudiante", correo: "maria22@mail.com", telefono: "965667788", actividad: "artistica" },
  { nombre: "Ricardo", apellido: "Campos", tipo: "Funcionario", correo: "ricardo23@mail.com", telefono: "976778899", actividad: "deportiva" },
  { nombre: "Gabriela", apellido: "Rojas", tipo: "Académico", correo: "gabriela24@mail.com", telefono: "987889900", actividad: "academica" },
  { nombre: "Hugo", apellido: "Silva", tipo: "Estudiante", correo: "hugo25@mail.com", telefono: "998990011", actividad: "social" },
  { nombre: "Claudia", apellido: "Pérez", tipo: "Funcionario", correo: "claudia26@mail.com", telefono: "910001122", actividad: "tecnologica" },
  { nombre: "Daniel", apellido: "Lara", tipo: "Académico", correo: "daniel27@mail.com", telefono: "921112233", actividad: "bienestar" },
  { nombre: "Lorena", apellido: "Ortiz", tipo: "Estudiante", correo: "lorena28@mail.com", telefono: "932223344", actividad: "recreativa" },
  { nombre: "Alberto", apellido: "Méndez", tipo: "Estudiante", correo: "alberto29@mail.com", telefono: "943334455", actividad: "artistica" },
  { nombre: "Patricia", apellido: "Gómez", tipo: "Funcionario", correo: "patricia30@mail.com", telefono: "954445566", actividad: "deportiva" },
  { nombre: "Martina", apellido: "Gómez", tipo: "Estudiante", correo: "martina30@mail.com", telefono: "954478566", actividad: "deportiva" },
  { nombre: "Patricia", apellido: "Gómez", tipo: "Funcionario", correo: "patricia30@mail.com", telefono: "954445566", actividad: "deportiva" },
  { nombre: "Martina", apellido: "Luna", tipo: "Estudiante", correo: "martina38@mail.com", telefono: "911223344", actividad: "academica" },
  { nombre: "Benjamín", apellido: "Ríos", tipo: "Estudiante", correo: "benjamin39@mail.com", telefono: "922334455", actividad: "tecnologica" },
  { nombre: "Camila", apellido: "Paredes", tipo: "Estudiante", correo: "camila40@mail.com", telefono: "933445566", actividad: "bienestar" },
  { nombre: "Alejandro", apellido: "Vega", tipo: "Funcionario", correo: "alejandro41@mail.com", telefono: "944556677", actividad: "artistica" },
  { nombre: "Lorena", apellido: "Salinas", tipo: "Funcionario", correo: "lorena42@mail.com", telefono: "955667788", actividad: "social" },
  { nombre: "Rodrigo", apellido: "Herrera", tipo: "Funcionario", correo: "rodrigo43@mail.com", telefono: "966778899", actividad: "recreativa" },
  { nombre: "Marcos", apellido: "Cabrera", tipo: "Funcionario", correo: "marcos44@mail.com", telefono: "977889900", actividad: "academica" },
  { nombre: "Valeria", apellido: "Fuentes", tipo: "Funcionario", correo: "valeria45@mail.com", telefono: "988990011", actividad: "bienestar" }

];

function mostrarTabla(datos) {
    const tbody = document.querySelector("#tablaMiembros tbody");
    tbody.innerHTML = ""; // limpiar tabla

    datos.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${m.nombre}</td>
            <td>${m.apellido}</td>
            <td>${m.tipo}</td>
            <td>${m.correo}</td>
            <td>${m.telefono}</td>
            <td>${m.actividad}</td>
        `;
        tbody.appendChild(fila);
    });
}


function aplicarFiltros() {
    const tiposSeleccionados = Array.from(document.querySelectorAll(".filtro-tipo:checked")).map(i => i.value);
    const actividadesSeleccionadas = Array.from(document.querySelectorAll(".filtro-actividad:checked")).map(i => i.value);

    let datosFiltrados = miembros;

    if (tiposSeleccionados.length > 0) {
        datosFiltrados = datosFiltrados.filter(m => tiposSeleccionados.includes(m.tipo));
    }

    if (actividadesSeleccionadas.length > 0) {
        datosFiltrados = datosFiltrados.filter(m => actividadesSeleccionadas.includes(m.actividad));
    }

    mostrarTabla(datosFiltrados);
}


const botonFiltros = document.getElementById("aplicarFiltros");
botonFiltros.addEventListener("click", function(event){
    event.preventDefault(); 
    aplicarFiltros();
});


mostrarTabla(miembros);


let paginaActual = 1;
const filasPorPagina = 10; 

function mostrarPagina() {
    const tbody = document.querySelector("#tablaMiembros tbody");
    tbody.innerHTML = "";

    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    const paginaMiembros = datosFiltrados.slice(inicio, fin);

    paginaMiembros.forEach(m => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${m.nombre}</td>
            <td>${m.apellido}</td>
            <td>${m.tipo}</td>
            <td>${m.correo}</td>
            <td>${m.telefono}</td>
            <td>${m.actividad}</td>
        `;
        tbody.appendChild(fila);
    });

    crearBotonesPaginacion();
}

function crearBotonesPaginacion() {
    const div = document.getElementById("paginacion");
    const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);
    div.innerHTML = `
        <button id="prev" ${paginaActual === 1 ? "disabled" : ""}>Anterior</button>
        <span>Página ${paginaActual} de ${totalPaginas}</span>
        <button id="next" ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente</button>
    `;

    document.getElementById("prev").addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPagina();
        }
    });
    document.getElementById("next").addEventListener("click", () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarPagina();
        }
    });
}


datosFiltrados = [...miembros]; 
mostrarPagina();