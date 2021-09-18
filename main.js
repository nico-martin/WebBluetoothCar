const motorControl = require("./src/motorControl.js");
const bluetoothService = require("./src/bluetooth.js");
const utils = require("./src/utils.js");
const { scrollText } = require("matrix11x7");

const run = async () => {
  console.log("starting..");

  const mc = await motorControl();

  // greetings
  scrollText(`Hello, I'm ready!`, {
    infinite: false,
  });

  // listen for bluetooth commands
  await bluetoothService(({ speedLeft = 0, speedRight = 0 }) => {
    if (speedLeft === 0 || speedRight === 0) {
      mc.stop();
    } else {
      mc.left(speedLeft);
      mc.right(speedRight);
    }
  });

  console.log("started");
};

run();
