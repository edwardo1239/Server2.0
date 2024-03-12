const funciones = {
  proveedors: require("./getProceso").getProveedores,
  clientes: require("./getProceso").getClientes,
  lotes: require("./getProceso").getlotes,
  historialLotes: require("./getProceso").getHistorialLotes,
  contenedores: require("./getProceso").getContenedores,
  historialDescartes: require("./getProceso").getHistorialDescartes
};

const apiProceso = {
  request: async (data) => {
    if (funciones[data.collection]) {
      const response = await funciones[data.collection](data);
      return response;
    } else {
      throw new Error(`Función ${data.collection} no soportada`);
    }
  }
};

module.exports.apiProceso = apiProceso;