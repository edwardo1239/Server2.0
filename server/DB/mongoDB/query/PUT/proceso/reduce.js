const { putLote, putProveedor, putCliente, putContenedor, agregarSettingsPallet, addPallet, eliminarItem, restarItem, liberarPallet, putHistorialLote } = require("./putProceso");

const apiProcesoPUT = {
  lotes: async(data) => {
    const response = await putLote(data);
    return response;
  },
  proveedors: async(data) => {
    const response = await putProveedor(data);
    return response;
  },
  clientes: async(data) => {
    const response = await putCliente(data);
    return response;
  },
  contenedores: async(data) => {
    if(data.action === "putContenedores"){
      const response = await putContenedor(data);
      return response;
    } else if (data.action === "agregarSettingsPallet"){
      const response = await agregarSettingsPallet(data);
      return response;
    } else if (data.action === "addPallet"){
      const response = await addPallet(data);
      return response;
    } else if (data.action === "eliminarItem"){
      const response = await eliminarItem(data);
      return response;
    } else if (data.action === "restarItem"){
      const response = await restarItem(data);
      return response;
    } else if (data.action === "liberarPallet"){
      const response = await liberarPallet(data);
      return response;
    } 
  },
  historialLotes: async(data) => {
    const response = await putHistorialLote(data);
    return response;
  },
};

module.exports.apiProcesoPUT = apiProcesoPUT;