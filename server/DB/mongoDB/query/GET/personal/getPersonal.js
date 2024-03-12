const { permisosUsusarioDev } = require("../../../schemas/users/schemaPermisos");
const { UserDev } = require("../../../schemas/users/schemaUser");

const getUsers = async (data) => {
  const users = await UserDev.find(data.data.query);
  if(users === null){
    throw new Error("Error en la busqueda");
  } else {
    return {...data, response:{status:200, message:"OK", data:users}};
  }
};
const getPermisos = async (data) => {
  const permisos = await permisosUsusarioDev.find(data.data.query);
  if(permisos === null){
    throw new Error("Error en la busqueda");
  } else {
    return {...data, response:{status:200, message:"OK", data:permisos}};
  }
};

module.exports ={
  getUsers,
  getPermisos
};