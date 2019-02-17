function renderLabel(response) {
    const prices = response.prices.map(p => `${p.price}${p.unit}`)
    return `<p>Avg emissions here are: ${response.avg} <br />
        ${prices.join('<br/>')}
        </p>`;
}
export default function (mymap) {
    mymap.on('click', function (e) {
        var popLocation = e.latlng
        fetch(
            '/getPrice?lat=' + popLocation.lat + '&lon=' + popLocation.lng
        ).then(res => {
            res.json().then(json => {
                if (json.avg) {
                    var popup = L.popup()
                        .setLatLng(popLocation)
                        .setContent(
                            renderLabel(json)
                        )
                        .openOn(mymap)
                }
            })
        })
    })
}

