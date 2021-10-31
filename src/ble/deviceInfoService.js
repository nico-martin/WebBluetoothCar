const bleno = require('bleno');
const Characteristic = bleno.Characteristic;
const pkg = require('../../package.json');
const deviceInfo = require('../deviceInfo');

// standard service and characertistic UUIDs
// https://btprodspecificationrefs.blob.core.windows.net/assigned-values/16-bit%20UUID%20Numbers%20Document.pdf

module.exports = async () => {
  const serial = await deviceInfo.deviceSerial();

  return {
    uuid: '180a',
    characteristics: [
      new Characteristic({
        uuid: '2a29', // Manufacturer Name
        properties: ['read'],
        value: new Buffer('Nico Martin'),
      }),
      new Characteristic({
        uuid: '2a28', // Software Revision
        properties: ['read'],
        value: new Buffer(pkg.version),
      }),
      new Characteristic({
        // since serial_number_string (2a25) is blocked, we take the Model Number
        // https://github.com/WebBluetoothCG/registries/blob/master/gatt_blocklist.txt#L50-L52
        uuid: '2a24', // Model Number
        properties: ['read'],
        value: new Buffer(serial),
      }),
    ],
  };
};
