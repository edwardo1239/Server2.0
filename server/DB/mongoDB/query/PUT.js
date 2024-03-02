const { apiPersonalPUT } = require("./PUT/personal/reduce");
const { apiProcesoPUT } = require("./PUT/proceso/reduce");

const apiPUT = {
  proceso: async(data) => {
    const response = await apiProcesoPUT[data.collection](data);
    process.send(response);
  },
  personal: async(data) => {
    const response = await apiPersonalPUT[data.collection](data);
    process.send(response);
  },
};

module.exports.apiPUT = apiPUT;