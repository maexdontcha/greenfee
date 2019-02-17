import heatmap from 'leaflet.heat'
import leaflet_routing_machine from 'leaflet-routing-machine'
import cityMap from './cityMap';
import clientMap from './clientMap';
const ACCESS_TOKEN =
  'pk.eyJ1Ijoic3RhZG9sZiIsImEiOiJjanM3YjZvaGMwdzY5NDlybjlvNjIxZnYyIn0.9Hnl5-BzX0z3esU_Vzc8lA'

function makeMap(elemId) {
  const mymap = L.map(elemId).setView([48.779089, 9.172057], 11)

  L.tileLayer(
    `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${ACCESS_TOKEN}`,
    {
      maxZoom: 14,
      attribution: '',
      id: 'mapbox.streets'
    }
  ).addTo(mymap)

  fetch('/getHeat').then(res => {
    res.json().then(json => {
      const heat = L.heatLayer(json.heat, { radius: 25 }).addTo(mymap)
    })
  })
  const isCity = $('#' + elemId).data('isCity')
  if (isCity) {
    cityMap(mymap)
  } else {
    clientMap(mymap)
  }
  return mymap
}
export { makeMap }
