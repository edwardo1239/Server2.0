const responseContenedores = {
  obtenerClientes: async data => {
    return {status:200, data: data.data};
  },
  crearContenedor: async () => {
    return {status:200};
  },
  obtenerDataContenedor: async data => {
    return {status:200, data: data.data};
  },
  obtenerRendimiento: async data => {
    return {status:200, data: data.data};
  },
  obtenerInfoRotulosCajas: async data => {
    return {status:200, data: data.data};
  },
  obtenerDataContenedorFormularioInspeccionMulas: async data => {
    return {status:200, data: data.data};
  },
  obtenerDataContenedorFormularioProgramacionMulas: async data => {
    return {status:200, data: data.data};
  },
  enviarDatosFormularioInspeccionMulas: async (data) =>{
    return {status:200, data:data.data, response:"success"};
  },
  obtenerHistorialDataContenedorFormularioInspeccionMulas: async data => {
    return {status:200, data: data.data};
  },
  ObtenerInfoContenedoresCelifrut: async data => {
    return {status:200, data: data.data};
  },
  ingresarCliente: async () => {
    return {status:200};
  },
  eliminarCliente: async () => {
    return {status:200};
  },
  modificarCliente: async () => {
    return {status:200};
  },
};

module.exports = {
  responseContenedores
};