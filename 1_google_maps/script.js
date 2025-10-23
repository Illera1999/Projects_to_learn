
let initMapResolve = null;
let initMapPromise =  new Promise((resolve) => initMapResolve = resolve);

function initMap(){
    initMapResolve(); // Resuelve la promesa cuando la API de Google Maps está lista
}

window.addEventListener("DOMContentLoaded", async function(){
    let map;
    let userPosition;
    let hospitalPosition;

    // Hasta que no se resuelva la promesa no tiene valor por ende debería esperarse
    //const gml = await initMapPromise; // Espera a que la API de Google Maps esté lista
    //const position = await getUserPosition(); // Espera a que se obtenga la posición del usuario
    const value = await Promise.all([
        initMapPromise, 
        getUserPosition()
    ]); // Espera a que ambas promesas se resuelvan

    console.log(value[1].coords)
    
    userPosition = new google.maps.LatLng(
        value[1].coords.latitude,
        value[1].coords.longitude,
    );
    map = new google.maps.Map(
        document.getElementById("map"), 
        {
        center: { lat: 27.9202, lng: -15.5477 },
        zoom: 10,
        },
    );

    console.log("Posición del usuario:", userPosition);
    map.panTo(userPosition); // Centra el mapa en la posición del usuario
    map.setZoom(12); // Acerca el zoom

    const hospital = await findNearestHospital(userPosition);

    
    hospitalPosition = new google.maps.LatLng(
        hospital.location.lat(),
        hospital.location.lng(),
    );
    console.log("Hospital más cercano:", hospital);


    //userMarker = new google.maps.Marker({
    //    position: userPosition,
    //    map: map,
    //    title: "Tu posición",
    //});

    // es mas potente hacerlo con una querySelector
    document.getElementById("hospital-name").innerHTML = hospital.displayName;
    document.getElementById("hospital-address").innerHTML = hospital.addressComponents.filter((ac) => ac.types.includes("route")).shift().longText;


    this.document.querySelector("#button-location").addEventListener("click", async function(){
        let directionsService =  new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        let request = {
            origin: userPosition,
            destination: hospitalPosition,
            travelMode: google.maps.TravelMode['WALKING'],
        }


        directionsService.route(request, function(response, status){
            if(status == "OK"){
                directionsRenderer.setDirections(response);
            }
        });
    });
});

// Devuelve la promesa con la posición del usuario
function getUserPosition(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position);
        }, (error) => {
            reject(error);
        });
    });
}

function findNearestHospital(userPosition){
    // Aquí iría la lógica para encontrar el hospital más cercano
    return new Promise((resolve, reject) => {
        let request = {
            fields: ['displayName', 'addressComponents', 'location'],
            locationRestriction: {
                center: userPosition,
                radius: 5000, // 5 km
            },
            includedPrimaryTypes: ["hospital"],
        };

        google.maps.importLibrary("places").then(() => {
            google.maps.places.Place.searchNearby(request).then((results) => 
                resolve(results.places.shift()));
        })

    });
}
