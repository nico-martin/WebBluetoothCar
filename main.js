const motorControl = require("./src/motorControl.js");
const bluetoothService = require("./src/bluetooth.js");
const utils = require("./src/utils.js");

const run = async () => {
  console.log("starting..");

  const mc = await motorControl();
  console.log("motor started");

  // greetings
  console.log("greet l");
  mc.left(50);
  await utils.wait(1000);
  mc.stop();

  await utils.wait(1000);
  console.log("greet r");
  mc.right(50);

  await utils.wait(1000);
  console.log("greet s");
  mc.stop();

  // listen for bluetooth commands
  bluetoothService(
    (speed = 0) => (speed === 0 ? mc.stop() : mc.left(speed)),
    (speed = 0) => (speed === 0 ? mc.stop() : mc.right(speed))
  );
};

run();
