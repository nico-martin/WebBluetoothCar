process.env["BLENO_DEVICE_NAME"] = "Nico Car";

const bleno = require("bleno");
const Characteristic = bleno.Characteristic;

const exampleService = {
  uuid: "fff6",
  characteristics: [
    new Characteristic({
      uuid: "fff7",
      properties: ["read", "write"],
      descriptors: [
        new bleno.Descriptor({
          uuid: "2901",
          value: "My Test"
        })
      ],
      onReadRequest: (offset, callback) => {
        console.log("onRead", offset);
        callback("SUCCESS");
      },
      onWriteRequest: (data, offset, withoutResponse, callback) => {
        console.log("onWrite", offset);
        console.log(data.readUInt8(0));
        callback();
      },
    })
  ]
};

bleno.on("stateChange", function(state) {
  console.log("on stateChange:" + state);
  if(state === "poweredOn"){
    bleno.startAdvertising("nicosRpi", [exampleService.uuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on("advertisingStart", function(err){
  if(err){
    console.log("advertisingStart error", err);
    return ;
  }
  
  bleno.setServices([
    exampleService
  ]);
});