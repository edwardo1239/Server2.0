const { default: mongoose } = require("mongoose");
const { Clientes } = require("../../../schemas/clientes/schemaClientes");
const { Contenedores } = require("../../../schemas/contenedores/schemaContenedores");
const { historialDescarte } = require("../../../schemas/lotes/schemaHistorialDescarte");
const { Lotes } = require("../../../schemas/lotes/schemaLotes");
const { recordLotes } = require("../../../schemas/lotes/schemaRecordLotes");
const { Proveedores } = require("../../../schemas/proveedores/schemaProveedores");
const { oobtener_datos_lotes_to_listaEmpaque } = require("../../../functions/proceso");

const getProveedores = async data => {
  try{
    const proveedores = await Proveedores.find(data.data.query);
    if(proveedores === null){
      return {...data, response:{status:404, message:"Error en la busqueda"}};
    } else {
      return {...data, response:{status:200, message:"OK", data:proveedores}};
    }
  } catch (e){
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion getProveedores"}};
  }
};
const getClientes = async data => {
  try{
    const clientes = await  Clientes.find(data.data.query);
    if(clientes === null){
      return {...data, response:{status:404, message:"Error en la busqueda"}};
    } else {
      return {...data, response:{status:200, message:"OK", data:clientes}};
    }
  } catch (e){
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion getClientes"}};
  }
};
const getlotes = async data => {
  try{
    if(Object.prototype.hasOwnProperty.call(data.data, "query") && Object.prototype.hasOwnProperty.call(data.data.query, "_id")){
      const _id = new mongoose.Types.ObjectId(data.data.query._id);
      data.data.query._id = _id;
    }
    const lotes = await Lotes.find(data.data.query, data.data.select)
      .populate(data.data.populate)
      .sort(data.data.sort)
      .limit(data.data.limit);

    if(lotes === null){
      return {...data, response:{status:404, message:"Error en la busqueda"}};
    } else {
      return {...data, response:{status:200, message:"OK", data:lotes}};
    }
  } catch (e){
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion getlotes"}};
  }
};
const getHistorialLotes = async data => {
  try{

    const lotes = await recordLotes.find(data.data.query, data.data.select)
      .sort(data.data.sort)
      .limit(data.data.limit);
    if(lotes === null){
      return {...data, response:{status:404, message:"Error en la busqueda"}};
    } else {
      return {...data, response:{status:200, message:"OK", data:lotes}};
    }
  } catch (e){
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion getHistorialLotes"}};
  }
};
const getContenedores = async data => {
  try{
    const contenedores = await Contenedores.find()
      .populate(data.data.populate);
    if(contenedores === null){
      return {...data, response:{status:404, message:"Error en la busqueda no se econtraron contenedores"}};
    } else {
      if(Object.prototype.hasOwnProperty.call(contenedores[0]._doc,"pallets")){
        const new_conts = contenedores.map(contenedor => contenedor.toObject());
        const new_contenedores = await oobtener_datos_lotes_to_listaEmpaque(new_conts);
        Promise.all(new_contenedores);
        return {...data, response:{status:200, message:"OK", data:new_contenedores}};

      }

      return {...data, response:{status:200, message:"OK", data:contenedores}};
    }
  } catch (e){
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion getContenedores"}};
  }
};
const getHistorialDescartes = async data => {
  try{
    const descartes = await historialDescarte.find(data.data.query, data.data.select)
      .sort(data.data.sort)
      .limit(data.data.limit);

    if(descartes === null){
      return {...data, response:{status:404, message:"Error en la busqueda"}};
    } else {
      return {...data, response:{status:200, message:"OK", data:descartes}};
    }
  } catch (e){
    console.error(e);
    return {...data, response:{status:401, message:"Error en la funcion getlotes"}};
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