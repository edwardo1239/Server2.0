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
    const response = await sendData({...data, fn:"POST"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  putProveedor: async (data) => {
    const response = await sendData({...data, fn:"PUT"});
    return {...response, satatus:response.response.status, message:response.response.message};
  }
};

module.exports.apiProveedores = apiProveedores;