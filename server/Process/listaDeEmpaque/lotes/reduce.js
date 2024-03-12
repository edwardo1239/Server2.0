const { sendData } = require("../sendData");

const apiLotes = {
  putLotes: async (data) => {
    const response = await sendData({...data, fn:"PUT"});
    if(response.response.status !== 200)
      throw new Error(`${response.response.message}`);

    return {...data, response:{status:200, message:"Ok"}};
  },
  obtenerHistorialLotes: async data => {
    const response = await sendData({ ...data, fn: "GET" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
};

module.exports.apiLotes = apiLotes;