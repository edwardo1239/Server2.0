const { vaciarLote, modificarHistorialVaciado, reprocesarDescarteUnPredio, ReprocesarDescarteCelifrut } = require("./functions/inventarioFruta");
const { procesarDesverdizado } = require("./functions/frutaDesverdizada");
const { obtenerIDs } = require("./functions/savegetDataJSON");

const responseProceso = {
  obtenerProveedores: async data => {
    const enf = await obtenerIDs();
    return {status:200, data: data.data, enf:enf.enf};
  },
  agregarProveedor: async ()=> {
    return {status:200};
  },
  modificarProveedor: async ()=> {
    return {status:200};
  },
  eliminarProveedor: async ()=> {
    return {status:200};
  },
  guardarLote: async () => {
    return {status:200};
  },
  obtenerFrutaActual: async data =>{
    return {status:200, data:data.data};
  },
  vaciarLote: async data => {
    await vaciarLote(data);
    return {status:200};
  },
  obtenerHistorialProceso: async data =>{
    return {status:200, data:data.data};
  },
  directoNacional: async () => {
    return {status:200};
  },
  obtenerHistorialDirectoNacional: async data => {
    return {status:200, data:data.data};
  },
  desverdizado: async () =>{
    return {status:200};
  },
  modificarHistorialVaciado: async data =>{
    await modificarHistorialVaciado(data);
    return {status:200};
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