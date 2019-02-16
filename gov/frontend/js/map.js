import heatmap from 'leaflet.heat'
import leaflet_routing_machine from 'leaflet-routing-machine'

const ACCESS_TOKEN = 'pk.eyJ1Ijoic3RhZG9sZiIsImEiOiJjanM3YjZvaGMwdzY5NDlybjlvNjIxZnYyIn0.9Hnl5-BzX0z3esU_Vzc8lA';

function makeMap() {
    const mymap = L.map('themap').setView([48.779089, 9.172057], 12);

    L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${ACCESS_TOKEN}`, {
        maxZoom: 18,
        attribution: '',
        id: 'mapbox.streets'
    }).addTo(mymap);

    fetch('/getHeat').then(res => {
        res.json().then(json => {
            const heat = L.heatLayer(json.heat, { radius: 25 }).addTo(mymap);
        });
    });

    const routing = L.Routing.control({
        waypoints: [
            L.latLng(48.8201197, 9.2593979),//BOSCH Autowerkstatt Fellbach
            L.latLng(48.793130, 9.061087)
        ]
    }).addTo(mymap);

    console.log(routing.getPlan())

}

export {
    makeMap
}
