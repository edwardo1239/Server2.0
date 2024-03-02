const { permisosUsusarioDev } = require("../../../schemas/users/schemaPermisos");
const { UserDev } = require("../../../schemas/users/schemaUser");

const getUsers = async (data) => {
  try{
    const users = await UserDev.find(data.data.query);
    if(users === null){
      return {...data, response:{status:404, message:"Error en la busqueda"}};
    } else {
      return {...data, response:{status:200, message:"OK", data:users}};
    }
  } catch (e){
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion getUsers"}};
  }
};
const getPermisos = async (data) => {
  try{
    const permisos = await permisosUsusarioDev.find(data.data.query);
    if(permisos === null){
      return {...data, response:{status:404, message:"Error en la busqueda"}};
    } else {
      return {...data, response:{status:200, message:"OK", data:permisos}};
    }
  } catch (e){
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion getUsers"}};
  }
};

module.exports ={
  getUsers,
  getPermisos
};