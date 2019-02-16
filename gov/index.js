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
  let lat = req.query.lat || 9.152
  let long = req.query.long || 48.734
  let distance = 1000
  let url =
    'https://public.opendatasoft.com/api/records/1.0/search/' +
    '?dataset=api-luftdateninfo&facet=timestamp&facet=land' +
    '&facet=value_type&facet=sensor_manufacturer&facet=sensor_name*' +
    '&refine.land=Baden-W%C3%BCrttemberg' +
    '&geofilter.distance=%' +
    lat +
    '%2C+' +
    long +
    '%2C+' +
    distance

  request(url, function(err, response, body) {
    if (err) {
      res.json({
        status: 'error',
        api: url
      })
    } else {
      res.json({
        status: 'ok',
        price: 151,
        unit: 'cent'
      })
    }
  })
})

app.listen(3000, function() {
  console.log('Listening on port 3000!')
})
