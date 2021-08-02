process.env["BLENO_DEVICE_NAME"] = "Nicos Web BLE Car";

const pkg = require("../package.json");
const bleno = require("bleno");
const Characteristic = bleno.Characteristic;
const deviceInfo = require("./deviceInfo");

const bluetoothService = async (leftWheel, rightWheel) => {
  const serial = await deviceInfo.deviceSerial();

  const deviceInfoService = {
    uuid: "ff01",
    characteristics: [
      new Characteristic({
        uuid: "ff02",
        properties: ["read"],
        value: new Buffer(pkg.version),
        descriptors: [
          new bleno.Descriptor({
            uuid: "ff03",
            value: "software version",
          }),
        ],
      }),
      new Characteristic({
        uuid: "ff04",
        properties: ["read"],
        value: new Buffer(serial),
        descriptors: [
          new bleno.Descriptor({
            uuid: "ff05",
            value: "device serial number",
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
          data = JSON.parse(data.toString());

          if (!("left" in data) || !("right" in data)) {
            console.log("ERROR: invalid data");
            callback(Characteristic.RESULT_UNLIKELY_ERROR);
            return;
          }

          const left = parseInt(data.left);
          const right = parseInt(data.right);

          console.log({ left, right });

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
      /*
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
          console.log("write right", speed);

          if (isNaN(speed) || speed < -100 || speed > 100) {
            console.log("ERROR: value has to be between -100 and 100");
            callback(Characteristic.RESULT_UNLIKELY_ERROR);
            return;
          }

          rightWheel(speed);
          callback(Characteristic.RESULT_SUCCESS);
        },
      }),*/
    ],
  };

  bleno.on("stateChange", (state) => {
    if (state === "poweredOn") {
      console.log("Bluetooth started");
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
