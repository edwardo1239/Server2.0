const responseContenedores = {
  obtenerClientes: async data => {
    if(data.status === 200){
      return {status:data.status, data: data.data, message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
  },
  crearContenedor: async (data) => {
    if(data.status === 200){
      return {status:data.status, message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
  },
  obtenerDataContenedor: async data => {
    if(data.status === 200){
      return {status:data.status, data: data.data, message:data.message};
    } else {
      return {status:data.status, message:data.message};
    }
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
  enviarDatosFormularioProgramacionMulas: async (data) =>{
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
  obtenerFormularioProgramacionMula: async (data) => {
    return {status:200, data:data.data};
  },
  editarFormularioProgramacionMula: async (data) => {
    return {status:200, data:data.data};
  },
};

module.exports = {
  responseContenedores
};