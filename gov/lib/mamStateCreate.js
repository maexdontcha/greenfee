const config = require('./config.json')
const Mam = require('@iota/mam/lib/mam.client.js')

const setState = async (mamState, myRoot) => {
  const packet = await Mam.fetch(myRoot, config.mode)
  mamState.channel.next_root = packet.nextRoot
  mamState.channel.start = packet.messages.length
  return mamState
}

module.exports = async () => {
  let mamState = Mam.init(config.provider, config.seed, 2)
  if (config.myRoot == null) {
  } else {
    mamState = await setState(mamState, config.myRoot)
  }
  return mamState
}
