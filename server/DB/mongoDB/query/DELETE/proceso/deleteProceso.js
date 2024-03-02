const { default: mongoose } = require("mongoose");
const { Proveedores } = require("../../../schemas/proveedores/schemaProveedores");
const { Clientes } = require("../../../schemas/clientes/schemaClientes");

const deleteProveedores = async data => {
  try {
    const id = new mongoose.Types.ObjectId(data.data.id);
    await Proveedores.findByIdAndDelete(id);
    return {...data, response:{status:200, message:"proveedor eliminado con exito"}};
  } catch(e) {
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion deleteProveedores"}};
  }
};
const deleteCliente = async data => {
  try {
    const id = new mongoose.Types.ObjectId(data.data._id);
    await Clientes.findByIdAndDelete(id);
    return {...data, response:{status:200, message:"Cliente eliminado con exito"}};
  } catch(e) {
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion deleteCliente"}};
  }
};

module.exports = {
  deleteProveedores,
  deleteCliente
};