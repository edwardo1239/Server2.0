const { getUsers, getPermisos } = require("./getPersonal");

const apiPersonal = {
  users: async(data) => {
    const response = await getUsers(data);
    return response;
  }, 
  permisos: async(data) => {
    const response = await getPermisos(data);
    return response;
  }, 
};

module.exports.apiPersonal = apiPersonal;