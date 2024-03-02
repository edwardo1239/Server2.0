const { apiVariablesProceso } = require("../../../variablesDeProceso/reduce");
const { addExportacionLote, subExportacionLote, addContenedorLote } = require("../functions/lista_de_empaque");
const { sendData } = require("../sendData");

const apiContenedores = {
  getContenedores: async data => {
    const response = await sendData({ ...data, fn: "GET" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  putContenedor: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  agregarSettingsPallet: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  addPallet: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status === 200) {
      await addExportacionLote(data);
    }
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  addSinPallet: async data => {
    try{
      let response;
      const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();
      cajasSinPallet.response.data.push(data.data.contenedor.item);
      const responseGuardarCajasSinPallet = await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);
      if (responseGuardarCajasSinPallet.status === 200) {
        response =  await addExportacionLote(data);
      }
      return {...data, response:response};
    } catch(e){
      return {...data, response:{status: 401, message: `Error en addSinPallet ${e}`}};

    }
  },
  eliminarItem: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    const items = response.response.data;
    const len = items.length;
    for (let i = 0; i < len; i++) {
      const response = await subExportacionLote(items[i]);
      if (response.status !== 200) return { status: response.status, message: response.message };
    }
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  eliminatItemSinPallet: async data => {
    const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();

    const selecciones = data.data.contenedor.item.sort((a, b) => b - a);
    const len = selecciones.length;
    for (let i = 0; i < len; i++) {
      try {
        data.response = {};
        data.response.data = cajasSinPallet.response.splice(selecciones[i], 1)[0];
        await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response);
        await subExportacionLote(data.response.data);
      } catch (e) {
        return { ...data, satatus: 401, message: `error elimiando datos sin pallet: ${e}` };
      }
    }
    return { ...data, satatus: 200, message: "Ok" };
  },
  restarItem: async data => {
    try {
      let response = await sendData({ ...data, fn: "PUT" });
      if (response.response.status !== 200) {
        return { ...data, satatus: response.response.status, message: response.response.message };
      }
      const item = {
        lote: response.response.data.lote,
        cajas: data.data.contenedor.cajas,
        tipoCaja: response.response.data.tipoCaja,
        calidad: response.response.data.calidad,
      };
      response = await subExportacionLote(item);

      return { ...data, response: response };
    } catch (e) {
      return { status: 401, message: `Error en restarItem ${e}` };
    }
  },
  moverItemEntreContenedores: async data => {
    try {
      data.action = "restarItem";
      data.data.contenedor = {};
      data.data.contenedor._id = data.data.contenedor1._id;
      data.data.contenedor.pallet = data.data.contenedor1.pallet;
      data.data.contenedor.item = data.data.contenedor1.index;
      data.data.contenedor.cajas = data.data.cajas;
      let response = await sendData({ ...data, fn: "PUT" });
      if (response.response.status !== 200)
        return { ...data, status: response.response.status, message: response.response.message };

      data.data.contenedor._id = data.data.contenedor2._id;
      data.data.contenedor.pallet = data.data.contenedor2.pallet;
      data.data.contenedor.item = response.response.data;
      data.data.contenedor.item.cajas = data.data.cajas;
      data.action = "addPallet";
      response = await addContenedorLote({
        data: { lote: response.response.data.lote, _id: data.data.contenedor2._id },
      });
      if (response.status !== 200)
        return { ...data, status: response.response.status, message: response.response.message };

      response = await sendData({ ...data, fn: "PUT" });
      if (response.response.status !== 200)
        return { ...data, status: response.response.status, message: response.response.message };

      return response;
    } catch (e) {
      return { status: 401, message: `Error en moverItemEntreContenedores ${e}` };
    }
  },
  moverItemsEntreContenedores: async data => {
    try {
      data.action = "eliminarItem";
      data.data.contenedor = {
        _id: data.data.contenedor1._id,
        item: data.data.contenedor1.index,
        pallet: data.data.contenedor1.pallet,
      };
      let response = await sendData({ ...data, fn: "PUT" });
      if (response.response.status !== 200)
        return { ...data, status: response.response.status, message: response.response.message };
      const addItems = response.response.data;

      data.action = "addPallet";

      for (let i = 0; i < addItems.length; i++) {
        data.data.contenedor._id = data.data.contenedor2._id;
        data.data.contenedor.pallet = data.data.contenedor2.pallet;
        data.data.contenedor.item = addItems[i];
        let response = await addContenedorLote({ data: { lote: addItems[i].lote, _id: data.data.contenedor2._id } });
        if (response.status !== 200)
          return { ...data, status: response.response.status, message: response.response.message };
        response = await sendData({ ...data, fn: "PUT" });
        if (response.response.status !== 200)
          return { ...data, status: response.response.status, message: response.response.message };
      }
      return response;
    } catch (e) {
      return { status: 401, message: `Error en moverItemsEntreContenedores ${e}` };
    }
  },
  moverItemSinPalletaContenedor: async data => {
    try{
      const index = data.data.contenedor1.index;
      const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();
      cajasSinPallet.response.data[index].cajas -= data.data.cajas;
      const itemPush = cajasSinPallet.response.data[index];
      if (cajasSinPallet.response.data[index].cajas === 0) {
        cajasSinPallet.response.data.splice(index, 1)[0];
      }
      await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);
      data.data.contenedor = {};
      data.data.contenedor._id = data.data.contenedor2._id;
      data.data.contenedor.pallet = data.data.contenedor2.pallet;
      data.data.contenedor.item = itemPush;
      data.data.contenedor.item.cajas = data.data.cajas;
      data.action = "addPallet";

      let response = await addContenedorLote({ data: { lote: itemPush.lote, _id: data.data.contenedor2._id } });
      if (response.status !== 200)
        return { ...data, status: response.response.status, message: response.response.message };
      response = await sendData({ ...data, fn: "PUT" });
      return response;
    } catch (e) {
      return {...data, response:{status: 401, message: `Error en moverItemSinPalletaContenedor ${e}`} };
    }
  },
  moverItemsSinPalletaContenedor: async data => {
    try{
      const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();

      const index = data.data.contenedor1.index.sort((a, b) => b - a);
      const len = index.length;
      //arreglo que contendra los items que se van a mover
      const itemPush = [];

      for (let i = 0; i<len; i++){
        itemPush.push( cajasSinPallet.response.data.splice(index[i], 1)[0]);
      }
      await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);

      data.data.contenedor = {};
      data.action = "addPallet";

      for (let i = 0; i < itemPush.length; i++) {
        data.data.contenedor._id = data.data.contenedor2._id;
        data.data.contenedor.pallet = data.data.contenedor2.pallet;
        data.data.contenedor.item = itemPush[i];
        let response = await addContenedorLote({ data: { lote: itemPush[i].lote, _id: data.data.contenedor2._id } });
        if (response.status !== 200)
          return { ...data, status: response.response.status, message: response.response.message };
        response = await sendData({ ...data, fn: "PUT" });

        if (response.response.status !== 200)
          return { ...data, status: response.response.status, message: response.response.message };
      }
      
      return {...data, response:{status:200, message:"Ok"}};
    
    } catch (e) {
      return {...data, response:{status: 401, message: `Error en moverItemSinPalletaContenedor ${e}`} };
    }
  },
  moverItemContenedorSinPalleta: async data => {
    try{
      data.action = "restarItem";
      data.data.contenedor = {};
      data.data.contenedor._id = data.data.contenedor1._id;
      data.data.contenedor.pallet = data.data.contenedor1.pallet;
      data.data.contenedor.item = data.data.contenedor1.index;
      data.data.contenedor.cajas = data.data.cajas;
      let response = await sendData({ ...data, fn: "PUT" });
      if (response.response.status !== 200)
        return { ...data, status: response.response.status, message: response.response.message };
      
      const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();
      cajasSinPallet.response.data.push(response.response.data);
      cajasSinPallet.response.data[cajasSinPallet.response.data.length -1].cajas = data.data.cajas;
      await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);

      return {...data, response:{status:200, message:"Ok"}};
    
    } catch (e) {
      return {...data, response:{status: 401, message: `Error en moverItemContenedorSinPalleta ${e}`} };
    }
  },
  moverItemsContenedorSinPalleta: async data => {
    try{
      data.action = "eliminarItem";
      data.data.contenedor = {
        _id: data.data.contenedor1._id,
        item: data.data.contenedor1.index,
        pallet: data.data.contenedor1.pallet,
      };
      let response = await sendData({ ...data, fn: "PUT" });
      if (response.response.status !== 200)
        return { ...data, status: response.response.status, message: response.response.message };

      const addItems = response.response.data;

      const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();

      for (let i = 0; i<addItems.length; i++){
        cajasSinPallet.response.data.push(addItems[i]);
      }
      await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);


      return {...data, response:{status:200, message:"Ok"}};
    
    } catch (e) {
      return {...data, response:{status: 401, message: `Error en moverItemContenedorSinPalleta ${e}`} };
    }
  },
  liberarPallet: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
};

module.exports.apiContenedores = apiContenedores;
