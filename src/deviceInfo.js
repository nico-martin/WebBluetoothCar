const util = require("util");
const exec = util.promisify(require("child_process").exec);

deviceSerial = async () => {
  try {
    const resp = await exec(
      "cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2"
    );
    return resp.stdout;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { deviceSerial };
