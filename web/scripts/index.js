/*
CLASSES
*/
var BikeIcon = L.Icon.extend({
    options: {
        iconUrl: bikeIconUrl,
        iconSize:     [40, 40],
        iconAnchor:   [20, 20]
    }
});


/*
MAP
*/
var map = L.map('map', {
        zoomControl: false,
        minZoom: 14,
    })
    // .setView(startPos, 14);
    .setView(startPos, 18);
    
// tile provider
// -> https://leaflet-extras.github.io/leaflet-providers/preview/index.html
var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', { maxZoom: 20 }).addTo(map);
// var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);



/*
ICONS
*/
bikesPos.forEach(bikePos => {
    let marker = L.marker(bikePos, {icon: new BikeIcon()});
    marker.addTo(map);
    L.DomUtil.addClass(marker._icon, 'bikeIcon');
    let batteryClass = batteryClasses[Math.floor(Math.random() * batteryClasses.length)];
    L.DomUtil.addClass(marker._icon, batteryClass);
});