Todos los pasos que he hecho para configurar bootstrap han sido apartir de la documentación oficial.

https://getbootstrap.com/

Estoy viendo la version 5.3.x

para el encabezado voy a partir de la etiqueta header.

Por lo que voy entendiendo de bootstrap es ir poniendo a las 
    etiquetas el atributo class e ir añadiedo atributos.


Para incluir el Css y JS de bootstrap:

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">




        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>


lo primero que voy a ver son los layout:


Grid System 
se basa en rejillas en concreto un total de 12.

vale entiendo que el container es como la caja donde tu estableces las medidas de esa etiqueta y que es a partir de ahi donde empiezas a construir todo.


La tabla de los distintos container que hay marcan cuando cogen el 100% del ancho apartir de los pixeles 

como yo quiero que mi header ocupe siempre el ancho de la pantalla lo que pongo es:
.container-fúid  que siempre ocupa el 100%


la verdad es que te tienes que fijar mucho en bootstrap y de su documentación para poder hacer que algo te salga como quieres.



gx-5 -> gx es añadir gap.







Se pueden añadir plugins gracias a javascrip, plugins de bootstrap

