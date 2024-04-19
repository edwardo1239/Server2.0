const { sendData } = require("../../utils/sendData");

const apiClientes = {
  getClientes: async (data) => {
    const response = await sendData({...data, fn:"GET", DB:"mongoDB"});
    return response;
  },
  addCliente: async (data) => {
    const response = await sendData({...data, fn:"POST", DB:"mongoDB"});
    process.send({fn:"cambio-cliente", DB: "mongoDB", status:200});
    return response;
  },
  putCliente: async (data) => {
    const response = await sendData({...data, fn:"PUT", DB:"mongoDB"});
    process.send({fn:"cambio-cliente", DB: "mongoDB", status:200});
    return response;
  },
  deleteCliente: async (data) => {
    const response = await sendData({...data, fn:"DELETE", DB:"mongoDB"});
    process.send({fn:"cambio-cliente", DB: "mongoDB", status:200});
    return response;
  },
};

module.exports.apiClientes = apiClientes;