const motorControl = require("./src/motorControl.js");
const bluetoothService = require("./src/bluetooth.js");
const utils = require("./src/utils.js");

const run = async () => {
  bluetoothService();

  return;
  console.log("starting..");
  
  const mc = await motorControl();
  console.log("motor started");

  mc.left(50);
  mc.right(100);
  await utils.wait(2000);

  mc.left(-50);
  mc.right(-100);
  await utils.wait(2000);

  mc.stop();
};

run();