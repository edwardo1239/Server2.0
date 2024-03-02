const { sendData } = require("../../utils/sendData");

const apiClientes = {
  getClientes: async (data) => {
    const response = await sendData({...data, fn:"GET"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  addCliente: async (data) => {
    const response = await sendData({...data, fn:"POST"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  putCliente: async (data) => {
    const response = await sendData({...data, fn:"PUT"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  deleteCliente: async (data) => {
    const response = await sendData({...data, fn:"DELETE"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
};

module.exports.apiClientes = apiClientes;