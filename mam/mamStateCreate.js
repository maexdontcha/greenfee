const config = require('./config.json')
const Mam = require('./lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mamStateCreate = () => {
  let mamState = Mam.init(config.provider, config.seed, 2)
  return new Promise(async (resolve, reject) => {
    if (config.myRoot === '') {
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

module.exports = mamStateCreate
