const { obtenerDataContenedor, obtenerCajasSinPallet, obtenerLoteVaciando, guardarSettingsPallet, guardarItem, eliminarItem, moverItem, restarItem, liberacionPallet, cerrarContenedor } = require("./functions/listaDeEmpaque");

const api = {
  obtenerDataContenedor: async data => {
    const res = await obtenerDataContenedor(data);
    if (res.status === 200) {
      const response = { status: 200, data: res.data};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  obtenerCajasSinPallet: async data => {
    const res = await obtenerCajasSinPallet(data);
    if (res.status === 200) {
      const response = { status: 200, data: res.data};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  obtenerLoteVaciando: async data => {
    const res = await obtenerLoteVaciando(data);
    if (res.status === 200) {
      const response = { status: 200, data: res.data};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  guardarSettingsPallet: async data => {
    await guardarSettingsPallet(data);
    data.fn = "obtenerDataContenedor";
    const res = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet();
    if (res.status === 200) {
      const response = { status: 200, data: res.data, sinPallet:sinPallet};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  guardarItem: async data => {
    await guardarItem(data);
    data.fn = "obtenerDataContenedor";
    const res = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet();
    if (res.status === 200) {
      const response = { status: 200, data: res.data, sinPallet:sinPallet};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  eliminarItem: async data => {
    await eliminarItem(data);
    data.fn = "obtenerDataContenedor";
    const res = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet();
    if (res.status === 200) {
      const response = { status: 200, data: res.data, sinPallet:sinPallet};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  moverItem: async data =>{
    await moverItem(data);
    data.fn = "obtenerDataContenedor";
    const res = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet();
    if (res.status === 200) {
      const response = { status: 200, data: res.data, sinPallet:sinPallet};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  restarItem: async data => {
    await restarItem(data);
    data.fn = "obtenerDataContenedor";
    const res = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet();
    if (res.status === 200) {
      const response = { status: 200, data: res.data, sinPallet:sinPallet};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  liberacionPallet: async data => {
    await liberacionPallet(data);
    data.fn = "obtenerDataContenedor";
    const res = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet();
    if (res.status === 200) {
      const response = { status: 200, data: res.data, sinPallet:sinPallet};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  },
  cerrarContenedor: async data => {
    await cerrarContenedor(data);
    data.fn = "obtenerDataContenedor";
    const res = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet();
    if (res.status === 200) {
      const response = { status: 200, data: res.data, sinPallet:sinPallet};
      return response;
    } else {
      const response = { status: 400 };
      return response;
    }
  }
  
};

module.exports = {
  api
};