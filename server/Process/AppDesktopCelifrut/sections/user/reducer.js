const { sendData } = require("../../utils/sendData");

const apiUser = {
  logIn: async (data) => {
    const response = await sendData({...data, fn:"GET"});
    if(response.response.data.length === 0){
      return {...response, status:404, message:"Usuario no encontrado"};
    }
    else if(response.response.data[0].password === response.data.password){
      return {...response, status:200, message:"Ok"};
    } else {
      return {...response, status:400, message:"Contraseña incorrecta"};
    }
  },
  obtenerCuentas: async (data) => {
    const response = await sendData({...data, fn:"GET"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  getPermisos: async (data) => {
    const response = await sendData({...data, fn:"GET"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  getUsers: async (data) => {
    const response = await sendData({...data, fn:"GET", DB:"postgresDB"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  addUser: async (data) => {
    const response = await sendData({...data, fn:"POST"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  deleteUser: async (data) => {
    const response = await sendData({...data, fn:"DELETE"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  putUser: async (data) => {
    const response = await sendData({...data, fn:"PUT"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },
  addOperario: async (data) => {
    const response = await sendData({...data, fn:"PUT", DB: "postgresDB"});
    return response;
  }
};

module.exports.apiUser = apiUser;