const { get_orden_de_vaceo, obtener_EF1_procesando } = require("./function");

const getApi = {
  get_orden_de_vaceo: async () => {
    return await get_orden_de_vaceo();
  },
  obtener_EF1_procesando: async () => {
    return await obtener_EF1_procesando();
  }
};

module.exports.getApi = getApi;