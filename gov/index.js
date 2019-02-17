const express = require('express')
const bodyParser = require('body-parser')
const fs = require("fs");
const app = express()

const pollution = require('./lib/pollution')
const mamStateCreate = require('../gov/lib/mamStateCreate')
const publish = require('../gov/lib/publish')

app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.disable('etag')

const CURRENT_IOTA_EXCHANGE = 0.00026;
const LAST_ROOT_FILENAME = __dirname + '/_lastRoot';

app.get('/', function (req, res) {
  res.render('index', { isCity: true })
})

app.get('/user', function (req, res) {
  res.render('index', { isCity: false })
})

const lastRoot = fs.existsSync(LAST_ROOT_FILENAME) ? fs.readFileSync(LAST_ROOT_FILENAME).toString() : null;
let _mamState = mamStateCreate(lastRoot);

app.post('/msg', function (req, response) {
  _mamState.then(async mamState => {
    var t = new Date()
    const payload = {
      d: t.toLocaleDateString(),
      data: req.body
    };
    //console.log(payload)
    //return response.json(payload)

    const res = await publish(
      mamState,
      payload
    );
    nextRoot = res.root;
    fs.writeFileSync(LAST_ROOT_FILENAME, nextRoot)
    _mamState = Promise.resolve(res.mamState);
    response.json(mamState)
  }).catch(err => {
    console.dir(err)
  })
})

// http://localhost:3000/getPrice?lat=1&long=2&exhaust=500
app.get('/getPrice', function (req, res) {
  const distance = 1000
  const exhaust = req.query.exhaust || 50

  pollution(req.query.lat, req.query.lon, distance)
    .then(result => {
      const price = exhaust * result.averageEmission / 50;
      const out = {
        status: 'ok',
        averageEmission: result.averageEmission,
        yourEmission: exhaust,
        prices: [
          {
            price,
            unit: 'i'
          },
          {
            price: price * CURRENT_IOTA_EXCHANGE,
            unit: 'e'
          }
        ]
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
