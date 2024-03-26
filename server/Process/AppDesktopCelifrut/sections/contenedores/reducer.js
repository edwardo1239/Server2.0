const { crear_informe_lista_de_empaque } = require("../../../../functions/crearInformes/crear_informes");
const { sendData } = require("../../utils/sendData");

const apiContenedores = {
  crearContenedor: async (data) => {
    const response = await sendData({...data, fn:"POST"});
    if(response.response.status !== 200)
      throw new Error(`${response.response.message}`);
    process.send({fn:"listaEmpaqueToDescktop", status:200});
    return {...data, response:{status:200, messasge:"Ok"}};
  },
  getContenedores: async (data) => {
    const response = await sendData({...data, fn:"GET"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  getContenedoresInforme: async (data) => {
    const response = await sendData({...data, fn:"GET"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  putContenedor: async (data) => {
    const response = await sendData({...data, fn:"PUT"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  cerrar_contenedor: async (data) =>{
    const response = await sendData({...data, fn:"PUT", action:"actualizar_contenedor"});
    if(response.response.status !== 200)
      throw new Error(`${response.response.message}`);
    await crear_informe_lista_de_empaque(response.response.data[0]);
    return {...data, response:{status:200, messasge:"Ok"}};

  }
};

module.exports.apiContenedores = apiContenedores;