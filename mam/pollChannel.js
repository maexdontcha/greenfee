const config = require('./config.json')
const Mam = require('@iota/mam/lib/mam.client.js')
const converter = require('@iota/converter')
const fs = require('fs');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const makeTransaction = require('./makeTransaction')

const iotaCore = require('@iota/core')
const iota = iotaCore.composeAPI({
  provider: config.provider
})

const LAST_ROOT_FILENAME = __dirname + '/_lastRoot';
const CONFIG_MODE = 'public';

const finalizeBundle = (bundle, tag) => {
  const payload = asciiToTrytes(JSON.stringify(bundle))
  //if amount < my seed balance....

  const transaction =
  {
    address: config.greenfeeAddress,
    value: bundle.amount,
    message: payload,
    tag
  }

  makeTransaction(transaction)
}

const createBundle = (root, messages) => {
  const bundle = {
    root,
    messages: [],
    amount: 0
  };

  for (let i = 0; i < messages.length; i++) {
    const message = JSON.parse(trytesToAscii(messages[i]))
    const amt = message.data.price.prices[0].price;
    bundle.messages.push({ idx: i, amt });
    bundle.amount += amt
  }
  return bundle;
}

const tag = config.tag + asciiToTrytes(config.licensePlate)

async function poll(root, mamState, transactions) {
  const result = await Mam.fetch(root, CONFIG_MODE)
  if (result.messages.length >= 10) {
    const bundle = createBundle(root, result.messages);
    bundle.nextRoot = result.nextRoot
    finalizeBundle(bundle, tag);
  }
  setTimeout(() => { poll(mamState) }, 1000)
}

(function () {
  iota.findTransactionObjects({
    tags: [tag] //config.greenfeeAddress
  }).then(transactions => {
    let currentRoot = fs.existsSync(LAST_ROOT_FILENAME) ? fs.readFileSync(LAST_ROOT_FILENAME).toString() : null;
    const root = currentRoot || null
    //mamState = await mamStateCreate(root)
    let mamState = Mam.init(config.provider)
    poll(root, mamState, transactions)
  }).catch(err => console.log(err))
})()
