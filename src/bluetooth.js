process.env["BLENO_DEVICE_NAME"] = "Nico Car";

const bleno = require("bleno");
const Characteristic = bleno.Characteristic;

const exampleService = {
  uuid: "fff6",
  characteristics: [
    new Characteristic({
      uuid: "fff7",
      properties: ["write"],
      descriptors: [
        new bleno.Descriptor({
          uuid: "2901",
          value: "My Test"
        })
      ],
      onWriteRequest: (data, offset, withoutResponse, callback) => {
        data = data.toString();
        if(data === "stop"){
          console.log("STOP THE ENGINE!");
          callback("success");
          return;
        }

        const parts = data.split(":");
        if(parts.length !== 2){
          console.log("ERROR: invalid input data");
          callback("error");
          return;
        }

        const position = parts[0];
        if(position !== "l" && position !== "r"){
          console.log("ERROR: first value has to be r or l");
          callback("error");
          return;
        }

        const speed = parseInt(parts[1]);
        if(isNaN(speed) || speed < -100 || speed > 100){
          console.log("ERROR: second value has to be between -100 and 100");
          callback("error");
          return;
        }

        console.log(`should turn ${position === "l" ? "left" : "right"} wheel width speed ${speed}%`);
        callback("success");
      },
    })
  ]
};

const bluetoothService = () => {
  bleno.on("stateChange", function(state) {
    if(state === "poweredOn"){
      console.log("Bluetooth poweredOn");
      bleno.startAdvertising("nicosRpi", [exampleService.uuid]);
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
      exampleService
    ]);
  });
};

module.exports = bluetoothService;