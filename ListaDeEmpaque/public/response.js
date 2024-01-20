const responseListaEmpaque = {
  obtenerDataContenedor: async data =>{
    return {status:200, data:data.data};
  },
  obtenerCajasSinPallet: async data =>{
    return data.data;
  },
  obtenerLoteVaciando: async data => {
    return {status:200, data:data.data};
  },
  guardarSettingsPallet: async (data) => {
    return {status:200, data:data.data, sinPallet:data.sinPallet};
  },
  guardarItem: async (data) => {
    return {status:200, data:data.data, sinPallet:data.sinPallet};
  },
  eliminarItem: async (data) => {
    return {status:200, data:data.data, sinPallet:data.sinPallet};
  },
  moverItem: async (data) => {
    return {status:200, data:data.data, sinPallet:data.sinPallet};
  },
  restarItem: async (data) => {
    return {status:200, data:data.data, sinPallet:data.sinPallet};
  },
  liberacionPallet: async (data) => {
    return {status:200, data:data.data, sinPallet:data.sinPallet};
  },
  cerrarContenedor: async (data) => {
    return {status:200, data:data.data, sinPallet:data.sinPallet};
  },
};

module.exports = {
  responseListaEmpaque
};