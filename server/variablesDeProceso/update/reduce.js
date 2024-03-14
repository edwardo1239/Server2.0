const { modificar_predio_proceso_descartes, modificar_predio_proceso_listaEmpaque } = require("./functions");

const updateApi = {
  modificar_predio_proceso_descartes: async data => {
    const lote = data.data.lote;
    return await modificar_predio_proceso_descartes(lote);
  },
  modificar_predio_proceso_listaEmpaque: async data => {
    const lote = data.data.lote;
    return await modificar_predio_proceso_listaEmpaque(lote);
  }
};

module.exports.updateApi = updateApi;