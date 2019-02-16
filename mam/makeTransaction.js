const config = require('./config.json')
const composeAPI = require('@iota/core')
const converter = require('@iota/converter')

const iota = composeAPI.composeAPI({
  provider: 'https://nodes.devnet.iota.org'
})

const seed = config.seed
const options = {}

iota.getNewAddress(seed, options, (error, address) => {
  if (error) console.error(error)
  console.log('Got address: ' + address)

  const transfers = [
    {
      address:
        'KFXPGYDC9AJWTYOTSZSAKCYYKA9KTDLOCFEHFZVCKYX9JDJICATJOMAVVVSTHDWXFOXYPFFIQPJXAFMGDWDFTHJKOD',
      value: 100,
      message: converter.asciiToTrytes('stefan says: crazy!'),
      tag: converter.asciiToTrytes('pothole')
    }
  ]

  // Depth for the tip selection
  const depth = 4
  // If we're on the mainnet, minWeightMagnitude is 18
  const minWeightMagnitude = 14

  iota
    .prepareTransfers(seed, transfers)
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

  // Call the sendTransfer API wrapper function
  // It takes care prepareTransfers, attachToTangle, broadcast and storeTransactions
  //   iota.api.sendTransfer(
  //     seed,
  //     depth,
  //     minWeightMagnitude,
  //     transfer,
  //     (error, attached) => {
  //       if (error) {
  //         console.error(error)
  //         return
  //       }
  //       console.log(
  //         'Successfully attached your transaction to the Tangle with transaction',
  //         attached
  //       )
  //     }
  //   )
})
