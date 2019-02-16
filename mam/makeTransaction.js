const config = require('./config.json')
const composeAPI = require('@iota/core')
const converter = require('@iota/converter')

const iota = composeAPI.composeAPI({
  provider: config.provider
})

const options = {}
const makeTransaction = transfers => {
  iota.getNewAddress(config.seed, options, (error, address) => {
    if (error) console.error(error)

    // const transfersx = [
    //   {
    //     address:
    //       'KFXPGYDC9AJWTYOTSZSAKCYYKA9KTDLOCFEHFZVCKYX9JDJICATJOMAVVVSTHDWXFOXYPFFIQPJXAFMGDWDFTHJKOD',
    //     value: 30,
    //     message: converter.asciiToTrytes('set balance to 0'),
    //     tag: converter.asciiToTrytes(config.tag)
    //   }
    // ]
    console.log(transfers)

    // Depth for the tip selection
    const depth = 2
    // If we're on the mainnet, minWeightMagnitude is 18
    const minWeightMagnitude = 9

    iota
      .prepareTransfers(config.seed, transfers)
      .then(trytes => {
        // Persist trytes locally before sending to network.
        // This allows for reattachments and prevents key reuse if trytes can't
        // be recovered by querying the network after broadcasting.

        // Does tip selection, attaches to tangle by doing PoW and broadcasts.
        return iota.sendTrytes(trytes, depth, minWeightMagnitude)
      })
      .then(bundle => {
        console.log(`Published transaction with tail hash: ${bundle[0].hash}`)
        console.log(`Bundle: ${bundle}`)
      })
      .catch(err => {
        if (err) throw err
      })
  })
}

module.exports = makeTransaction
