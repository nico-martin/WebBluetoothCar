const motorControl = require("./src/motorControl.js");
const bluetoothService = require("./src/bluetooth.js");
const utils = require("./src/utils.js");

const run = async () => {
  console.log("starting..");

  const mc = await motorControl();

  // greetings
  mc.left(50);
  mc.right(50);
  await utils.wait(100);
  mc.stop();

  // listen for bluetooth commands
  await bluetoothService(
    (speed = 0) => (speed === 0 ? mc.stop() : mc.left(speed)),
    (speed = 0) => (speed === 0 ? mc.stop() : mc.right(speed))
  );

  console.log("started");
};

run();
