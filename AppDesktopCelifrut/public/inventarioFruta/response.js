const { vaciarLote, modificarHistorialVaciado, reprocesarDescarteUnPredio, ReprocesarDescarteCelifrut } = require("./functions/inventarioFruta");
const { procesarDesverdizado } = require("./functions/frutaDesverdizada");
const { obtenerIDs } = require("./functions/savegetDataJSON");

const responseProceso = {
  obtenerProveedores: async data => {
    if(data.status === 200){
      const enf = await obtenerIDs();
      return {status:data.status, data: data.data, enf:enf.enf, message:data.message};
    } else {
      return {status:data.status, message:data.message, enf:"???"};
    }
 
  },
  agregarProveedor: async (data)=> {
    if(data.status === 200){
      return {status:data.status, message:data.message};
    } 
    else{
      return {status:data.status, message:data.message};
    }
  },
  modificarProveedor: async (data)=> {
    if(data.status === 200){
      return {status:data.status, message:data.message};
    } 
    else{
      return {status:data.status, message:data.message};
    }
  },
  eliminarProveedor: async (data)=> {
    if(data.status === 200){
      return {status:data.status, message:data.message};
    } 
    else{
      return {status:data.status, message:data.message};
    }
  },
  guardarLote: async (data) => {
    if(data.status === 200){
      return {status:data.status, message:data.message};
    } 
    else{
      return {status:data.status, message:data.message};
    }
  },
  obtenerFrutaActual: async data =>{
    if(data.status === 200){
      return {status:data.status, data: data.data,  message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
  },
  vaciarLote: async data => {
    if(data.status === 200){
      await vaciarLote(data);
      return {status:data.status, message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
  },
  obtenerHistorialProceso: async data =>{
    if(data.status === 200){
      return {status:data.status, data: data.data, message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
  },
  directoNacional: async (data) => {
    if(data.status === 200){
      return {status:data.status, message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
  },
  obtenerHistorialDirectoNacional: async data => {
    return {status:200, data:data.data};
  },
  desverdizado: async (data) =>{
    if(data.status === 200){
      return {status:data.status, message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
  },
  modificarHistorialVaciado: async data =>{
    if(data.status === 200){
      await modificarHistorialVaciado(data);
      return {status:data.status, message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
   
  },
  modificarHistorialDirectoNacional: async () => {
    return {status:200};
  },
  obtenerFrutaDesverdizando: async data =>{
    return {status:200, data:data.data};
  },
  setParametrosDesverdizado: async () => {
    return {status:200};
  },
  finalizarDesverdizado: async () => {
    return {status:200};
  },
  procesarDesverdizado: async data => {
    await procesarDesverdizado(data);
    return {status:200};
  },
  obtenerDescarte: async data => {
    return {status:200, data:data.data};
  },
  reprocesarDescarteUnPredio: async data => {
    await reprocesarDescarteUnPredio(data);
    return {status:200};
  },
  ReprocesarDescarteCelifrut: async data =>{
    await ReprocesarDescarteCelifrut(data);
    return {status:200};
  },
  eliminarFrutaDescarte: async () => {
    return {status:200};
  },
  obtenerHistorialDescarte: async data => {
    return {status:200, data:data.data};
  },
  obtenerDatosLotes: async data => {
    return {status:200, data:data.data};
  },
  obtenerHistorialFormularioInspeccionVehiculos: async data => {
    return {status:200, data:data.data};
  },
};

module.exports = {
  responseProceso
};