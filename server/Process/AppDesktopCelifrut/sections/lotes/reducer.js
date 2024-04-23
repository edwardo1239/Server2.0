const { apiVariablesProceso } = require("../../../../variablesDeProceso/reduce");
const { sendData } = require("../../utils/sendData");
const codeError = require("../../../../error/codeErrors.json");
const { logger } = require("../../../../error/config");

const sendAndHandleData = async (data, fn) => {
  const response = await sendData({ ...data, fn });
  if(response.response.status !== 200)
    throw new Error(`${response.response.message}`);
  return { ...response, status: response.response.status, message: response.response.message };
};

const apiLotes = {
  getLotes: data => sendAndHandleData(data, "GET"),
  guardarLote: async data => {
    const enf = await apiVariablesProceso.generarEF1();
    data.data = { ...data.data, enf: enf.response };
    const response = await sendAndHandleData(data, "POST");
    process.send({ ...response, fn: "ingresoLote", status: response.response.status, message: response.response.message });
    return response;
  },
  vaciarLote: async data => {
    const response = await sendAndHandleData(data, "PUT");
    const EF1 = await apiVariablesProceso.procesarEF1(data);
    process.send({ ...EF1, fn: "vaciado" });
    if (EF1.status === 200 && response.response.status === 200 ) {
      return response;
    } else {
      logger.error(`${response.response.satatus}: ${response.response.message} y EF1 ${EF1.status}: ${EF1.message}`);
      return {
        ...data,
        response:{        
          satatus: codeError.STATUS_ERROR_FUNCTION.code,
          message: `${codeError.STATUS_ERROR_FUNCTION.message} apiVariablesProceso.procesarEF1`,}
      };
      
    }
  },
  putLotes: async data => {
    const response = await sendAndHandleData(data, "PUT");
    if (response.response.status === 200) {
      process.send({ ...response, fn: "procesoLote", status: response.response.status, message: response.response.message }); 
    }
    return response;
  },
  obtenerHistorialLotes: data => sendAndHandleData(data, "GET"),
  modificarHistorial: data => sendAndHandleData(data, "PUT"),
  desverdizado: data => sendAndHandleData(data, "PUT"),
  reprocesoCelifrut: async data => {
    const enf = await apiVariablesProceso.generarCelifrut();
    data.data = { ...data.data, enf: enf.response };
    const response = await sendAndHandleData(data, "POST");
    if (response.response.status === 200) {
      const EF1 = await apiVariablesProceso.procesarEF1({
        data: {
          lote: { ...data.data, _id: response.response.data._id, predio: { _id: data.data.predio, PREDIO: "Celifrut" } },
        },
      });
      process.send({ ...EF1, fn: "vaciado" });
      if (EF1.status === 200) {
        return response;
      } else {
        return {
          ...response,
          satatus: codeError.STATUS_ERROR_FUNCTION.code,
          message: `${codeError.STATUS_ERROR_FUNCTION.message} apiVariablesProceso.procesarEF1`,
        };
      }
    }
  },
  addHistorialDescarte: data => sendAndHandleData(data, "POST"),
  getHistorialDescartes: data => sendAndHandleData(data, "GET"),
  putHistorialLote: data => sendAndHandleData(data, "PUT"),
  addPrecio: data => sendAndHandleData(data, "POST"),
  modificar_lote: async data => {
    if(data.user.cargo !== "admin"){
      return{...data, response:{status:301,message:"No tiene los permisos para modificar la informacion de lotes"}};
    }
    const response = await sendData({ ...data, fn:"PUT", action:"putLotes"});
    let changes = {};
    for (let key in data.data.lote) {
      if (response.response.record[key] !== data.data.lote[key]) {
        changes[key] = {
          from: response.response.record[key],
          to: data.data.lote[key]
        };
      }
    }
    const cambios = JSON.stringify(changes);
    process.send({ fn: "ingresoLote", status:200 });

    await process.send({
      fn:"lotes",
      DB: "recordDB", 
      record:cambios, 
      tipo:data.record, 
      action:"modificar_lote",
      user:data.user.user});

    
    return response;
  }
};

module.exports.apiLotes = apiLotes;
