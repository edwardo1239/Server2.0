const { send_app_Tv, send_assets_app_Tv, send_add_formularios_calidad, getPublic } = require("../../../app/sendApps");
const { isNewVersion, getVersionDocument, getCelifrutAppFile, getOperarios } = require("../functions/functions");

const getReduce = async (action, value) => {
  if (action === "/newVersion") {
    const response = await isNewVersion(value);
    return [response, { "Content-Type": "text/plain" }];
  }
  else if (action === "/latest.yml?noCache") {
    const file = await getVersionDocument();
    return [file, { "Content-Type": "text/yaml" }];
  }
  else if (action.startsWith("/celifrutdesktopap")) {
    const response = await getCelifrutAppFile(action);
    return [response, { "Content-Type": "application/octet-stream" }];
  }
  else if (action === "/AppTV") {
    const response = await send_app_Tv();
    return [response, { "Content-Type": "text/html" }];
  }
  else if(action.startsWith("/TvApp/assets/")){
    const response = await send_assets_app_Tv(action);
    return [response, { "Content-Type": "application/javascript" }];
  }
  else if (action === "/formularios-App"){
    const response = await send_add_formularios_calidad();
    return [response, { "Content-Type": "text/html" }];
  }
  else if(action === "/getOperarios") {
    const response = await getOperarios();
    const responseJSON = JSON.stringify(response);
    return [responseJSON, {  "Content-Type": "text/plain" }];
  }
  else{
    const response = await getPublic(action);
    return [response.data, response.head];


  }
};

module.exports.getReduce = getReduce;