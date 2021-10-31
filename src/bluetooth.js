process.env['BLENO_DEVICE_NAME'] = 'SpeedWheels Bluetooth Car';

const bleno = require('bleno');
const batteryService = require('./ble/batteryService');
const deviceInfoService = require('./ble/deviceInfoService');
const motorControlService = require('./ble/motorControlService');

const bluetoothService = async (move, onBatteryUpdate) => {
  const battery = batteryService(onBatteryUpdate);
  const device = await deviceInfoService();
  const motorControl = motorControlService(move);
  console.log(motorControl);

  bleno.on('stateChange', (state) =>
    state === 'poweredOn'
      ? bleno.startAdvertising('SpeedWheels', [
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
