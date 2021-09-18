const motorControl = require("./src/motorControl.js");
const bluetoothService = require("./src/bluetooth.js");
const utils = require("./src/utils.js");
const { scrollText, basicMatrix } = require("matrix11x7");

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

  const mc = await motorControl();

  // greetings
  const ledDisplay = await scrollText("Ready", {
    infinite: false,
  });

  // listen for bluetooth commands
  await bluetoothService(
    async () => {
      basicMatrix(ledMatrix.go, ledDisplay);
      await utils.wait(200);
      basicMatrix(ledMatrix.stop, ledDisplay);
    },
    ({ speedLeft = 0, speedRight = 0 }) => {
      if (speedLeft === 0 || speedRight === 0) {
        mc.stop();
        basicMatrix(ledMatrix.stop);
      } else {
        mc.left(speedLeft);
        mc.right(speedRight);
        basicMatrix(ledMatrix.go, ledDisplay);
      }
    }
  );

  console.log("started");
};

run();
