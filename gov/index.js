const express = require('express')
const bodyParser = require('body-parser')
const Mam = require('@iota/mam/lib/mam.client.js')
const fs = require("fs");
const path = require('path')
const app = express()

const pollution = require('./lib/pollution')
const publish = require('../gov/lib/publish')
const config = require('../config.json')

app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.disable('etag')

const CURRENT_IOTA_EXCHANGE = 0.0026;
const LAST_STATE_FILENAME = path.normalize(__dirname + '/../_lastState');

app.get('/', function (req, res) {
  res.render('index', { isCity: true })
})

app.get('/user', function (req, res) {
  res.render('index', { isCity: false })
})

const mamState = Mam.init(config.provider, config.seed);
const lastState = fs.existsSync(LAST_STATE_FILENAME) ? fs.readFileSync(LAST_STATE_FILENAME).toString() : null;
if (lastState) {
  mamState.channel = JSON.parse(lastState);
}
//let _mamState = mamStateCreate(lastRoot);

app.post('/msg', async function (req, response) {
  var t = new Date()
  const payload = {
    d: t.toLocaleDateString() + " " + t.toLocaleTimeString(),
    data: req.body
  };
  //console.log(payload)
  //return response.json(payload)

  const res = await publish(
    mamState,
    payload
  );
  if (!mamState.channel.currentRoot) {
    mamState.channel.currentRoot = res.root;
  }
  mamState.channel.lastRoot = res.root
  fs.writeFileSync(LAST_STATE_FILENAME, JSON.stringify(mamState.channel))
  response.json(mamState)
})

// http://localhost:3000/getPrice?lat=1&long=2&exhaust=500
app.get('/getPrice', function (req, res) {
  const distance = 1000
  const exhaust = req.query.exhaust || 50

  pollution(req.query.lat, req.query.lon, distance)
    .then(result => {
      let out;

      if (result.averageEmission) {
        const price = exhaust * result.averageEmission / 20;
        out = {
          avg: Math.round(result.averageEmission),
          emission: Number.parseFloat(exhaust).toFixed(2),
          prices: [
            {
              price: Math.round(price),
              unit: 'i'
            },
            {
              price: Number.parseFloat(price * CURRENT_IOTA_EXCHANGE).toFixed(2),
              unit: 'e'
            }
          ]
        }
      } else {
        out = {
          avg: 0,
          emission: exhaust,
          prices: []
        }
      }

      res.json(out)
    })
    .catch(err => {
      res.json({
        status: 'error',
        err
      })
    })
})

app.get('/getHeat', function (req, res) {
  const distance = req.query.radius || 15000

  pollution(req.query.lat, req.query.lon, distance)
    .then(result => {
      const entries = result.entries
      const heat = []
      for (var j = 4; j-- > 0;) {
        for (var i in entries) {
          let heatpoint = []
          if (entries[i].fields) {
            heatpoint.push(
              entries[i].fields.location[0] + (Math.random() - 0.5) / 70
            )
            heatpoint.push(
              entries[i].fields.location[1] + (Math.random() - 0.5) / 70
            )
            heatpoint.push(entries[i].fields.value / 5)
          }

          heat.push(heatpoint)
        }
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
