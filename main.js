const motorControl = require("./src/motorControl.js");
const bluetoothService = require("./src/bluetooth.js");
const utils = require("./src/utils.js");

const run = async () => {
  console.log("starting..");

  const mc = await motorControl();
  console.log("motor started");

  mc.left(50);
  mc.right(50);
  await utils.wait(50);
  mc.stop();

  bluetoothService((cmd, speed = 0) => {
    if (cmd === "stop") {
      mc.stop();
    } else if (cmd === "l") {
      mc.left(speed);
    } else if (cmd === "r") {
      mc.right(speed);
    } else {
      console.log("ERROR: invalid command");
    }
  });
};

run();
