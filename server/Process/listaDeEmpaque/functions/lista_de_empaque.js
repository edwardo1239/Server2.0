const pesoCaja = require("../../../constant/pesoCajas.json");
const calidad = require("../../../constant/calidad.json");
const { sendData } = require("../sendData");
const { Lotes } = require("../../../DB/mongoDB/schemas/lotes/schemaLotes");

const addExportacionLote = async (data) => {
  const item = data.data.contenedor.item;
  const kilos = Number(item.cajas) * Number(pesoCaja[item.tipoCaja]);
  const requestLotes = {
    query: "proceso",
    collection: "lotes",
    action: "putLotes",
    data: {
      lote: {
        _id: item.lote,
        $addToSet: {contenedores: data.data.contenedor._id},
        $inc: {},
      },
    },
  };
  requestLotes.data.lote.$inc[calidad[String(item.calidad)]] = kilos;
  const response = await sendData({...requestLotes, fn:"PUT", client: "listaDeEmpaque"});
  return response.response;
};
const subExportacionLote = async (data) => {
  try{
    const item = data;
    const kilos = Number(item.cajas) * Number(pesoCaja[item.tipoCaja]);
    const requestLotes = {
      query: "proceso",
      collection: "lotes",
      action: "putLotes",
      data: {
        lote: {
          _id: item.lote,
          $inc: {},
        },
      },
    };
    requestLotes.data.lote.$inc[calidad[String(item.calidad)]] = -kilos;
    const response = await sendData({...requestLotes, fn:"PUT", client: "listaDeEmpaque"});
    return response.response;
  } catch(e) {
    return {status:401, message:`Error subExportacionLote => ${e}`};
  }

};
const addContenedorLote = async (data) => {
  try{
    const requestLotes = {
      query: "proceso",
      collection: "lotes",
      action: "putLotes",
      data: {
        lote: {
          _id: data.data.lote,
          $addToSet: {contenedores: data.data._id},

        },
      },
    };

    const response = await sendData({...requestLotes, fn:"PUT", client: "listaDeEmpaque"});
    return {status: response.response.status, message: response.response.message};
  } catch(e) {
    return {status:401, message:`Error subExportacionLote => ${e}`};
  }

};
const obtener_datos_lotes_cajas_sin_pallet = async (cajas) => {
  try{
    const ids = cajas.map(caja => caja.lote);
    const lotes = await Lotes.find({ _id:ids }).select({enf:1}).populate("predio", "PREDIO");
    for(let i = 0; i<cajas.length; i++){
      const lote = lotes.find(item => item._id.toString() === cajas[i].lote);
      cajas[i].lote = {enf:lote.enf, predio:lote.predio.PREDIO};
    }
    return cajas;
  } catch (e){
    console.error(e);
    return cajas;
  }
};
module.exports = {
  addExportacionLote,
  subExportacionLote,
  addContenedorLote,
  obtener_datos_lotes_cajas_sin_pallet
};