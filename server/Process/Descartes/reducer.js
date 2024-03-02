const { apiVariablesProceso } = require("../../variablesDeProceso/reduce");
const { apiLotes } = require("./lotes/reducer");


const apiDescartes = {
  variablesDescartes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiVariablesProceso, data.action)){
      const response = await apiVariablesProceso[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiProveedores"});
    }
  },
  lotes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiLotes, data.action)){
      const response = await apiLotes[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiLotes"});
    }
  },
};

module.exports.apiDescartes = apiDescartes;
