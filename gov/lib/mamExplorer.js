const config = require('./config.json')
const Mam = require('@iota/mam/lib/mam.client.js')

module.exports = (root, reportEvent, onFetchComplete) => {
  return new Promise(async (resolve, reject) => {
    try {
      //const iota = new IOTA({ provider });
      Mam.init(config.provider);
      await Mam.fetch(root, config.mode, null, data => {
        const event = JSON.parse(iota.utils.fromTrytes(data));
        reportEvent(event);
      });
      resolve(onFetchComplete()); 
    } catch (error) {
      console.log('MAM fetch error', error);
      reject();
    }
  })
}