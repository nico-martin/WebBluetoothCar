process.env["BLENO_DEVICE_NAME"] = "Nicos Web BLE Car";

const pkg = require("../package.json");
const bleno = require("bleno");
const Characteristic = bleno.Characteristic;

const bluetoothService = (leftWheel, rightWheel) => {
  const deviceInfoService = {
    uuid: "fff7",
    characteristics: [
      new Characteristic({
        uuid: "fff8",
        properties: ["read"],
        value: new Buffer(pkg.version),
        descriptors: [
          new bleno.Descriptor({
            uuid: "fff9",
            value: "software version",
          }),
        ],
      }),
    ],
  };

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
              "motorControl Characteristic for left wheel, expects a number between -100 and 100",
          }),
        ],
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          const speed = parseInt(data.toString());

          if (isNaN(speed) || speed < -100 || speed > 100) {
            console.log("ERROR: value has to be between -100 and 100");
            callback(Characteristic.RESULT_UNLIKELY_ERROR);
            return;
          }

          leftWheel(speed);
          callback(Characteristic.RESULT_SUCCESS);
        },
      }),
      new Characteristic({
        uuid: "fff4",
        properties: ["write"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "fff5",
            value:
              "motorControl Characteristic for right wheel, expects a number between -100 and 100",
          }),
        ],
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          const speed = parseInt(data.toString());

          if (isNaN(speed) || speed < -100 || speed > 100) {
            console.log("ERROR: value has to be between -100 and 100");
            callback(Characteristic.RESULT_UNLIKELY_ERROR);
            return;
          }

          rightWheel(speed);
          callback(Characteristic.RESULT_SUCCESS);
        },
      }),
    ],
  };

  bleno.on("stateChange", (state) => {
    if (state === "poweredOn") {
      console.log("Bluetooth started");
      bleno.startAdvertising("WebBluetoothCar", [motorControlService.uuid]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on("advertisingStart", (err) => {
    if (err) {
      console.log("advertisingStart error", err);
      return;
    }

    bleno.setServices([deviceInfoService, motorControlService]);
  });
};

module.exports = bluetoothService;
