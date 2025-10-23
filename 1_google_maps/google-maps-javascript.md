# 🗺️ Integración de Google Maps API con JavaScript

En este apartado explico cómo integré **Google Maps API** en mi proyecto, cómo gestioné la **clave de API de forma segura**, y de qué manera combiné la **geolocalización del usuario** con la **búsqueda del hospital más cercano**.

---

## 🔑 Carga de la API de Google Maps

Para no incluir la clave directamente en el código, la guardé en un archivo separado llamado `config.js`:

```js
const GOOGLE_MAPS_API_KEY = "PONES_TU_CODIGO_AQUI";
```

Luego, desde `index.html`, genero dinámicamente la URL del script para cargar la API usando esa variable:

```html
<script src="config.js"></script>
<script>
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async&libraries=places&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);
</script>
```

Con este enfoque, la clave nunca se sube al repositorio si `config.js` está incluido en el `.gitignore`.

---

## 🧭 Inicialización del mapa

La función `initMap()` es el **punto de entrada** que Google Maps ejecuta automáticamente cuando termina de cargar la API.

```js
let initMapResolve = null;
let initMapPromise = new Promise((resolve) => initMapResolve = resolve);

function initMap(){
    initMapResolve(); // Marca que la API ya está lista
}
```

Este patrón permite esperar a que el mapa esté completamente cargado **antes de interactuar con él**.  
Más adelante, utilizo esta promesa junto con la función `getUserPosition()` para sincronizar ambos procesos.

---

## 📍 Geolocalización del usuario

Para obtener la posición actual del usuario, aprovecho la API nativa del navegador:

```js
function getUserPosition(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}
```

Esto devuelve un objeto `coords` con latitud y longitud.  
Al combinarlo con la promesa de inicialización, puedo esperar a ambos eventos simultáneamente:

```js
const [_, userPositionData] = await Promise.all([
    initMapPromise,
    getUserPosition()
]);
```

---

## 🗺️ Creación del mapa

Una vez tengo la posición, creo el mapa y lo centro en el usuario:

```js
const userPosition = new google.maps.LatLng(
    userPositionData.coords.latitude,
    userPositionData.coords.longitude
);

const map = new google.maps.Map(document.getElementById("map"), {
    center: userPosition,
    zoom: 12,
});
```

También añado un marcador para indicar visualmente dónde se encuentra el usuario.

---

## 🏥 Búsqueda del hospital más cercano

Para encontrar el hospital más próximo, utilizo la **librería `places`** incluida en la carga inicial de la API.  
Con `google.maps.places.Place.searchNearby()` puedo realizar búsquedas por tipo (en este caso, “hospital”).

```js
function findNearestHospital(userPosition){
    return new Promise((resolve) => {
        let request = {
            fields: ['displayName', 'addressComponents', 'location'],
            locationRestriction: {
                center: userPosition,
                radius: 5000, // 5 km
            },
            includedPrimaryTypes: ["hospital"],
        };

        google.maps.importLibrary("places").then(() => {
            google.maps.places.Place.searchNearby(request)
                .then(results => resolve(results.places[0]));
        });
    });
}
```

---

## 🚶‍♂️ Trazado de la ruta al hospital

Cuando el usuario pulsa el botón **“Comenzar búsqueda”**, se calcula la ruta desde su posición actual hasta el hospital detectado usando el servicio de direcciones de Google Maps:

```js
document.querySelector("#button-location").addEventListener("click", async function(){
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    let request = {
        origin: userPosition,
        destination: hospitalPosition,
        travelMode: google.maps.TravelMode.WALKING,
    };

    directionsService.route(request, (response, status) => {
        if (status === "OK") directionsRenderer.setDirections(response);
    });
});
```

---

## 💡 Conclusión

Esta integración demuestra cómo unir **geolocalización**, **promesas asíncronas** y **servicios de Google Maps** de forma ordenada.  
El mapa no se carga hasta que todo está listo, el usuario puede ver su posición real y además se le muestra una ruta clara hacia el hospital más cercano.

Es una base sólida que más adelante se podría ampliar con filtros, información extra o incluso un modo de emergencia.