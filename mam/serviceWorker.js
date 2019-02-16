const config = require('./config.json')
const Mam = require('@iota/mam/lib/mam.client.js')
const converter = require('@iota/converter')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const makeTransaction = require('./makeTransaction')

let currentRoot = undefined

let mamState = Mam.init(config.provider, config.seed, 2)
// let balance = 0
const logData = data => {
  const message = JSON.parse(trytesToAscii(data))
  console.log(message)
  if (message.currentRateIOTA && message.amountExhaustEmissions) {
    balance += message.currentRateIOTA * message.amountExhaustEmissions
  }
  // console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
}

const createAccountBalance = async myRoot => {
  return new Promise(async (resolve, reject) => {
    const x = await Mam.fetch(myRoot, config.mode, null, logData)
    resolve(balance)
  })
}

module.exports = createAccountBalance

// Example
// createAccountBalance(config.myRoot).then(data => {
//   console.log(data)
// })

const setNewRoot = data => {
  const message = JSON.parse(trytesToAscii(data))
  currentRoot = message.currentRoot
}

const createBundle = data => {
  let currentBundle = []
  let balance = 0
  for (let i = 0; i <= 9; i++) {
    const message = JSON.parse(trytesToAscii(data[i]))
    if (message.currentRoot)
      if (message.currentRateIOTA && message.amountExhaustEmissions) {
        currentBundle.push({ key: i, hash: message.currentRoot })
        balance +=
          (message.currentRateIOTA * message.amountExhaustEmissions) / 100
      }
  }
  const paylod = JSON.stringify(currentBundle)

  const adresse = [
    {
      address:
        'KFXPGYDC9AJWTYOTSZSAKCYYKA9KTDLOCFEHFZVCKYX9JDJICATJOMAVVVSTHDWXFOXYPFFIQPJXAFMGDWDFTHJKOD',
      value: balance,
      message: converter.asciiToTrytes(paylod),
      tag: converter.asciiToTrytes(config.tag)
    }
  ]
  //makeTransaction(adresse)
}

setInterval(async () => {
  const myRoot = currentRoot || config.myRoot
  const fetch = await Mam.fetch(myRoot, config.mode)
  if (fetch.messages.length >= 10) {
    createBundle(fetch.messages)
    //console.log(fetch.messages[11])
    setNewRoot(fetch.messages[10])
  }
}, 5000)
