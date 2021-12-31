/*
BIKE ZONES
*/
var marketplace = L.polygon(
    [
        [49.445242415028716, 11.857183724641802], // marketplace: upper left corner 
        [49.4453383296455, 11.857591420412065],
        [49.44551620716546, 11.85823515057564],
        [49.4456138651373, 11.858538240194322],
        [49.44570890708382, 11.85877025127411],
        [49.44565833432788, 11.85884937644005],
        [49.44551359132424, 11.858414858579637],
        [49.44538105518711, 11.858524829149248],
        [49.44513778068731, 11.858692467212677],
        [49.44507238411053, 11.858400106430055],
        [49.44492066371649, 11.858483254909517],
        [49.444821260445146, 11.858438998460771],
        [49.44472185697226, 11.858345121145248],
        [49.444629429000884, 11.858052760362627],
        [49.444515201738966, 11.857637017965319],
        [49.444532641032794, 11.857523024082186],
        [49.444670411236125, 11.85742512345314],
        [ 49.44487444993995, 11.857356727123262],
    ], {
        weight: 3,
        color: 'lightgreen',
        fillOpacity: 0.1
    }).addTo(map);

var marketplaceNoGo1 = L.polygon(
    [
        [49.44518399421563, 11.857218593358995], // jack & jones: upper left corner
        [49.44523892722093, 11.85753107070923],
        [49.44506802433564, 11.85761019587517],
        [49.44501309113885, 11.857300400733948],
    ],  {
        weight: 2,
        color: 'red',
        fillOpacity: 0.1
    }).addTo(map);

var marketplaceNoGo1 = L.polygon(
    [
        [49.44487706581527, 11.857366114854814], // church: upper left corner
        [49.44501570700676, 11.858211010694504],
        [49.44500873135871, 11.858318299055101],
        [49.44496513353578, 11.858393400907518],
        [49.444899736728736, 11.85838669538498],
        [49.44484480334341, 11.858343780040741],
        [49.444687850474764, 11.857427805662155]
        
    ],  {
        weight: 2,
        color: 'red',
        fillOpacity: 0.1
    }).addTo(map);



/*
DEBUG
*/
// uncomment event if you want to localize specific points
// -> useful for zone & bike creation
// map.on('click', determinePosition);

var xlng = 0.000256;
var xlat = 0.000200;
function determinePosition(e)
{
    console.log(e.latlng.lat + ", " + e.latlng.lng);
    L.polygon([
      [e.latlng.lat-xlat,e.latlng.lng-xlng],
      [e.latlng.lat+xlat,e.latlng.lng-xlng],
      [e.latlng.lat-xlat,e.latlng.lng+xlng],
      [e.latlng.lat+xlat,e.latlng.lng+xlng],
    ]).addTo(map);
    
      L.polyline([
      [e.latlng.lat,e.latlng.lng-xlng],
      [e.latlng.lat,e.latlng.lng+xlng]
    ]).addTo(map);
}