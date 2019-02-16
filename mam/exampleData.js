const mamStateCreate = require('./mamStateCreate')
const Mam = require('@iota/mam/lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const publish = async (packet, mamState) => {
  // Create MAM Payload - STRING OF TRYTES
  const trytes = asciiToTrytes(JSON.stringify(packet))
  const message = Mam.create(mamState, trytes)

  // Save new mamState
  mamState = message.state

  // Attach the payload
  await Mam.attach(message.payload, message.address, 3, 9)
  return message.root
}

mamStateCreate().then(async mamState => {
  var t = new Date()
  const sec = 30
  t.setSeconds(t.getSeconds() + sec)
  await publish(
    {
      currentRateIOTA: 2.2,
      amountExhaustEmissions: 500,
      timestamp: t.toLocaleString()
    },
    mamState
  )
  t.setSeconds(t.getSeconds() + sec)
  await publish(
    {
      currentRateIOTA: 2.1,
      amountExhaustEmissions: 350,
      timestamp: t.toLocaleString()
    },
    mamState
  )
  t.setSeconds(t.getSeconds() + sec)
  await publish(
    {
      currentRateIOTA: 2.5,
      amountExhaustEmissions: 350,
      timestamp: t.toLocaleString()
    },
    mamState
  )
  t.setSeconds(t.getSeconds() + sec)
  await publish(
    {
      currentRateIOTA: 1.8,
      amountExhaustEmissions: 350,
      timestamp: t.toLocaleString()
    },
    mamState
  )
  t.setSeconds(t.getSeconds() + sec)
  await publish(
    {
      currentRateIOTA: 2.7,
      amountExhaustEmissions: 200,
      timestamp: t.toLocaleString()
    },
    mamState
  )
  t.setSeconds(t.getSeconds() + sec)
  await publish(
    {
      currentRateIOTA: 2.1,
      amountExhaustEmissions: 100,
      timestamp: t.toLocaleString()
    },
    mamState
  )
  t.setSeconds(t.getSeconds() + sec)
  await publish(
    {
      currentRateIOTA: 2.21,
      amountExhaustEmissions: 500,
      timestamp: t.toLocaleString()
    },
    mamState
  )
  t.setSeconds(t.getSeconds() + sec)
  await publish(
    {
      currentRateIOTA: 3.2,
      amountExhaustEmissions: 320,
      timestamp: t.toLocaleString()
    },
    mamState
  )
})
