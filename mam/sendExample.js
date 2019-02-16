const mamStateCreate = require('./mamStateCreate')
const Mam = require('@iota/mam/lib/mam.client.js')

const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

mamStateCreate(message).then(async mamState => {
  await publish(
    message,
    // {
    //   key1: 'lalabasda',
    //   message: 'GEHT DAS SO 2',
    //   timestamp: new Date().toLocaleString()
    // },
    mamState
  )
})

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
