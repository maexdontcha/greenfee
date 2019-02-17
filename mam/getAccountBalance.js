const config = require('./config.json')
const composeAPI = require('@iota/core')
const converter = require('@iota/converter')

const iota = composeAPI.composeAPI({
  provider: 'https://nodes.devnet.iota.org'
})

const seed = config.seed
const options = {}

const carPaidSummary = () => {
  return new Promise(async (resolve, reject) => {
    await iota.findTransactions(
      {
        addresses: [config.greenfeeAddress],
        tags: [converter.asciiToTrytes(config.tag)]
      },
      (err, hashes) => {
        if (err) throw err
        iota
          .getTransactionObjects(hashes)
          .then(transactions => {
            // console.log(transactions)
            const reducer = (accumulator, currentValue) =>
              accumulator.value + currentValue.value
            resolve(transactions.reduce(reducer))
          })
          .catch(err => {
            throw err
          })
      }
    )
  })
}

carPaidSummary().then(payed => {
  console.log(payed)
})

// iota
//   .getBalances(
//     [
//       'KFXPGYDC9AJWTYOTSZSAKCYYKA9KTDLOCFEHFZVCKYX9JDJICATJOMAVVVSTHDWXFOXYPFFIQPJXAFMGDWDFTHJKOD'
//     ],
//     100
//   )
//   .then(({ balances }) => {
//     console.log(balances)
//   })
//   .catch(err => {
//     // ...
//   })

// iota
//   .getAccountData(config.seed, {
//     start: 0,
//     security: 2
//   })
//   .then(accountData => {
//     const { addresses, inputs, transactions, balance } = accountData
//     console.log(balance)
//   })
//   .catch(err => {
//     // ...
//   })
