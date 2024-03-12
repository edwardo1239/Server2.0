const { apiPersonal } = require("./GET/personal/reduce");
const { apiProceso } = require("./GET/proceso/reduce");

const apiGET = {
  personal: async(data) => {
    const response = await apiPersonal[data.collection](data);
    process.send(response);
  },
  proceso: async(data) => {
    const response = await apiProceso.request(data);
    process.send(response);
  }
};

module.exports.apiGET = apiGET;