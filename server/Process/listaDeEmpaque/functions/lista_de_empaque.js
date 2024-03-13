const pesoCaja = require("../../../constant/pesoCajas.json");
const calidad = require("../../../constant/calidad.json");
const { sendData } = require("../sendData");
const { apiVariablesProceso } = require("../../../variablesDeProceso/reduce");

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
  await apiVariablesProceso.ingresarExportacion(kilos);
  process.send({...data, fn:"procesoLote", response:response, status:200});
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
    await apiVariablesProceso.ingresarExportacion(-kilos);
    process.send({...data, fn:"procesoLote", response:response, status:200});

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
    const request = {
      data: {
        query: {
          _id: { $in: ids }
        },
        select: {enf:1},
        populate: {
          path: "predio",
          select: "PREDIO ICA"
        },
        sort: {  }
      },
      collection: "lotes",
      action: "getLotes",
      query: "proceso",
    };
    const lotes = await sendData({...request, fn:"GET", client: "listaDeEmpaque"});
    for(let i = 0; i<cajas.length; i++){
      const lote = lotes.response.data.find(item => item._id.toString() === cajas[i].lote);
      cajas[i].lote = {enf:lote.enf, predio:lote.predio.PREDIO, _id:lote._id};
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