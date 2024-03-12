const { default: mongoose } = require("mongoose");
const { Clientes } = require("../../../schemas/clientes/schemaClientes");
const { Contenedores } = require("../../../schemas/contenedores/schemaContenedores");
const { historialDescarte } = require("../../../schemas/lotes/schemaHistorialDescarte");
const { Lotes } = require("../../../schemas/lotes/schemaLotes");
const { recordLotes } = require("../../../schemas/lotes/schemaRecordLotes");
const { Proveedores } = require("../../../schemas/proveedores/schemaProveedores");
const { oobtener_datos_lotes_to_listaEmpaque } = require("../../../functions/proceso");

const getProveedores = async data => {
  const proveedores = await Proveedores.find(data.data.query);
  if(proveedores === null){
    throw new Error("Error en la busqueda");
  } else {
    return {...data, response:{status:200, message:"OK", data:proveedores}};
  }
};
const getClientes = async data => {
  const clientes = await  Clientes.find(data.data.query);
  if(clientes === null){
    throw new Error("Error en la busqueda");
  } else {
    return {...data, response:{status:200, message:"OK", data:clientes}};
  }
};
const getlotes = async data => {
  if(Object.prototype.hasOwnProperty.call(data.data, "query") && Object.prototype.hasOwnProperty.call(data.data.query, "_id")){
    if(Object.prototype.hasOwnProperty.call(data.data.query._id,"$in")){
      const _id = data.data.query._id.$in.map(id => new mongoose.Types.ObjectId(id));
      data.data.query._id.$in = _id;
    } else {
      const _id = new mongoose.Types.ObjectId(data.data.query._id);
      data.data.query._id = _id;
    }
  }

  const lotes = await Lotes.find(data.data.query, data.data.select)
    .populate(data.data.populate)
    .sort(data.data.sort)
    .limit(data.data.limit);

  if(lotes === null){
    throw new Error("Error en la busqueda");
  } else {
    return {...data, response:{status:200, message:"OK", data:lotes}};
  }
};
const getHistorialLotes = async data => {
  const lotes = await recordLotes.find(data.data.query, data.data.select)
    .sort(data.data.sort)
    .limit(data.data.limit);
  if(lotes === null){
    throw new Error("Error en la busqueda");
  } else {
    return {...data, response:{status:200, message:"OK", data:lotes}};
  }
};
const getContenedores = async data => {
  const contenedores = await Contenedores.find().populate(data.data.populate);
  if(contenedores === null){
    throw new Error("Error en la busqueda no se econtraron contenedores");
  }
  if(Object.prototype.hasOwnProperty.call(contenedores[0]._doc,"pallets")){
    const new_conts = contenedores.map(contenedor => contenedor.toObject());
    const new_contenedores = await oobtener_datos_lotes_to_listaEmpaque(new_conts);
    Promise.all(new_contenedores);
    return {...data, response:{status:200, message:"OK", data:new_contenedores}};
  }
  return {...data, response:{status:200, message:"OK", data:contenedores}};
};
const getHistorialDescartes = async data => {
  const descartes = await historialDescarte.find(data.data.query, data.data.select)
    .sort(data.data.sort)
    .limit(data.data.limit);

  if(descartes === null){
    throw new Error("Error en la busqueda");
  } else {
    return {...data, response:{status:200, message:"OK", data:descartes}};
  }

};

module.exports = {
  getProveedores,
  getClientes,
  getlotes,
  getHistorialLotes,
  getContenedores,
  getHistorialDescartes
};