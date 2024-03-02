const { default: mongoose } = require("mongoose");
const { UserDev } = require("../../../schemas/users/schemaUser");

const putUser = async data => {
  try {
    const id = new mongoose.Types.ObjectId(data.data._id);
    await UserDev.updateOne({_id:id},data.data);
  
    return {...data, response: {status:200, message:"Ok"}};
  } catch (e) {
    console.error(e);
    return { ...data, response: { status: 400, message: "Error en la funcion putUser" } };
  }
};

module.exports = {
  putUser
};