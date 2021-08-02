const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;

const SPEED_MAX = 4000;
const SPEED_MIN = 500;

const WHEELS = {
  LEFT: {
    PWM: 0,
    PIN_FORWARD: 1,
    PIN_BACKWARD: 2,
  },
  RIGHT: {
    PWM: 5,
    PIN_FORWARD: 4,
    PIN_BACKWARD: 3,
  },
};

const speedFromPercent = (percent) => {
  const rangeTop = SPEED_MAX - SPEED_MIN;
  const rangePart = rangeTop / 100;
  return rangePart * percent + SPEED_MIN;
};

const setupPwm = (left, right) =>
  new Promise((resolve, reject) => {
    const pwm = new Pca9685Driver(
      {
        i2c: i2cBus.openSync(1),
        address: 0x40,
        frequency: 50,
        debug: false,
      },
      (err) => {
        if (err) {
          console.error("Error initializing PCA9685");
          reject(err);
          process.exit(-1);
        }
        pwm.setDutyCycle(left, 100);
        pwm.setDutyCycle(right, 100);
        resolve(pwm);
      }
    );
  });

const motorControl = async () => {
  const pwm = await setupPwm(WHEELS.LEFT.PWM, WHEELS.RIGHT.PWM);

  return {
    left: (speed) => {
      const forward = speed >= 0;
      if (forward) {
        pwm.channelOff(WHEELS.LEFT.PIN_BACKWARD);
        pwm.setPulseRange(WHEELS.LEFT.PIN_FORWARD, 0, speedFromPercent(speed));
      } else {
        pwm.channelOff(WHEELS.LEFT.PIN_FORWARD);
        pwm.setPulseRange(
          WHEELS.LEFT.PIN_BACKWARD,
          0,
          speedFromPercent(speed * -1)
        );
      }
    },
    right: (speed) => {
      const forward = speed >= 0;
      if (forward) {
        pwm.channelOff(WHEELS.RIGHT.PIN_BACKWARD);
        pwm.setPulseRange(WHEELS.RIGHT.PIN_FORWARD, 0, speedFromPercent(speed));
      } else {
        pwm.channelOff(WHEELS.RIGHT.PIN_FORWARD);
        pwm.setPulseRange(
          WHEELS.RIGHT.PIN_BACKWARD,
          0,
          speedFromPercent(speed * -1)
        );
      }
    },
    stop: () => {
      pwm.channelOff(WHEELS.LEFT.PIN_FORWARD);
      pwm.channelOff(WHEELS.LEFT.PIN_BACKWARD);
      pwm.channelOff(WHEELS.RIGHT.PIN_FORWARD);
      pwm.channelOff(WHEELS.RIGHT.PIN_BACKWARD);
    },
  };
};

module.exports = motorControl;
