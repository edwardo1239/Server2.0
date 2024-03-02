const { deleteProveedores, deleteCliente } = require("./deleteProceso");

const apiProcesoDelete = {

  proveedors: async(data) => {
    const response = await deleteProveedores(data);
    return response;
  },
  clientes: async(data) => {
    const response = await deleteCliente(data);
    return response;
  },
};

module.exports.apiProcesoDelete = apiProcesoDelete;