const motorControl = require('./src/motorControl.js');
const bluetoothService = require('./src/bluetooth.js');
const utils = require('./src/utils.js');
const matrix11x7 = require('matrix11x7');
const battery = require('./src/battery');
const events = require('events');
const em = new events.EventEmitter();

const { ledMatrix } = require('./src/matrix');

const run = async () => {
  console.log('starting..');

  try {
    const mc = await motorControl();
    const matrix11x7Display = await matrix11x7();

    // greetings
    await matrix11x7Display.scrollText('Ready', {
      infinite: false,
    });

    await battery((values) => em.emit('BATTERY_UPDATE', values));
    const onBatteryUpdate = (listener) =>
      em.addListener('BATTERY_UPDATE', listener);

    // listen for bluetooth commands
    await bluetoothService(({ speedLeft = 0, speedRight = 0 }) => {
      if (speedLeft === 0 || speedRight === 0) {
        mc.stop();
        //matrix11x7Display.basicMatrix(ledMatrix.stop);
      } else {
        mc.left(speedLeft);
        mc.right(speedRight);
        //matrix11x7Display.basicMatrix(ledMatrix.go, ledDisplay);
      }
    }, onBatteryUpdate);

    console.log('started');
  } catch (e) {
    console.error(e);
  }
};

run();
