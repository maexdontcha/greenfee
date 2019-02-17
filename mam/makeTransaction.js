const config = require('./config.json')
const composeAPI = require('@iota/core')

const iota = composeAPI.composeAPI({
  provider: config.provider
})

const options = {}
const makeTransaction = async (transfers) => {
  // const transfersx = [
  //   {
  //     address:
  //       'KFXPGYDC9AJWTYOTSZSAKCYYKA9KTDLOCFEHFZVCKYX9JDJICATJOMAVVVSTHDWXFOXYPFFIQPJXAFMGDWDFTHJKOD',
  //     value: 30,
  //     message: converter.asciiToTrytes('set balance to 0'),
  //     tag: converter.asciiToTrytes(config.tag)
  //   }
  // ]
  //console.log(transfers)

  // Depth for the tip selection
  const depth = 4
  // If we're on the mainnet, minWeightMagnitude is 18
  const minWeightMagnitude = 9

  try {
    const trytes = await iota.prepareTransfers(config.seed, transfers)

    const bundle = await iota.sendTrytes(trytes, depth, minWeightMagnitude)
    console.log(`Published transaction with tail hash: ${bundle[0].hash}`)
    console.dir(bundle)
    return bundle;
  } catch (err) {
    console.dir(err);
  }
}

module.exports = makeTransaction