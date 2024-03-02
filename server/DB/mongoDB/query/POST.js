const { apiPersonalPOST } = require("./POST/personal/reduce");
const { apiProcesoPOST } = require("./POST/proceso/reduce");

const apiPOST = {
  proceso: async(data) => {
    if(Object.prototype.hasOwnProperty.call(apiProcesoPOST,data.collection)){
      const response = await apiProcesoPOST[data.collection](data);
      process.send(response);
    } else {
      return {...data, response:{status:404, message:"Error action no existe en proceso DB"}};
    }
  },
  personal: async(data) => {
    if(Object.prototype.hasOwnProperty.call(apiPersonalPOST,data.collection)){
      const response = await apiPersonalPOST[data.collection](data);
      process.send(response);
    } else {
      return {...data, response:{status:404, message:"Error action no existe en personal DB"}};
    }
  },
};

module.exports.apiPOST = apiPOST;