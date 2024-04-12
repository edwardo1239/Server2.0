const { sendData } = require("../../utils/sendData");

const apiProveedores = {
  obtenerProveedores: async (data) => {
    const response = await sendData({...data, fn:"GET"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  deleteProveedores: async (data) => {
    const response = await sendData({...data, fn:"DELETE"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  addProveedor: async (data) => {
    const response = await sendData({...data, fn:"POST", DB:"mongoDB"});
    return response;
  },
  putProveedor: async (data) => {
    const response = await sendData({...data, fn:"PUT", DB:"mongoDB"});
    return response;
  }
};

module.exports.apiProveedores = apiProveedores;