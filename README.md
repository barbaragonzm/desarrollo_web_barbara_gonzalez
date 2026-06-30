# Proyecto de Registro de Actividades 
# Documentacion Tarea 1
Este proyecto consiste en una plataforma web para que los integrantes de la comunidad del DCC puedan registrar las actividades que realizan en su tiempo libre.s.

### Estructura 
Para este proyecto se decidió dividir el contenido en 5 páginas independientes en lugar de una sola. Las páginas se distribuyen en una página principal  y cuatro secciones específicas para cada tipo de requerimiento.
Esta decisión se tomó por las siguientes razones:
* **Orden:** Al separar las funciones en páginas distintas,tenemos mayor orden y el usuario tendra mayor claridad de la informacion que presenta cada pagina.
* **Navegación sencilla:** Permite que cada sección tenga su propio espacio, facilitando la edición y el mantenimiento del código.

### Diseño 
Se utilizaron etiquetas de HTML para organizar los formularios y el contenido de manera lógica. Para el diseño, se crearon clases de CSS que se comparten en las 5 páginas. Esto  para que todos los botones, cuadros de texto y títulos se vean exactamente iguales en cualquier parte del sitio,logrando una unicidad en la pagina.

### Archivos separados 
En lugar de tener un solo archivo JS, se creó un archivo JS independiente para cada página que tiene funciones interactivas.Esto se realizo principalmente para evitar errores.Al tener un archivo por página, el navegador no intenta buscar botones o cuadros de texto que pertenecen a otras secciones, lo que evita fallos en el código. Cada página carga solamente las instrucciones que necesita en ese momento, y si algo falla en una página específica, se sabe exactamente qué archivo revisar sin miedo a afectar el resto.

### Simulación
Todo el sistema funciona como una simulación. No hay una base de datos real guardando la información permanentemente, la pagina cuenta con la lógica necesaria para mostrar cómo se verían los listados de actividades y las métricas de participación de la comunidad. Los formularios incluyen validaciones para asegurar que el usuario ingrese datos correctos (como correos válidos o números de horas reales) antes de mostrar el mensaje de éxito.

### Decisiones 
Se tomo la decision de poner en el formulario de registro de actividades, los dias de la semana en formato de cajitras seleccionables para el usuario asi es mas dinamico y permite que el usuario seleccione uno o mas dias de la semana en que realiza o realizo esa actividad.

Igualmente en los filtros del listado se aplico la misma logica para que el usuario modificara los filtros a su gusto.Los filtros son de tipo de miembro y tipo de actividad, ya que creo que en la practica serviria mas hacer este tipo de filtro para las metricas, ya que  es mucho mas interesante ver que actividades hacen los funcionarios o estudiantes, o cuanta gente realiza cierto tipo de actividad.

# Documentación de la Tarea 2 
Para el desarrollo de esta aplicación decidí organizar el proyecto siguiendo la estructura recomendada por Flask, separando la lógica del servidor en el archivo principal y ordenando todos los elementos visuales en carpetas específicas. Esto me permitió trabajar de forma más ordenada, dejando los archivos HTML dentro de la carpeta de plantillas y los estilos o scripts de JavaScript en la carpeta de archivos estáticos.

Uno de los cambios más importantes que realicé fue ajustar la base de datos que venía originalmente. Me di cuenta de que al intentar registrar algunas actividades, el sistema arrojaba errores porque los nombres o las categorías eran muy largos o no coincidían exactamente con lo que el formulario enviaba. Por esta razón, edité el archivo SQL para ampliar el espacio de los textos y actualicé las categorías permitidas para que incluyeran opciones más modernas que hacían falta, como programación o bienestar. 

En cuanto al manejo de las imágenes, elegí guardar las fotos en una carpeta dedicada dentro del proyecto y solo registrar la ruta y el nombre en la base de datos. Además, en el listado de actividades, tuve que programar una lógica especial en JavaScript para que, si una actividad tiene varias fotos, el sistema sepa organizarlas correctamente sin mezclar la información de los diferentes miembros.

Finalmente, configuré el archivo de la aplicación con el usuario y la contraseña solicitados en el curso para que el evaluador pueda ejecutarlo sin tener que modificar el código, ya que habia estado trabajando con una conexion local con otro root.

# Documentacion Tarea 3 
Se agregaron tres funcionalidades nuevas:
estadísticas con gráficos reales, sistema de comentarios en actividades,
y buscador de miembros en el formulario de registro de actividades.

### Estadísticas
Se modifico la pagina que anteriormente se llamaba Metricas por una llamada Estadisticas donde se muestran  tres gráficos hechos con Chart.js.
Los datos son reales y se obtienen desde la base de datos con fetch.
- Gráfico de líneas: muestra cuántos miembros se registraron por día
- Gráfico de torta: muestra cuántas actividades hay de cada tipo
- Gráfico de barras: muestra cuántas actividades tienen los miembros de cada comuna

### Comentarios en actividades
Se agregó una tabla comentario a la base de datos. En el listado de actividades
hay un botón "Ver detalle" que abre un modal con la info de la actividad y sus comentarios.
Desde ahí también se puede agregar un nuevo comentario. Todo funciona con fetch, sin
recargar la página.

### Buscador de miembros
En el formulario de registro de actividades se reemplazó el select por un buscador.
El usuario escribe el nombre y aparecen sugerencias. Los datos se cargan con fetch. Implemente esto ya que al ingresar mas miembros la lista era muy larga y era poco practico para el usuario buscar manualmente el miembro con el que queria registrar la actividad.


# Documentacion Tarea 4
Se agregaron dos funcionalidades nuevas usando Spring Boot y fetch:
buscador de actividades y sistema de evaluación (notas) para esas actividades.

 
### Buscador de actividades
En el listado de actividades se agregó un input de texto. Cuando el usuario
escribe 3 caracteres o más, automáticamente se busca en el nombre, la
descripción y la comuna de la actividad, sin tener que apretar ningún botón. Las coincidencias del texto buscado quedan resaltadas en
los resultados. Si no encuentra nada, muestra un mensaje en vez de dejar la
sección vacía.
 
### Evaluación de actividades (notas)
Se agregó una tabla nota a la base de datos, donde cada fila es una
evaluación individual de una actividad (no se guarda un solo número fijo,
para poder tener varias evaluaciones de distintas personas y sacar un
promedio). En cada resultado del buscador aparece la nota actual de la
actividad (o un guión si todavía no tiene ninguna) y un botón "Evaluar" que
despliega un selector del 1 al 7. Al confirmar, se valida que sea un número
entero entre 1 y 7 (en el JavaScript y también en el backend, por si alguien
intenta mandar un valor inválido directo a la API) y se guarda la nota nueva.
El promedio y el contador de evaluaciones se actualizan al toque en la
pantalla, sin recargar la página, porque la nota se manda con fetch.
 
### Por qué Flask y Spring Boot a la vez
No pedian migrar todo el proyecto a Spring Boot, asi que  Flask sigue sirviendo toda la página (puerto 5000) y Spring Boot solo
expone la API del buscador y las notas (puerto 8080). Como son dos puertos
distintos, el navegador los trata como orígenes distintos, así que tuve que
agregar configuración CORS en el backend de Spring Boot para que las
peticiones fetch no quedaran bloqueadas.