const config = require('./config.json')
const Mam = require('@iota/mam/lib/mam.client.js')

const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mamStateCreate = () => {
  let mamState = Mam.init(config.provider, config.seed, 2)
  return new Promise(async (resolve, reject) => {
    if (config.myRoot === '') {
      var t = new Date()

      const trytes = asciiToTrytes(
        JSON.stringify({
          currentRateIOTA: 2.2,
          amountExhaustEmissions: 500,
          timestamp: t.setSeconds(t.getSeconds())
        })
      )
      const message = Mam.create(mamState, trytes)
      mamState = message.state
      // Attach the payload
      await Mam.attach(message.payload, message.address, 3, 9)
      console.log(message.root)
      return message.root
    } else {
      await setState(mamState, config.myRoot, resolve)
    }
  })
}

const setState = async (mamState, myRoot, cb) => {
  const packet = await Mam.fetch(myRoot, config.mode)
  mamState.channel.next_root = packet.nextRoot
  mamState.channel.start = packet.messages.length
  cb(mamState)
}
mamStateCreate()
module.exports = mamStateCreate
