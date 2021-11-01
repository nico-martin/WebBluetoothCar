require('dotenv').config();
const name = process.env.BLENO_DEVICE_NAME || 'SpeedWheels';
process.env['BLENO_DEVICE_NAME'] = name;

const bleno = require('bleno');
const batteryService = require('./ble/batteryService');
const deviceInfoService = require('./ble/deviceInfoService');
const motorControlService = require('./ble/motorControlService');

const bluetoothService = async (move, onBatteryUpdate, setMatrix) => {
  const battery = batteryService(onBatteryUpdate);
  const device = await deviceInfoService();
  const motorControl = motorControlService(move, setMatrix);

  bleno.on('stateChange', (state) =>
    state === 'poweredOn'
      ? bleno.startAdvertising(name, [
          battery.uuid,
          device.uuid,
          motorControl.uuid,
        ])
      : bleno.stopAdvertising()
  );

  bleno.on('advertisingStart', (err) => {
    if (err) {
      console.log('advertisingStart error', err);
      return;
    }

    bleno.setServices([battery, device, motorControl]);
  });

  bleno.on('disconnect', () => {
    console.log('disconnected from client');
    move({ speedLeft: 0, speedRight: 0 });
  });
};

module.exports = bluetoothService;
