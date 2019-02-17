const Mam = require('@iota/mam/lib/mam.client.js')
const { asciiToTrytes } = require('@iota/converter')

module.exports = async (mamState, payload) => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(payload))

    const message = Mam.create(mamState, trytes)

    // Attach the payload
    const bundle = await Mam.attach(message.payload, message.address, 3, 9)

    return {
        root: message.root,
        mamState: message.state
    }

}