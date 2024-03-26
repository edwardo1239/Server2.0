const fs = require("fs");
const { logger } = require("../error/config");

const send_app_Tv = async () => {
  try {
    let fileContents = fs.readFileSync(
      `C:/Users/SISTEMA/Documents/Servidor/Server2.0/Files/TvApp/index.html`
    );
    return fileContents;

  } catch (e) {
    logger.error("send_app_Tv", e);
  }
};
const send_assets_app_Tv = async (data) => {
  try {
    let fileContents = fs.readFileSync(
      `C:/Users/SISTEMA/Documents/Servidor/Server2.0/Files${data}`
    );
    return fileContents;

  } catch (e) {
    logger.error("getCelifrutSetupBlockMap", e);
  }
};

module.exports = {
  send_app_Tv,
  send_assets_app_Tv
};