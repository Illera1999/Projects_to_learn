# 🎨 Configuración y uso de Bootstrap

Para el diseño del proyecto decidí usar **Bootstrap**, un framework CSS muy potente que permite crear estructuras visuales de forma sencilla y con un estilo moderno.

Toda la configuración la realicé siguiendo la **documentación oficial**:  
[https://getbootstrap.com/](https://getbootstrap.com/)  
(Estoy trabajando con la versión **5.3.x**.)

---

## 🚀 Inclusión de Bootstrap en el proyecto

Bootstrap necesita dos cosas para funcionar correctamente:  
1. El archivo CSS (para los estilos visuales).  
2. El archivo JS (para los componentes interactivos).

En mi caso, los añadí directamente desde un **CDN** en el `<head>` y justo antes del cierre de `<body>`:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
```

---

## 🧩 Entendiendo el sistema de rejilla (Grid System)

Bootstrap se basa en un sistema de **rejillas de 12 columnas** que permite crear diseños flexibles y adaptables.  
El elemento base de todo el sistema es el **container**, que actúa como el contenedor principal del contenido.

Hay tres tipos principales de contenedores:

| Tipo | Descripción |
|------|--------------|
| `.container` | Fijo. Se adapta al ancho del dispositivo, pero con márgenes laterales. |
| `.container-fluid` | Ocupa el 100% del ancho de la pantalla en todo momento. |
| `.container-{breakpoint}` | Cambia de comportamiento según el tamaño de pantalla (por ejemplo, `.container-md`). |

Para mi proyecto, quise que el **encabezado** ocupe todo el ancho, por lo que usé:

```html
<h1 class="titulo container-fluid">Búsqueda del hospital más cercano</h1>
```

De esta forma, el título se expande de borde a borde sin importar el tamaño del dispositivo.

---

## 🧱 Clases útiles que he utilizado

- `gx-5` → Añade espacio horizontal (gap) entre columnas.  
- `p-3` → Aplica **padding** (relleno) interno en los elementos.  
- `border` → Dibuja un borde alrededor del componente.  
- `bg-light`, `bg-primary`, `bg-success` → Controlan los colores de fondo.  
- `text-center` → Centra el texto horizontalmente.

Estas clases son reutilizables y permiten construir una estructura visual limpia sin necesidad de escribir CSS adicional.

---

## 🧠 Reflexión técnica

Lo que más me gusta de Bootstrap es que **te obliga a pensar en estructura**, no solo en colores o tamaños.  
Cada elemento tiene su papel dentro del sistema: primero creas el *esqueleto* con contenedores y columnas, y luego lo vas afinando con pequeñas clases utilitarias.

Aunque al principio cuesta entender el “por qué” de tantas clases (`container`, `row`, `col-md-*`), una vez lo interiorizas puedes montar layouts complejos en minutos.

---

## 🧩 Plugins con JavaScript

Bootstrap también permite integrar **comportamientos dinámicos** mediante sus plugins de JavaScript, como menús desplegables, modales o tooltips.  
En mi caso, no los he necesitado aún, pero los tengo listos porque el archivo `bootstrap.bundle.min.js` ya los incluye.

Esto facilita que, si en el futuro quiero añadir botones interactivos o cuadros de diálogo, no tenga que instalar nada extra.

---

## ✅ Conclusión

Gracias a Bootstrap, puedo mantener un **diseño limpio y consistente**, centrando mis esfuerzos en la parte lógica del proyecto (la API de Google Maps y la geolocalización).

La clave ha sido entender la estructura base (contenedores, filas y columnas) y aprovechar las clases utilitarias que el framework ya ofrece.