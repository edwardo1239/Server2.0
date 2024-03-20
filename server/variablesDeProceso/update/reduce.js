const { modificar_predio_proceso_descartes, modificar_predio_proceso_listaEmpaque, add_orden_de_vaceo } = require("./functions");

const updateApi = {
  modificar_predio_proceso_descartes: async data => {
    const lote = data.data.lote;
    return await modificar_predio_proceso_descartes(lote);
  },
  modificar_predio_proceso_listaEmpaque: async data => {
    const lote = data.data.lote;
    return await modificar_predio_proceso_listaEmpaque(lote);
  },
  add_orden_de_vaceo: async data => {
    return await add_orden_de_vaceo(data.data);
  }
};

module.exports.updateApi = updateApi;