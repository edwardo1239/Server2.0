const { get_orden_de_vaceo } = require("./function");

const getApi = {
  get_orden_de_vaceo: async () => {
    return await get_orden_de_vaceo();
  }
};

module.exports.getApi = getApi;