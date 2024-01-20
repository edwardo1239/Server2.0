const { obtenerLoteVaciandoEncerado, ingresarDescarteEncerado } = require("./functions/descarteEncerado");
const { obtenerLoteVaciandoLavado, ingresarDescarteLavado } = require("./functions/descarteLavado");

const api = {
  obtenerLoteVaciandoLavado: async () => {
    try {
      const lote = await obtenerLoteVaciandoLavado();
      const response = { status: 200, data: lote };
      return response;
    } catch (e) {
      console.log(e);
      return { status: 401, data: `Failure obtenerLote:${e.message}` };
    }
  },
  ingresarDescarteLavado: async data => {
    try {
      const res = await ingresarDescarteLavado(data);
      const response = { status: res.status };
      return response;
    } catch (e) {
      console.log(e);
      return { status: 401, data: `Failure obtenerLote:${e.message}` };
    }
  },
  obtenerLoteVaciandoEncerado: async () => {
    try {
      const lote = await obtenerLoteVaciandoEncerado();
      const response = { status: 200, data: lote };
      return response;
    } catch (e) {
      console.log(e);
      return { status: 401, data: `Failure obtenerLote:${e.message}` };
    }
  },
  ingresarDescarteEncerado: async data => {
    try {
      const res = await ingresarDescarteEncerado(data);
      const response = { status: res.status };
      return response;
    } catch (e) {
      console.log(e);
      return { status: 401, data: `Failure obtenerLote:${e.message}` };
    }
  },
};

module.exports = {
  api
};