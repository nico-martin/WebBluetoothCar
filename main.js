const motorControl = require("./src/motorControl.js");
const bluetoothService = require("./src/bluetooth.js");
const utils = require("./src/utils.js");
const matrix11x7 = require("matrix11x7");

const ledMatrix = {
  go: [
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
  ],
  stop: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

const run = async () => {
  console.log("starting..");

  try {
    const mc = await motorControl();
    const matrix11x7Display = await matrix11x7();

    // greetings
    await matrix11x7Display.scrollText("Ready", {
      infinite: false,
    });

    // listen for bluetooth commands
    await bluetoothService(({ speedLeft = 0, speedRight = 0 }) => {
      if (speedLeft === 0 || speedRight === 0) {
        mc.stop();
        matrix11x7Display.basicMatrix(ledMatrix.stop);
      } else {
        mc.left(speedLeft);
        mc.right(speedRight);
        matrix11x7Display.basicMatrix(ledMatrix.go, ledDisplay);
      }
    });

    console.log("started");
  } catch (e) {
    console.error(e);
  }
};

run();
