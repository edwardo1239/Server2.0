const { sendData } = require("../../utils/sendData");

const apiProveedores = {
  obtenerProveedores: async (data) => {
    const response = await sendData({...data, fn:"GET"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  deleteProveedores: async (data) => {
    const response = await sendData({...data, fn:"DELETE", DB:"mongoDB"});
    process.send({fn:"cambio-proveedor", status:200});
    return response;
  },
  addProveedor: async (data) => {
    const response = await sendData({...data, fn:"POST", DB:"mongoDB"});
    process.send({fn:"cambio-proveedor", status:200});
    return response;
  },
  putProveedor: async (data) => {
    const response = await sendData({...data, fn:"PUT", DB:"mongoDB"});
    process.send({fn:"cambio-proveedor", status:200});
    return response;
  }
};

module.exports.apiProveedores = apiProveedores;