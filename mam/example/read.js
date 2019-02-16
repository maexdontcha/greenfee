const Mam = require('../lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'

seed =
  'RTANRABRIGVOEQEBQXDJUYJFSZLYQJYFSRXFAGTVKEKPM9FEILVWOBINCFQJXDBUDGERFABOCDJLYW9GT'
let mamState = Mam.init(provider, seed, 2)

asdasd =
  'MOHDAYQXVCAKVZDBCHTPYPYDSVKPFVNWDTDCYAQTDXYJYYMXTLUENXZIGNGIOOMTWCFOTDDLKWDIIFJPM'
const x = async () => {
  const x = await Mam.fetch(asdasd, mode)
  console.log(x.nextRoot)
}
x()
