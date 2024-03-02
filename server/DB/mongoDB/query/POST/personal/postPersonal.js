const { UserDev } = require("../../../schemas/users/schemaUser");

const addUser = async data => {
  try {
    const cliente = new UserDev(data.data);
    await cliente.save();
  
    return {...data, response: {status:200, message:"Ok"}};
  } catch (e) {
    console.error(e);
    return { ...data, response: { status: 400, message: `Error en la funcion addUser: ${e}` } };
  }
};

module.exports = {
  addUser
};