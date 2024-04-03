const { send_add_formularios_calidad, getPublic } = require("../../../app/sendApps");
const { getOperarios } = require("../services/getData");

const getReduce = async (action) => {
//   console.log(action);
  if(action === "/" ) {
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