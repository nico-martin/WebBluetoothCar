process.env["BLENO_DEVICE_NAME"] = "Nicos Web BLE Car";

const pkg = require("../package.json");
const bleno = require("bleno");
const Characteristic = bleno.Characteristic;
const deviceInfo = require("./deviceInfo");

const bluetoothService = async (leftWheel, rightWheel) => {
  const serial = await deviceInfo.deviceSerial();

  // standard service and characertistic UUIDs
  // https://btprodspecificationrefs.blob.core.windows.net/assigned-values/16-bit%20UUID%20Numbers%20Document.pdf
  const deviceInfoService = {
    uuid: "180a",
    characteristics: [
      new Characteristic({
        uuid: "2a29", // Manufacturer Name
        properties: ["read"],
        value: new Buffer("Nico Martin"),
      }),
      new Characteristic({
        uuid: "2a28", // Software Revision
        properties: ["read"],
        value: new Buffer(pkg.version),
      }),
      new Characteristic({
        // since serial_number_string (2a25) is blocked, we take the Model Number
        // https://github.com/WebBluetoothCG/registries/blob/master/gatt_blocklist.txt#L50-L52
        uuid: "2a24", // Model Number
        properties: ["read"],
        value: new Buffer(serial),
      }),
    ],
  };

  // custom service and characertistic UUIDs
  const motorControlService = {
    uuid: "c10e3e56-fdd3-11eb-9a03-0242ac130003",
    characteristics: [
      new Characteristic({
        uuid: "fff2",
        properties: ["write"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "fff3",
            value:
              "motorControlOld Characteristic for both wheels, expects a ByteArray with two elements (left- and right wheel) between 0 and 200",
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
      new Characteristic({
        uuid: "35a1022c-fdd3-11eb-9a03-0242ac130003",
        properties: ["write"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "95675d7c-fdd4-11eb-9a03-0242ac130003",
            value:
              "motorControl Characteristic for both wheels, expects a ByteArray with two elements (left- and right wheel) between 0 and 200",
          }),
        ],
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          console.log(data);
          console.log('RESULT_INVALID_ATTRIBUTE_LENGTH', data.length !== 2);
          const left = data.readUInt8(0);
          const right = data.readUInt8(1);
          console.log({left,right});

          if(data.length !== 2) {
            callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
          }

          callback(Characteristic.RESULT_SUCCESS);
/*
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
          callback(Characteristic.RESULT_SUCCESS);*/
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

  bleno.on("disconnect", () => {
    console.log("disconnected from client");
    leftWheel(0);
    rightWheel(0);
  });
};

module.exports = bluetoothService;
