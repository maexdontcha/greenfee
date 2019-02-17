const iotaCore = require('@iota/core')

const iota = iotaCore.composeAPI({
  provider: 'https://nodes.devnet.iota.org:443'
})

const ACCESS_TOKEN =
  'pk.eyJ1Ijoic3RhZG9sZiIsImEiOiJjanM3YjZvaGMwdzY5NDlybjlvNjIxZnYyIn0.9Hnl5-BzX0z3esU_Vzc8lA'

function renderSidebarElement(payload, mamresponse, idx) {
  return $(`<nav class="panel">
<p class="panel-heading">
<a href="https://mam-explorer.firebaseapp.com/?provider=https://nodes.devnet.iota.org&mode=public&root=${mamresponse.channel.lastRoot}" target="_blank"> 
  ${payload.p.lat}/${payload.p.lng}
  </a>
</p>
<a class="panel-block">
  <span class="panel-icon">
    <i class="fas" aria-hidden="true"></i>
  </span>
  <b>avg emission:</b> <i>${payload.price.avg}</i> &nbsp; 
  <b>your emission:</b> <i>${payload.price.emission}</i>
</a>

<div class="panel-block">
  <span class="panel-icon">
    <i class="fas" aria-hidden="true"></i>
  </span>
  <b>you pay:</b> 
  <i>${payload.price.prices[0].price}${payload.price.prices[0].unit}</i>
  (<i>${payload.price.prices[1].price}${payload.price.prices[1].unit}</i>)
</div>

</nav>`);
}
export default function (mymap, $sidebar) {

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

  const tangleconfig = {
    tag: $('#sidebar').data('tag'),
    addr: $('#sidebar').data('addr')
  }

  const tanglePoll = function () {
    iota.findTransactionObjects({
      addresses: [tangleconfig.addr],
      tags: [tangleconfig.tag]
    }).then(transactions => {
      console.dir(transactions)
      const links = transactions.map(t => {
        return $(`<a href="https://devnet.thetangle.org/transaction/${t.hash}" class="tag is-primary is-medium" target="_blank">${t.value}</a>`)
      })
      $('#tbalance .balances').html(links)
    })
    window.setTimeout(tanglePoll, 10000)
  }
  tanglePoll();

  mymap.on('click', function (e) {
    const popLocation = e.latlng

    if (routing != null) routing.spliceWaypoints(0, positions.length - 1)

    positions.push(popLocation)

    routing = L.Routing.control({
      addWaypoints: false,
      createMarker: function () {
        return null
      },
      waypoints: positions,
        /*[
          L.latLng(48.8201197, 9.2593979), //BOSCH Autowerkstatt Fellbach
          L.latLng(48.79313, 9.061087)
        ]*/ router: L.Routing.mapbox(
        ACCESS_TOKEN
      )
    }).addTo(mymap)
  })

  $('#reset-btn').on('click', function () {
    routing.setWaypoints([])
    if (marker != {}) {
      mymap.removeLayer(marker)
    }
    marker = {}
    positions = []
    waypointReached = 0
  })

  $('#next-btn').on('click', function () {
    if (waypointReached < positions.length) {

      const position = positions[waypointReached]
      if (marker != {}) {
        mymap.removeLayer(marker)
      }
      marker = L.marker(
        [position.lat, position.lng],
        { icon: carIcon }
      ).addTo(mymap)
      const exhaust = 50 * Math.random();
      fetch(
        '/getPrice?lat=' + position.lat + '&lon=' + position.lng + '&exhaust=' + exhaust
      ).then(res => res.json().then(computedPrice => {
        if (computedPrice.avg > 0) {
          signal(position, computedPrice)
        }

        waypointReached++
      }))
    }
  })

  function signal(position, computedPrice) {

    const payload = {
      p: position,
      price: computedPrice
    }

    fetch('/msg', {
      method: 'POST',
      mode: 'cors', // no-cors, cors, *same-origin
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => res.json().then(response => {
      $('#sidebar .emissionlog').prepend(renderSidebarElement(payload, response));
      console.log(response)
    }))
  }

}

