process.env["BLENO_DEVICE_NAME"] = "Nicos Web BLE Car";

const bleno = require("bleno");
const Characteristic = bleno.Characteristic;

const bluetoothService = (motorCallback) => {
  const motorControlService = {
    uuid: "fff1",
    characteristics: [
      new Characteristic({
        uuid: "fff2",
        properties: ["write"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "fff3",
            value:
              "motorControl Characteristic. Expects \"{'l'|'r'|'stop'}:{-100 - 100}\"",
          }),
        ],
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          data = data.toString();
          if (data === "stop") {
            motorCallback("stop");
            callback("success");
            return;
          }

          const parts = data.split(":");
          if (parts.length !== 2) {
            console.log("ERROR: invalid input data");
            callback("error");
            return;
          }

          const position = parts[0];
          if (position !== "l" && position !== "r") {
            console.log("ERROR: first value has to be r or l");
            callback("error");
            return;
          }

          const speed = parseInt(parts[1]);
          if (isNaN(speed) || speed < -100 || speed > 100) {
            console.log("ERROR: second value has to be between -100 and 100");
            callback("error");
            return;
          }

          motorCallback(position, speed);
          callback("success");
        },
      }),
    ],
  };

  bleno.on("stateChange", function (state) {
    if (state === "poweredOn") {
      console.log("Bluetooth started");
      bleno.startAdvertising("WebBluetoothCar", [motorControlService.uuid]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on("advertisingStart", function (err) {
    if (err) {
      console.log("advertisingStart error", err);
      return;
    }

    bleno.setServices([motorControlService]);
  });
};

module.exports = bluetoothService;
