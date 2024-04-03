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
const send_add_formularios_calidad = async () => {
  try {
    let fileContents = fs.readFileSync(
      `C:/Users/SISTEMA/Documents/Servidor/Server2.0/Files/formulariosApp/index.html`
    );
    return fileContents;

  } catch (e) {
    logger.error("send_add_formularios_calidad", e);
  }
};
const getPublic = async (data) => {
  try {
    const type = data.split(".");
    const extension = type[type.length - 1];
    let fileContents;
    if(fs.existsSync(`C:/Users/SISTEMA/Documents/Servidor/Server2.0/Files/public${data}`)){
      fileContents = fs.readFileSync(
        `C:/Users/SISTEMA/Documents/Servidor/Server2.0/Files/public${data}`
      );
    }
    console.log(extension);

    if(extension === "png")
      return {data:fileContents, head: {"Content-Type": "image/jpeg"}};
    else if(extension === "svg")
      return {data:fileContents, head: {"Content-Type": "image/svg+xml"}};
    else if(extension === "webp")
      return {data:fileContents, head: {"Content-Type": "image/webp"}};
    else {
      fileContents = fs.readFileSync(
        `C:/Users/SISTEMA/Documents/Servidor/Server2.0/Files/formulariosApp/${data}/index.html`
      );
      return {data:fileContents, head: { "Content-Type": "text/html" }};
    }
   
  } catch (e) {
    logger.error("getCelifrutSetupBlockMap", e);
  }
};

module.exports = {
  send_app_Tv,
  send_assets_app_Tv,
  send_add_formularios_calidad,
  getPublic
};