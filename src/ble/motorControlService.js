const bleno = require('bleno');
const Characteristic = bleno.Characteristic;

module.exports = (move) => ({
  uuid: 'c10e3e56fdd311eb9a030242ac130003',
  characteristics: [
    new Characteristic({
      uuid: '35a1022cfdd311eb9a030242ac130003',
      properties: ['write', 'read'],
      descriptors: [
        new bleno.Descriptor({
          uuid: '95675d7cfdd411eb9a030242ac130003',
          value:
            'motorControl Characteristic for both wheels, expects a ByteArray with two elements (left- and right wheel) between 0 and 200',
        }),
      ],
      onWriteRequest: (data, offset, withoutResponse, callback) => {
        const left = data.readUInt8(0) - 100;
        const right = data.readUInt8(1) - 100;

        if (data.length !== 2) {
          console.log('ERROR: invalid data', data);
          callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
          return;
        }

        if (
          isNaN(left) ||
          left < -100 ||
          left > 100 ||
          isNaN(right) ||
          right < -100 ||
          right > 100
        ) {
          console.log('ERROR: value has to be between -100 and 100');
          callback(Characteristic.RESULT_UNLIKELY_ERROR);
          return;
        }

        move({ speedLeft: left, speedRight: right });
        callback(Characteristic.RESULT_SUCCESS);
      },
    }),
  ],
});
