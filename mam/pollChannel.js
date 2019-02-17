const config = require('../config.json')
const Mam = require('@iota/mam/lib/mam.client.js')
const extractJson = require('@iota/extract-json')
const path = require('path')
const fs = require('fs');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const makeTransaction = require('./makeTransaction')

const iotaCore = require('@iota/core')
const iota = iotaCore.composeAPI({
  provider: config.provider
})

const LAST_STATE_FILENAME = path.normalize(__dirname + '/../_lastState');
const CONFIG_MODE = 'public';

const finalizeBundle = async (bundle, tag) => {
  const payload = asciiToTrytes(JSON.stringify(bundle))
  //if amount < my seed balance....

  const transaction =
  {
    address: config.greenfeeAddress,
    value: bundle.amount,
    message: payload,
    tag
  }

  const txResult = await makeTransaction([transaction])
  return txResult;
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

async function poll(lastState, transactions) {

  const result = await Mam.fetch(lastState.currentRoot, CONFIG_MODE)

  console.log(result.messages.length + " messages wait in the channel")
  if (result.messages.length >= 3) {
    const bundle = createBundle(lastState.currentRoot, result.messages);
    bundle.lastRoot = lastState.lastRoot
    txResult = await finalizeBundle(bundle, tag);
    if (txResult != null) {
      lastState.currentRoot = lastState.lastRoot
      fs.writeFileSync(LAST_STATE_FILENAME, JSON.stringify(lastState))
    }
  }
  return lastState;
}

const tag = config.tag + asciiToTrytes(config.licensePlate)
//const mamState = Mam.init(config.provider, config.seed);
let lastState = fs.existsSync(LAST_STATE_FILENAME) ? fs.readFileSync(LAST_STATE_FILENAME).toString() : null;
if (lastState) {
  lastState = JSON.parse(lastState);
}

let mamState = Mam.init(config.provider)

function checkChannels() {
  if (!lastState) {
    let lastState = fs.existsSync(LAST_STATE_FILENAME) ? fs.readFileSync(LAST_STATE_FILENAME).toString() : null;
    if (lastState) {
      lastState = JSON.parse(lastState);
    }
    setTimeout(checkChannels, 30000);
    return; //nothing to read.
  }
  console.log("checking...");

  iota.findTransactionObjects({
    addresses: [config.greenfeeAddress],
    tags: [tag] //config.greenfeeAddress
  }).then(transactions => {
    poll(lastState, transactions).then(lastState => {
      if (transactions.length > 0) {
        const latestTransaction = transactions[0]; //is that correct??
        iota.getBundle(latestTransaction.hash).then(bundle => {
          const message = JSON.parse(extractJson.extractJson(bundle));
          //const root = currentRoot || message.nextRoot
          //poll(root, mamState, transactions)

          //todo: the last root in the tx should be the current root.
        }).catch(err => console.dir(err))
      }
      setTimeout(checkChannels, 10000);
    })


  }).catch(err => console.log(err))
}

checkChannels();
