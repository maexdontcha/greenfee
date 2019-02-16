const express = require('express')
const app = express()
const request = require('request')

app.set('view engine', 'ejs')

app.use(express.static('assets'))

app.get('/', function(req, res) {
  //res.send('Greenfee says hi!')
  res.render('index')
})

// http://localhost:3000/getPrice?lat=1&long=2
app.get('/getPrice', function(req, res) {
  let lat = req.query.lat || 48.779089
  let lon = req.query.lon || 9.172057
  let distance = 1000

  let url =
    'https://public.opendatasoft.com/api/records/1.0/search/' +
    '?dataset=api-luftdateninfo&facet=timestamp&facet=land' +
    '&facet=value_type&facet=sensor_manufacturer&facet=sensor_name' +
    '&refine.land=Baden-W%C3%BCrttemberg' +
    '&geofilter.distance=' +
    lat +
    '%2C+' +
    lon +
    '%2C+' +
    distance

  request(url, function(err, response, body) {
    if (err) {
      res.json({
        status: 'error',
        api: url
      })
    } else {
      let entries = JSON.parse(body).records
      //console.log(entries)

      let sum = 0
      //EVTL erst die mit 2.5PM und dann die mit 10 PM rausfiltern
      for (var i in entries) {
        if (entries[i].fields) {
          sum += entries[i].fields.value
        }
      }

      averageEmission = sum / entries.length
      multiplicator = 1.5

      res.json({
        status: 'ok',
        averageEmission: averageEmission,
        price: averageEmission * multiplicator,
        unit: 'cent'
      })
    }
  })
})

app.get('/getHeat', function(req, res) {
  let lat = req.query.lat || 48.779089
  let lon = req.query.lon || 9.172057
  let distance = 50000

  let url =
    'https://public.opendatasoft.com/api/records/1.0/search/' +
    '?dataset=api-luftdateninfo&facet=timestamp&facet=land' +
    '&facet=value_type&facet=sensor_manufacturer&facet=sensor_name' +
    '&refine.land=Baden-W%C3%BCrttemberg' +
    '&geofilter.distance=' +
    lat +
    '%2C+' +
    lon +
    '%2C+' +
    distance

  request(url, function(err, response, body) {
    if (err) {
      res.json({
        status: 'error',
        api: url
      })
    } else {
      let entries = JSON.parse(body).records

      let heat = []

      //console.log(entries)

      //EVTL erst die mit 2.5PM und dann die mit 10 PM rausfiltern
      for (var i in entries) {
        let heatpoint = []
        if (entries[i].fields) {
          heatpoint.push(entries[i].fields.location[0])
          heatpoint.push(entries[i].fields.location[1])
          heatpoint.push(entries[i].fields.value)
        }

        heat.push(heatpoint)
      }

      res.json({ heat: heat })
    }
  })
})

app.listen(3000, function() {
  console.log('Listening on port 3000!')
})
