
const { obtenerCajasSinPallet, obtenerLoteVaciando } = require("../../ListaDeEmpaque/public/functions/listaDeEmpaque");
const {
  obtenerProveedores,
  guardarLote,
  obtenerFrutaActual,
  vaciarLote,
  obtenerHistorialProceso,
  directoNacional,
  obtenerHistorialDirectoNacional,
  desverdizado,
  modificarHistorialVaciado,
  modificarHistorialDirectoNacional,
  obtenerFrutaDesverdizando,
  setParametrosDesverdizado,
  finalizarDesverdizado,
  procesarDesverdizado,
  ingresarDescarteLavado,
  ingresarDescarteEncerado,
  obtenerDescarte,
  reprocesarDescarteUnPredio,
  ReprocesarDescarteCelifrut,
  eliminarFrutaDescarte,
  obtenerHistorialDescarte,
  obtenerClientes,
  crearContenedor,
  obtenerDataContenedor,
  guardarSettingsPallet,
  guardarItem,
  eliminarItem,
  moverItem,
  restarItem,
  liberacionPallet,
  cerrarContenedor,
  obtenerLotesCalidadInterna,
  guardarCalidadInterna,
  obtenerLotesClasificacionCalidad,
  guardarClasificacionCalidad,
  obtenerLotesFotosCalidad,
  guardarFotosCalidad,
  obtenerRendimiento,
  obtenerInfoRotulosCajas,
  obtenerInformesCalidad,
  obtenerDatosLotes,
  agregarProveedor,
  modificarProveedor,
  eliminarProveedor,
  enviarDatosFormularioInspeccionMulas,
  obtenerDataContenedorFormularioInspeccionMulas,
  obtenerHistorialDataContenedorFormularioInspeccionMulas,
  ObtenerInfoContenedoresCelifrut,
  dataHistorialCalidadInterna,
  dataHistorialClasificacionCalidad,
  obtenerHistorialFormularioInspeccionVehiculos,
  ingresarCliente,
  eliminarCliente,
  modificarCliente,
  enviarDatosFormularioProgramacionMulas,
  obtenerDataContenedorFormularioProgramacionMulas,
} = require("../queries/queryProceso");
const { logIn, obtenerRegistroHigiene, obtenerRegistroControlPlagas, obtenerRegistroLimpiezaDesinfeccionPlanta, obtenerRegistroLimpiezaMensual, obtenerPermisosUsuario, crearUsuario, obtenerVolanteCalidad, obtenerCuentas, eliminarCuenta, editarCuenta } = require("../queries/querypersonal");

