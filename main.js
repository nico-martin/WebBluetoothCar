const motorControl = require("./src/motorControl.js");
const bluetoothService = require("./src/bluetooth.js");
const utils = require("./src/utils.js");

const run = async () => {
  console.log("starting..");
  
  const mc = await motorControl();
  console.log("motor started");

  // greetings
  mc.left(50);
  mc.right(50);
  await utils.wait(50);
  mc.stop();
  
  bluetoothService(
    (speed = 0) => speed === 0 ? mc.stop() : mc.left(speed),
    (speed = 0) => speed === 0 ? mc.stop() : mc.right(speed),
  );
};

run();