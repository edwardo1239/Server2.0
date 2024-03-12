const { obtener_datos_lotes_cajas_sin_pallet } = require("./functions/lista_de_empaque");
const { apiVariablesProceso } = require("../../variablesDeProceso/reduce");
const { apiContenedores } = require("./contenedores/reducer");
const { apiLotes } = require("./lotes/reduce");


const apiListaEmpaque = {
  contenedores: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiContenedores, data.action)){
      const response = await apiContenedores[data.action](data);
      return response;
    }
    else {
      throw new Error("Function don't found on apiContenedores");
    }
  },
  variablesListaEmpaque: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiVariablesProceso, data.action)){
      const response = await apiVariablesProceso[data.action](data);
      if(data.action === "obtenerCajasSinPallet"){
        response.response.data = await obtener_datos_lotes_cajas_sin_pallet(response.response.data);
      }
      return response;
    }
    else {
      throw new Error("Function don't found on variablesListaEmpaque");    
    }
  },
  lotes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiLotes, data.action)){
      const response = await apiLotes[data.action](data);
      return response;
    }
    else {
      throw new Error("Function don't found on apiLotes");
    }
  },
  historialLotes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiLotes, data.action)){
      const response = await apiLotes[data.action](data);
      return response;
    }
    else {
      throw new Error("Function don't found on apiLotes");
    }
  },
};

module.exports.apiListaEmpaque = apiListaEmpaque;