const apiPersonal = {
  logIn: async (data) => {
    const user = await logIn(data);
    return user;
  },
  obtenerPermisosUsuario: async (data) => {
    const user = await obtenerPermisosUsuario(data);
    return user;
  },
  crearUsuario: async (data) => {
    const response = await crearUsuario(data);
    return response;
  },
  obtenerRegistroHigiene:async (data) => {
    const response = await obtenerRegistroHigiene(data);
    return response;
  },
  obtenerRegistroControlPlagas:async (data) => {
    const response = await obtenerRegistroControlPlagas(data);
    return response;
  },
  obtenerRegistroLimpiezaDesinfeccionPlanta:async (data) => {
    const response = await obtenerRegistroLimpiezaDesinfeccionPlanta(data);
    return response;
  },
  obtenerRegistroLimpiezaMensual:async (data) => {
    const response = await obtenerRegistroLimpiezaMensual(data);
    return response;
  },
  obtenerVolanteCalidad:async (data) => {
    const response = await obtenerVolanteCalidad(data);
    return response;
  },
  obtenerCuentas: async (data) => {
    const response = await obtenerCuentas(data);
    return response;
  },
  eliminarCuenta: async (data) => {
    const response = await eliminarCuenta(data);
    return response;
  },
  editarCuenta: async (data) => {
    const response = await editarCuenta(data);
    return response;
  },
};
const apiProceso = {
  obtenerProveedores: async (data) => {
    const proveedores = await obtenerProveedores(data);
    return proveedores;
  },
  agregarProveedor: async (data) => {
    const response = await agregarProveedor(data);
    return response;
  },
  modificarProveedor: async (data) => {
    const response = await modificarProveedor(data);
    return response;
  },
  eliminarProveedor: async (data) => {
    const response = await eliminarProveedor(data);
    return response;
  },
  guardarLote: async (data) => {
    const status = await guardarLote(data);
    return status;
  },
  obtenerFrutaActual: async (data) => {
    const datos = await obtenerFrutaActual(data);
    return datos;
  },
  vaciarLote: async (data) => {
    const status = await vaciarLote(data);
    return status;
  },
  obtenerHistorialProceso: async (data) => {
    const datos = await obtenerHistorialProceso(data);
    return datos;
  },
  directoNacional: async (data) =>{
    const status = await directoNacional(data);
    return status;
  },
  obtenerHistorialDirectoNacional: async (data) =>{
    const status = await obtenerHistorialDirectoNacional(data);
    return status;
  },
  desverdizado: async (data) => {
    const status = await desverdizado(data);
    return status;
  },
  modificarHistorialVaciado: async (data) => {
    const status = await modificarHistorialVaciado(data);
    return status;
  },
  modificarHistorialDirectoNacional: async (data) => {
    const status = await modificarHistorialDirectoNacional(data);
    return status;
  },
  obtenerFrutaDesverdizando: async(data) =>{
    const datos = await obtenerFrutaDesverdizando(data);
    return datos;
  },
  setParametrosDesverdizado: async (data) => {
    const status = await setParametrosDesverdizado(data);
    return status;
  },
  finalizarDesverdizado: async (data) => {
    const status = await finalizarDesverdizado(data);
    return status;
  },
  procesarDesverdizado: async (data) => {
    const status = await procesarDesverdizado(data);
    return status;
  },
  ingresarDescarteLavado: async (data) => {
    const res = await ingresarDescarteLavado(data.data);
    const response = {...data, event: "queryResponse", data: res.data, server:["Descartes", "Celifrut"] };
    return response;
  },
  ingresarDescarteEncerado: async (data) => {
    const res = await ingresarDescarteEncerado(data.data);
    const response = {...data, event: "queryResponse", data: res.data, server:["Descartes", "Celifrut"] };
    return response;
  },
  obtenerDescarte: async (data) => {
    const res = await obtenerDescarte(data);
    return res;
  },
  reprocesarDescarteUnPredio: async (data) =>{
    const response = await reprocesarDescarteUnPredio(data);
    return response;
  },
  ReprocesarDescarteCelifrut: async (data) =>{
    const response = await ReprocesarDescarteCelifrut(data);
    return response;
  },
  eliminarFrutaDescarte: async (data) => {
    const response = await eliminarFrutaDescarte(data);
    return response;
  },
  obtenerHistorialDescarte: async (data) => {
    const response = await obtenerHistorialDescarte(data);
    return response;
  },
  obtenerClientes: async (data) => {
    const response = await obtenerClientes(data);
    return response;
  },
  obtenerDatosLotes: async (data) => {
    const response = await obtenerDatosLotes(data);
    return response;
  },
  //contenedores
  crearContenedor: async (data) => {
    const response = await crearContenedor(data);
    return response;
  },
  obtenerDataContenedor: async (data = {}) => {
    const dataContenedor = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet(data);
    return {...data, data:dataContenedor.data, sinPallet:sinPallet.data};
  },
  obtenerDataContenedorFormularioInspeccionMulas: async (data = {}) => {
    const dataContenedor = await obtenerDataContenedorFormularioInspeccionMulas(data);
    return dataContenedor;
  }, 
  obtenerDataContenedorFormularioProgramacionMulas: async (data) => {
    const response = await obtenerDataContenedorFormularioProgramacionMulas(data);
    return response;
  },
  obtenerHistorialDataContenedorFormularioInspeccionMulas: async (data = {}) => {
    const dataContenedor = await obtenerHistorialDataContenedorFormularioInspeccionMulas(data);
    return dataContenedor;
  },
  obtenerCajasSinPallet: async (data = {}) => {
    const response = await obtenerCajasSinPallet();
    data.data = response;
    return data;
  },
  obtenerLoteVaciando: async (data) => {
    const response = await obtenerLoteVaciando();
    data.data = response;
    return data;
  },
  guardarSettingsPallet: async (data) => {
    await guardarSettingsPallet(data);
    const dataContenedor = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet(data);
    return {...data, data:dataContenedor.data, sinPallet:sinPallet.data};
  },
  guardarItem: async (data) => {
    const datosImprimir = await guardarItem(data.data);
    const dataContenedor = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet(data);
    return {...data, data:dataContenedor.data, sinPallet:sinPallet.data, datosImprimir:datosImprimir};
  },
  eliminarItem: async (data) => {
    await eliminarItem(data.data);
    const dataContenedor = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet(data);
    return {...data, data:dataContenedor.data, sinPallet:sinPallet.data};
  },
  moverItem: async (data) => {
    await moverItem(data.data);
    const dataContenedor = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet(data);
    return {...data, data:dataContenedor.data, sinPallet:sinPallet.data};
  },
  restarItem: async (data) => {
    await restarItem(data.data);
    const dataContenedor = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet(data);
    return {...data, data:dataContenedor.data, sinPallet:sinPallet.data};
  },
  liberacionPallet: async (data) => {
    await liberacionPallet(data.data);
    const dataContenedor = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet(data);
    return {...data, data:dataContenedor.data, sinPallet:sinPallet.data};
  },
  cerrarContenedor: async (data) => {
    await cerrarContenedor(data.data);
    const dataContenedor = await obtenerDataContenedor(data);
    const sinPallet = await obtenerCajasSinPallet(data);
    return {...data, data:dataContenedor.data, sinPallet:sinPallet.data};
  },
  obtenerRendimiento: async (data) => {
    const response = await obtenerRendimiento(data);
    return response;
  },
  obtenerInfoRotulosCajas: async (data) => {
    const response = await obtenerInfoRotulosCajas(data);
    data.data = response;
    return data;
  },
  enviarDatosFormularioProgramacionMulas: async (data) => {
    const response = await enviarDatosFormularioProgramacionMulas(data);
    return response;
  },
  enviarDatosFormularioInspeccionMulas: async (data) => {
    const response = await enviarDatosFormularioInspeccionMulas(data);
    data.data = response;
    return data;
  },
  ObtenerInfoContenedoresCelifrut: async (data) => {
    const response = await ObtenerInfoContenedoresCelifrut(data);
    return response;
  },

  //calidad
  obtenerLotesCalidadInterna: async (data) => {
    const response = await obtenerLotesCalidadInterna(data);
    return response;
  },
  guardarCalidadInterna: async (data) => {
    const response = await guardarCalidadInterna(data);
    return response;
  },
  obtenerLotesClasificacionCalidad: async (data) => {
    const response = await obtenerLotesClasificacionCalidad(data);
    return response;
  },
  guardarClasificacionCalidad: async (data) => {
    const response = await guardarClasificacionCalidad(data);
    return response;
  },
  obtenerLotesFotosCalidad: async (data) => {
    const response = await obtenerLotesFotosCalidad(data);
    return response;
  },
  guardarFotosCalidad: async (data) => {
    const response = await guardarFotosCalidad(data);
    return response;
  },
  obtenerInformesCalidad: async (data) => {
    const response = await obtenerInformesCalidad(data);
    return response;
  },
  dataHistorialCalidadInterna: async (data) => {
    const response = await dataHistorialCalidadInterna(data);
    return response;
  },
  dataHistorialClasificacionCalidad: async (data) => {
    const response = await dataHistorialClasificacionCalidad(data);
    return response;
  },
  obtenerHistorialFormularioInspeccionVehiculos: async (data) => {
    const response = await obtenerHistorialFormularioInspeccionVehiculos(data);
    return response;
  },
  ingresarCliente: async (data) => {
    const response = await ingresarCliente(data);
    return response;
  },
  eliminarCliente: async (data) => {
    const response = await eliminarCliente(data);
    return response;
  },
  modificarCliente: async (data) => {
    const response = await modificarCliente(data);
    return response;
  }
};

module.exports = {
  apiPersonal,
  apiProceso,
};
