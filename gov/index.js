const express = require('express')
const app = express()
const pollution = require('./lib/pollution')

app.set('view engine', 'ejs')

app.use(express.static('assets'))

app.get('/', function (req, res) {
  res.render('index')
})

// http://localhost:3000/getPrice?lat=1&long=2
app.get('/getPrice', function (req, res) {
  const distance = req.query.radius || 10000

  pollution(req.query.lat, req.query.lon, distance).then(result => {

    res.json({
      status: 'ok',
      averageEmission: result.averageEmission,
      price: result.price,
      unit: 'cent'
    })

  }).catch(err => {
    res.json({
      status: 'error',
      err
    })
  })
})


app.get('/getHeat', function (req, res) {
  const distance = req.query.radius || 15000

  pollution(req.query.lat, req.query.lon, distance).then(result => {
    const entries = result.entries;
    const heat = [];
    for (var i in entries) {
      let heatpoint = []
      if (entries[i].fields) {
        heatpoint.push(entries[i].fields.location[0])
        heatpoint.push(entries[i].fields.location[1])
        heatpoint.push(entries[i].fields.value / 3)
      }

      heat.push(heatpoint)
    }
    res.json({ heat: heat })
  })
    .catch(err => {
      res.json({
        status: 'error',
        err
      })
    })
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})
