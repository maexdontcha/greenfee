const config = require('./config.json')
const Mam = require('./lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'

let mamState = Mam.init(provider, config.seed, 2)
let balance = 0
const logData = data => {
  const message = JSON.parse(trytesToAscii(data))
  if (message.currentRateIOTA && message.amountExhaustEmissions) {
    balance += message.currentRateIOTA * message.amountExhaustEmissions
  }
  // console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
}

const createAccountBalance = async myRoot => {
  return new Promise(async (resolve, reject) => {
    await Mam.fetch(myRoot, mode, null, logData)
    resolve(balance)
  })
}

module.exports = createAccountBalance

// Example
// createAccountBalance(config.myRoot).then(data => {
//   console.log(data)
// })
