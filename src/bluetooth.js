process.env["BLENO_DEVICE_NAME"] = "Nicos Web BLE Car";

const pkg = require("../package.json");
const bleno = require("bleno");
const Characteristic = bleno.Characteristic;
const deviceInfo = require("./deviceInfo");

const bluetoothService = async (leftWheel, rightWheel) => {
  const serial = await deviceInfo.deviceSerial();

  const deviceInfoService = {
    uuid: "180a",
    characteristics: [
      new Characteristic({
        uuid: "2a29", // Manufacturer Name
        properties: ["read"],
        value: new Buffer("Nico Martin"),
      }),
      new Characteristic({
        uuid: "2a27", // Software Revision
        properties: ["read"],
        value: new Buffer(pkg.version),
      }),
      new Characteristic({
        uuid: "2a25", // Serial number
        properties: ["read"],
        value: new Buffer(serial),
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
          data = JSON.parse(data.toString());

          if (!("left" in data) || !("right" in data)) {
            console.log("ERROR: invalid data");
            callback(Characteristic.RESULT_UNLIKELY_ERROR);
            return;
          }

          const left = parseInt(data.left);
          const right = parseInt(data.right);

          if (
            isNaN(left) ||
            left < -100 ||
            left > 100 ||
            isNaN(right) ||
            right < -100 ||
            right > 100
          ) {
            console.log("ERROR: value has to be between -100 and 100");
            callback(Characteristic.RESULT_UNLIKELY_ERROR);
            return;
          }

          leftWheel(left);
          rightWheel(right);
          callback(Characteristic.RESULT_SUCCESS);
        },
      }),
    ],
  };

  bleno.on("stateChange", (state) => {
    if (state === "poweredOn") {
      bleno.startAdvertising("WebBluetoothCar", [
        deviceInfoService.uuid,
        motorControlService.uuid,
      ]);
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
