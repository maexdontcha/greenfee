const axios = require('axios')

module.exports = (lat, lon, distance) => {
    lat = lat || 48.779089
    lon = lon || 9.172057
    distance = distance || 15000

    const url = 'https://public.opendatasoft.com/api/records/1.0/search/';

    const params = {
        dataset: 'api-luftdateninfo',
        rows: 1000,
        'geofilter.distance': `${lat}, ${lon}, ${distance}`
        //'refine.land': 'Baden-Württemberg'
    }
    return new Promise((resolve, reject) => {

        axios.get(url, { params }).then(response => {

            const entries = response.data.records

            let sum = 0
            //EVTL erst die mit 2.5PM und dann die mit 10 PM rausfiltern
            for (var i in entries) {
                if (entries[i].fields) {
                    sum += entries[i].fields.value
                }
            }
            const averageEmission = sum / entries.length;
            resolve({
                averageEmission,
                entries
            })

        }).catch(err => reject(err))
    });
}
