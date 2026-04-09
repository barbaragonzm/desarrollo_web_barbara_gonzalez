# Proyecto de Registro de Actividades 

Este proyecto consiste en una plataforma web para que los integrantes de la comunidad del DCC puedan registrar las actividades que realizan en su tiempo libre.s.

## Estructura 
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




