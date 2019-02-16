const Mam = require('../lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'

// const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${provider}&mode=${mode}&root=`

// Initialise MAM State
seed =
  'ZTANRABRIGVOEHEBQGDJUYJFSZLYQJYFSRXFAGTVKEKPM9FKILVWOBINCFQJXDBUDGERFABOCDJLYW9GT'
let mamState = Mam.init(provider, seed, 2)

// Publish to tangle
const publish = async packet => {
  // Create MAM Payload - STRING OF TRYTES
  const trytes = asciiToTrytes(JSON.stringify(packet))
  const message = Mam.create(mamState, trytes)
  // console.log(
  //   `message.state.channel.next_root: ${message.state.channel.next_root}`
  // )
  // Save new mamState
  console.log(mamState)
  mamState = message.state
  // Attach the payload
  // console.log(`message.address: ${message.address}`)
  await Mam.attach(message.payload, message.address, 3, 9)

  // console.log(myNextRoot)
  // console.log(myNextRoot)
  // console.log('Published', packet, '\n')
  return message.root
}
asdasd =
  'NVZIECSMSGGXRFJXHJHSCPOP9EFWIK9ZJWBJYWROBBYTNZVVYYWAWTXJVJ9KPYJLOR9UIJDNRRZQ9JTSY'
const z = async () => {
  const packet = await Mam.fetch(asdasd, mode)
  mamState.channel.next_root = packet.nextRoot
  mamState.channel.start = packet.messages.length
  // console.log(mamState)
}

const publishAll = async () => {
  await z()
  setInterval(() => {}, 100)
  // await publish({
  //   message: 'Message from Bob',
  //   timestamp: new Date().toLocaleString()
  // })
  // await publish({
  //   message: 'Message from Charlie',
  //   timestamp: new Date().toLocaleString()
  // })
  return myroot
}

publishAll().then(myroot => {
  console.log(myroot)
})

// Callback used to pass data out of the fetch
const logData = data => {
  console.log(data)
  console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
}

// publishAll().then(async root => {
//   await Mam.fetch(root, mode, null, logData)
// })

const x = async () => {
  const packet = await Mam.fetch(asdasd, mode)
  mamState.channel.next_root = packet.nextRoot
  mamState.channel.start = packet.messages.length
  console.log(mamState)
  // console.log(packet.messages)
  // console.log(JSON.parse(trytesToAscii(packet.messages[2])))
  // const trytes = asciiToTrytes(JSON.stringify(packet))
  // const message = Mam.create(mamState, trytes)
  // console.log(message.state)
  // mamState = message.state
  // console.log(mamState)
}
