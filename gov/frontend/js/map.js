import heatmap from 'leaflet.heat'
import leaflet_routing_machine from 'leaflet-routing-machine'

const ACCESS_TOKEN =
  'pk.eyJ1Ijoic3RhZG9sZiIsImEiOiJjanM3YjZvaGMwdzY5NDlybjlvNjIxZnYyIn0.9Hnl5-BzX0z3esU_Vzc8lA'

let positions = []
let waypointReached = 0
let routing
let marker = {}
var carIcon = L.icon({
  iconUrl: 'img/car.png',
  //  shadowUrl: 'leaf-shadow.png',

  iconSize: [65, 27], // size of the icon
  popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
})

function makeMap(isCity) {
  const mymap = L.map('themap').setView([48.779089, 9.172057], 12)

  L.tileLayer(
    `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${ACCESS_TOKEN}`,
    {
      maxZoom: 15,
      attribution: '',
      id: 'mapbox.streets'
    }
  ).addTo(mymap)

  fetch('/getHeat').then(res => {
    res.json().then(json => {
      const heat = L.heatLayer(json.heat, { radius: 25 }).addTo(mymap)
    })
  })

  if (isCity) {
    mymap.on('click', function(e) {
      var popLocation = e.latlng
      fetch(
        '/getPrice?lat=' + popLocation.lat + '&lon=' + popLocation.lng
      ).then(res => {
        res.json().then(json => {
          if (json.price) {
            var popup = L.popup()
              .setLatLng(popLocation)
              .setContent(
                '<p>The price is <br />' +
                  json.price.toFixed(2) +
                  ' ' +
                  json.unit +
                  '</p>'
              )
              .openOn(mymap)
          }
        })
      })
    })
  } else {
    mymap.on('click', function(e) {
      if (routing != null) routing.spliceWaypoints(0, positions.length - 1)
      var popLocation = e.latlng
      positions.push(popLocation)
      routing = L.Routing.control({
        addWaypoints: false,
        createMarker: function() {
          return null
        },
        waypoints: positions,
        /*[
          L.latLng(48.8201197, 9.2593979), //BOSCH Autowerkstatt Fellbach
          L.latLng(48.79313, 9.061087)
        ]*/ router: L.Routing.mapbox(
          'pk.eyJ1Ijoic3RhZG9sZiIsImEiOiJjanM3YjZvaGMwdzY5NDlybjlvNjIxZnYyIn0.9Hnl5-BzX0z3esU_Vzc8lA'
        )
      }).addTo(mymap)
    })

    document.getElementById('reset-btn').addEventListener('click', function() {
      routing.setWaypoints([])
      if (marker != {}) {
        mymap.removeLayer(marker)
      }
      marker = {}
      positions = []
      waypointReached = 0
    })

    document.getElementById('next-btn').addEventListener('click', function() {
      if (waypointReached < positions.length) {
        if (marker != {}) {
          mymap.removeLayer(marker)
        }
        marker = L.marker(
          [positions[waypointReached].lat, positions[waypointReached].lng],
          { icon: carIcon }
        ).addTo(mymap)

        // IOTA CALL
        fetch('/user', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, cors, *same-origin
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(positions[waypointReached]) // body data type must match "Content-Type" header
        })

        waypointReached++
      }
    })
  }
}

export { makeMap }
