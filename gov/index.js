const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const pollution = require('./lib/pollution')
const mamStateCreate = require('../gov/lib/mamStateCreate')
const publish = require('../gov/lib/publish')

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.disable('etag')

app.get('/', function (req, res) {
  res.render('index', { isCity: true })
})

app.get('/user', function (req, res) {
  res.render('index', { isCity: false })
})

let _mamState = mamStateCreate();

app.post('/msg', function (req, response) {
  _mamState.then(async mamState => {
    var t = new Date()
    const res = await publish(
      mamState,
      {
        d: t.toLocaleTimeString(),
        hello: req.body.msg
      },
    );
    //const nextRoot = res.mamState.channel.next_root;
    nextRoot = res.root;
    _mamState = Promise.resolve(res.mamState);
    response.json(mamState)
  }).catch(err => {
    console.dir(err)
  })
})

// http://localhost:3000/getPrice?lat=1&long=2
app.get('/getPrice', function (req, res) {
  const distance = req.query.radius || 1000

  pollution(req.query.lat, req.query.lon, distance)
    .then(result => {
      res.json({
        status: 'ok',
        averageEmission: result.averageEmission,
        price: result.price,
        unit: 'cent'
      })
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
