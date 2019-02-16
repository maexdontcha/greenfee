import heatmap from 'leaflet.heat'

const ACCESS_TOKEN = 'pk.eyJ1Ijoic3RhZG9sZiIsImEiOiJjanM3YjZvaGMwdzY5NDlybjlvNjIxZnYyIn0.9Hnl5-BzX0z3esU_Vzc8lA';

function makeMap() {
    const mymap = L.map('themap').setView([48.779089, 9.172057], 12);

    L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${ACCESS_TOKEN}`, {
        maxZoom: 18,
        attribution: '',
        id: 'mapbox.streets'
    }).addTo(mymap);

    fetch('/getHeat').then(res => {
        console.log(res.json().then(json => {
            const heat = L.heatLayer(json.heat, { radius: 25 }).addTo(mymap);
        }));
    });

}

export {
    makeMap
}
