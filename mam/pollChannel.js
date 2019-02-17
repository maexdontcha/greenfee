const config = require('./config.json')
const Mam = require('@iota/mam/lib/mam.client.js')
const extractJson = require('@iota/extract-json')

const fs = require('fs');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const makeTransaction = require('./makeTransaction')

const iotaCore = require('@iota/core')
const iota = iotaCore.composeAPI({
  provider: config.provider
})

const LAST_ROOT_FILENAME = __dirname + '/_lastRoot';
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

  await makeTransaction([transaction])
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
    await finalizeBundle(bundle, tag);
    fs.writeFileSync(LAST_ROOT_FILENAME, result.nextRoot)
  }
  setTimeout(() => { poll(mamState) }, 1000)
}

const mamState = Mam.init(config.provider)

  (function () {
    iota.findTransactionObjects({
      addresses: [config.greenfeeAddress],
      tags: [tag] //config.greenfeeAddress
    }).then(transactions => {
      let currentRoot = fs.existsSync(LAST_ROOT_FILENAME) ? fs.readFileSync(LAST_ROOT_FILENAME).toString() : null;
      if (transactions.length > 0) {
        const latestTransaction = transactions[0]; //is that correct??
        iota.getBundle(latestTransaction.hash).then(bundle => {
          const message = JSON.parse(extractJson.extractJson(bundle));
          const root = currentRoot || message.nextRoot
          poll(root, mamState, transactions)
        }).catch(err => console.dir(err))
      } else {

      }
    }).catch(err => console.log(err))
  })()
