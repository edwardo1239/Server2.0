const { addLote, addContenedor, addHistorialDescarte, addProveedor, addCliente } = require("./postProceso");

const apiProcesoPOST = {
  lotes: async(data) => {
    const response = await addLote(data);
    return response;
  },
  contenedores: async(data) => {
    const response = await addContenedor(data);
    return response;
  },
  historialDescartes: async(data) => {
    const response = await addHistorialDescarte(data);
    return response;
  },
  proveedors: async(data) => {
    const response = await addProveedor(data);
    return response;
  },
  clientes: async(data) => {
    const response = await addCliente(data);
    return response;
  },
};

module.exports.apiProcesoPOST = apiProcesoPOST;