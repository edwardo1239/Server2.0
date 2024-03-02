const { default: mongoose } = require("mongoose");
const { UserDev } = require("../../../schemas/users/schemaUser");

const deleteUser = async data => {
  try {
    const id = new mongoose.Types.ObjectId(data.data.id);
    await UserDev.findByIdAndDelete(id);
    return {...data, response:{status:200, message:"User eliminado con exito"}};
  } catch(e) {
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion deleteUser"}};
  }
};

module.exports = {
  deleteUser
};