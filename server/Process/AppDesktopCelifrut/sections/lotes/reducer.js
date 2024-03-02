const { apiVariablesProceso } = require("../../../../variablesDeProceso/reduce");
const { sendData } = require("../../utils/sendData");

const apiLotes = {
  getLotes: async data => {
    const response = await sendData({ ...data, fn: "GET" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  guardarLote: async data => {
    const enf = await apiVariablesProceso.generarEF1();
    data.data = { ...data.data, enf: enf.response };
    const response = await sendData({ ...data, fn: "POST" });
    console.log(response);
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  vaciarLote: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status === 200) {
      const EF1 = await apiVariablesProceso.procesarEF1(data);
      process.send({ ...EF1, fn: "vaciado" });
      if (EF1.status === 200) {
        return { ...response, satatus: response.response.status, message: response.response.message };
      } else {
        return {
          ...response,
          satatus: 404,
          message: "Error en configurando las variables del sistema, el predio se vacio  en la base de datos con exito",
        };
      }
    }
  },
  putLotes: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  obtenerHistorialLotes: async data => {
    const response = await sendData({ ...data, fn: "GET" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  modificarHistorial: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  desverdizado: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  reprocesoCelifrut: async data => {
    const enf = await apiVariablesProceso.generarCelifrut();
    data.data = { ...data.data, enf: enf.response };
    const response = await sendData({ ...data, fn: "POST" });
    if (response.response.status === 200) {
      const EF1 = await apiVariablesProceso.procesarEF1({
        data: {
          lote: { ...data.data, _id: response.response.data._id, predio: { _id: data.data.predio, PREDIO: "Celifrut" } },
        },
      });
      process.send({ ...EF1, fn: "vaciado" });
      if (EF1.status === 200) {
        return { ...response, satatus: response.response.status, message: response.response.message };
      } else {
        return {
          ...response,
          satatus: 404,
          message: "Error en configurando las variables del sistema, el predio se vacio  en la base de datos con exito",
        };
      }
    }
  },
  addHistorialDescarte: async data => {
    const response = await sendData({ ...data, fn: "POST" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  getHistorialDescartes: async data => {
    const response = await sendData({ ...data, fn: "GET" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },

};

module.exports.apiLotes = apiLotes;
