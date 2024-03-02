const { sendData } = require("../sendData");

const apiLotes = {
  putLotes: async (data) => {
    const response = await sendData({...data, fn:"PUT"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  obtenerHistorialLotes: async data => {
    const response = await sendData({ ...data, fn: "GET" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
};

module.exports.apiLotes = apiLotes;