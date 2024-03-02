const { getProveedores, getClientes, getlotes, getHistorialLotes, getContenedores, getHistorialDescartes } = require("./getProceso");

const apiProceso = {
  proveedors: async(data) => {
    const response = await getProveedores(data);
    return response;
  },
  clientes: async(data) => {
    const response = await getClientes(data);
    return response;
  },
  lotes: async(data) => {
    const response = await getlotes(data);
    return response;
  },
  historialLotes: async(data) => {
    const response = await getHistorialLotes(data);
    return response;
  },
  contenedores: async(data) => {
    const response = await getContenedores(data);
    return response;
  },
  historialDescartes: async(data) => {
    const response = await getHistorialDescartes(data);
    return response;
  },
};

module.exports.apiProceso = apiProceso;