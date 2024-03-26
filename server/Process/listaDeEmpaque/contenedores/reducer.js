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
    if(response.response.status !== 200){
      throw new Error(`${response.message}`);
    }
    process.send({fn:"listaEmpaqueToDescktop", status:200});
    return { ...data, response:{status:200, message:"Ok"}};
  },
  addPallet: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status !== 200) {
      throw new Error(`${response.response.message}`);
    }
    await addExportacionLote(data);
    process.send({fn:"listaEmpaqueToDescktop", status:200});
    return {...data, response:{status:200, message:"Ok"}};
  },
  addSinPallet: async data => {
    //se obtienen las cajas sin pallet
    const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();
    cajasSinPallet.response.data.push(data.data.contenedor.item);

    //se guardan las cajas
    await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);
    //se mete la informacion en el lote
    await addExportacionLote(data);
    //se envia el evento del server a el cliente
    process.send({fn:"listaEmpaqueToDescktopSinPallet", status:200});
    return {...data, response:{status:200, message:"Ok"}};
  },
  eliminarItem: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    if(response.response.status !== 200){
      throw new Error(`${response.response.message}`);
    }
    const items = response.response.data;
    const len = items.length;
    for (let i = 0; i < len; i++) {
      await subExportacionLote(items[i]);
    }
    process.send({fn:"listaEmpaqueToDescktop", status:200});
    return { ...data, response:{status:200, message:"Ok"}};
  },
  eliminatItemSinPallet: async data => {
    const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();
    const selecciones = data.data.contenedor.item.sort((a, b) => b - a);
    const len = selecciones.length;
    for (let i = 0; i < len; i++) {
      data.response = {};
      data.response.data = cajasSinPallet.response.data.splice(selecciones[i], 1)[0];

      await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);
      await subExportacionLote(data.response.data);
    }
    process.send({fn:"listaEmpaqueToDescktopSinPallet", status:200});
    return { ...data, response:{status: 200, message: "Ok"}};
  },
  restarItem: async data => {
    let response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status !== 200) {
      throw new Error(`${response.response.message}`);
    }
    const item = {
      lote: response.response.data.lote,
      cajas: data.data.contenedor.cajas,
      tipoCaja: response.response.data.tipoCaja,
      calidad: response.response.data.calidad,
    };
    await subExportacionLote(item);
    process.send({fn:"listaEmpaqueToDescktop", status:200});
    return { ...data, response:{status: 200, message: "Ok"} };
  },
  moverItemEntreContenedores: async data => {

    data.action = "restarItem";
    data.data.contenedor = {};
    data.data.contenedor._id = data.data.contenedor1._id;
    data.data.contenedor.pallet = data.data.contenedor1.pallet;
    data.data.contenedor.item = data.data.contenedor1.index;
    data.data.contenedor.cajas = data.data.cajas;
    let response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status !== 200)
      throw new Error(`${response.response.message}`);

    data.data.contenedor._id = data.data.contenedor2._id;
    data.data.contenedor.pallet = data.data.contenedor2.pallet;
    data.data.contenedor.item = response.response.data;
    data.data.contenedor.item.cajas = data.data.cajas;
    data.action = "addPallet";
    response = await addContenedorLote({
      data: { lote: response.response.data.lote, _id: data.data.contenedor2._id },
    });
    if (response.status !== 200)
      throw new Error(`${response.response.message}`);


    response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status !== 200)
      throw new Error(`${response.response.message}`);


    return {...data, response:{status:200, message:"Ok"}};

  },
  moverItemsEntreContenedores: async data => {
    data.action = "eliminarItem";
    data.data.contenedor = {
      _id: data.data.contenedor1._id,
      item: data.data.contenedor1.index,
      pallet: data.data.contenedor1.pallet,
    };
    let response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status !== 200)
      throw new Error(`${response.response.message}`);

    const addItems = response.response.data;

    data.action = "addPallet";
    for (let i = 0; i < addItems.length; i++) {
      data.data.contenedor._id = data.data.contenedor2._id;
      data.data.contenedor.pallet = data.data.contenedor2.pallet;
      data.data.contenedor.item = addItems[i];
      let response = await addContenedorLote({ data: { lote: addItems[i].lote, _id: data.data.contenedor2._id } });
      if (response.status !== 200)
        throw new Error(`${response.response.message}`);
      response = await sendData({ ...data, fn: "PUT" });
      if (response.response.status !== 200)
        throw new Error(`${response.response.message}`);
    }
    return {...data, response:{status:200, message:"Ok"}};
    
  },
  moverItemSinPalletaContenedor: async data => {
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
      throw new Error(`${response.response.message}`);
    response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status !== 200)
      throw new Error(`${response.response.message}`);
    return {...data, response:{status:200, message:"Ok"}};

  },
  moverItemsSinPalletaContenedor: async data => {
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
        throw new Error(`${response.response.message}`);
      response = await sendData({ ...data, fn: "PUT" });
      if (response.response.status !== 200)
        throw new Error(`${response.response.message}`);
    }
    return {...data, response:{status:200, message:"Ok"}};
    
  },
  moverItemContenedorSinPalleta: async data => {
    data.action = "restarItem";
    data.data.contenedor = {};
    data.data.contenedor._id = data.data.contenedor1._id;
    data.data.contenedor.pallet = data.data.contenedor1.pallet;
    data.data.contenedor.item = data.data.contenedor1.index;
    data.data.contenedor.cajas = data.data.cajas;
    let response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status !== 200)
      throw new Error(`${response.response.message}`);

      
    const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();
    cajasSinPallet.response.data.push(response.response.data);
    cajasSinPallet.response.data[cajasSinPallet.response.data.length -1].cajas = data.data.cajas;
    await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);

    return {...data, response:{status:200, message:"Ok"}};
  },
  moverItemsContenedorSinPalleta: async data => {
    data.action = "eliminarItem";
    data.data.contenedor = {
      _id: data.data.contenedor1._id,
      item: data.data.contenedor1.index,
      pallet: data.data.contenedor1.pallet,
    };
    let response = await sendData({ ...data, fn: "PUT" });
    if (response.response.status !== 200)
      throw new Error(`${response.response.message}`);
    const addItems = response.response.data;
    const cajasSinPallet = await apiVariablesProceso.obtenerCajasSinPallet();

    for (let i = 0; i<addItems.length; i++){
      cajasSinPallet.response.data.push(addItems[i]);
    }
    await apiVariablesProceso.guardarCajasSinPallet(cajasSinPallet.response.data);

    return {...data, response:{status:200, message:"Ok"}};
    
  },
  liberarPallet: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    if(response.response.status !== 200)
      throw new Error(`${response.response.message}`);
    
    process.send({fn:"listaEmpaqueToDescktop", status:200});
    return { ...data, response:{status:200, message:"Ok"} };
  },
  cerrarContenedor: async data => {
    const response = await sendData({ ...data, fn: "PUT" });
    if(response.response.status !== 200)
      throw new Error(`${response.response.message}`);
    
    
    process.send({fn:"listaEmpaqueToDescktop", status:200});
    return { ...data, response:{status:200, message:"Ok"} };
  },
};

module.exports.apiContenedores = apiContenedores;
