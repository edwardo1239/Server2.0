const responseCalidad = {
  obtenerLotesCalidadInterna: async data => {
    return {status:200, data: data.data};
  },
  guardarCalidadInterna: async () => {
    return {status:200};
  },
  obtenerLotesClasificacionCalidad: async data => {
    return {status:200, data: data.data};
  },
  guardarClasificacionCalidad: async () => {
    return {status:200};
  },
  obtenerLotesFotosCalidad: async (data) =>{
    return {status:200, data: data.data};
  },
  guardarFotosCalidad: async () => {
    return {status:200};
  },
  obtenerRegistroHigiene: async data => {
    return {status:200, data: data.data};
  },
  obtenerRegistroControlPlagas: async data => {
    return {status:200, data: data.data};
  },
  obtenerRegistroLimpiezaDesinfeccionPlanta: async data => {
    return {status:200, data: data.data};
  },
  obtenerRegistroLimpiezaMensual: async data => {
    return {status:200, data: data.data};
  },
  obtenerInformesCalidad: async data => {
    return {status:200, data: data.data};
  },
  obtenerVolanteCalidad: async data => {
    return {status:200, data: data.data};
  },
};

module.exports = {
  responseCalidad
};