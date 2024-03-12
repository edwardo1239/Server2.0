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
  putContenedor: async (data) => {
    const response = await sendData({...data, fn:"PUT"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
};

module.exports.apiContenedores = apiContenedores;