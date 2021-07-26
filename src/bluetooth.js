process.env["BLENO_DEVICE_NAME"] = "Nicos Web BLE Car";

const bleno = require("bleno");
const Characteristic = bleno.Characteristic;

const bluetoothService = (leftWheel, rightWheel) => {

  const motorControlService = {
    uuid: "fff1",
    characteristics: [
      new Characteristic({
        uuid: "fff2",
        properties: ["write"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "fff3",
            value: "motorControl Characteristic for left wheel, expects a number between -100 and 100"
          })
        ],
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          const speed = parseInt(data.toString());

	  if(isNaN(speed) || speed < -100 || speed > 100){
            console.log("ERROR: value has to be between -100 and 100");
            callback("error");
            return;
          }

          leftWheel(speed);
          callback("success");
        },
      }),
      new Characteristic({
        uuid: "fff4",
        properties: ["write"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "fff5",
            value: "motorControl Characteristic for right wheel, expects a number between -100 and 100"
          })
        ],
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          const speed = parseInt(data.toString());

	  if(isNaN(speed) || speed < -100 || speed > 100){
            console.log("ERROR: value has to be between -100 and 100");
            callback("error");
            return;
          }

          rightWheel(speed);
          callback("success");
        },
      })
    ]
  };

  bleno.on("stateChange", function(state) {
    if(state === "poweredOn"){
      console.log("Bluetooth started");
      bleno.startAdvertising("WebBluetoothCar", [motorControlService.uuid]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on("advertisingStart", function(err){
    if(err){
      console.log("advertisingStart error", err);
      return;
    }
  
    bleno.setServices([
      motorControlService
    ]);
  });
};

module.exports = bluetoothService;