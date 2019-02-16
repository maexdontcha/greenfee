import heatmap from 'leaflet.heat'

const ACCESS_TOKEN = 'pk.eyJ1Ijoic3RhZG9sZiIsImEiOiJjanM3YjZvaGMwdzY5NDlybjlvNjIxZnYyIn0.9Hnl5-BzX0z3esU_Vzc8lA';

function makeMap() {
    const mymap = L.map('themap').setView([51.505, -0.09], 13);

    L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${ACCESS_TOKEN}`, {
        maxZoom: 18,
        attribution: '',
        id: 'mapbox.streets'
    }).addTo(mymap);

    var heat = L.heatLayer([
        [51.505, -0.09, 20],
        [51.505, -0.19, 1]
    ], { radius: 25 }).addTo(mymap);
}

export {
    makeMap
}
