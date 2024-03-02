const { sendData } = require("../../utils/sendData");

const apiContenedores = {
  crearContenedor: async (data) => {
    const response = await sendData({...data, fn:"POST"});
    return {...response, satatus:response.response.status, message:response.response.message};
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