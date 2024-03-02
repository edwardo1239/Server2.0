const { Clientes } = require("../../../schemas/clientes/schemaClientes");
const { Contenedores } = require("../../../schemas/contenedores/schemaContenedores");
const { historialDescarte } = require("../../../schemas/lotes/schemaHistorialDescarte");
const { Lotes } = require("../../../schemas/lotes/schemaLotes");
const { Proveedores } = require("../../../schemas/proveedores/schemaProveedores");

const addLote = async data => {
  try {
    const lote = new Lotes(data.data);
    const saveLote = await lote.save();

    return {...data, response: {status:200, message:"Ok", data:saveLote}};
  } catch (e) {
    console.error(e);
    return { ...data, response: { status: 400, message: "Error en la funcion addLote" } };
  }
};
const addContenedor = async data =>{
  try {
    const lote = new Contenedores(data.data);
    await lote.save();

    return {...data, response: {status:200, message:"Ok"}};
  } catch (e) {
    console.error(e);
    return { ...data, response: { status: 400, message: "Error en la funcion addLote" } };
  }
};
const addHistorialDescarte = async data =>{
  try {
    const lote = new historialDescarte(data.data);
    await lote.save();

    return {...data, response: {status:200, message:"Ok"}};
  } catch (e) {
    console.error(e);
    return { ...data, response: { status: 400, message: "Error en la funcion addLote" } };
  }
};
const addProveedor = async data => {
  try {
    const proveedor = new Proveedores(data.data);
    const saveProveedor = await proveedor.save();

    return {...data, response: {status:200, message:"Ok", data:saveProveedor}};
  } catch (e) {
    console.error(e);
    return { ...data, response: { status: 400, message: `Error en la funcion addProveedor: ${e}` } };
  }
};
const addCliente = async data => {
  try {
    const cliente = new Clientes(data.data);
    await cliente.save();

    return {...data, response: {status:200, message:"Ok"}};
  } catch (e) {
    console.error(e);
    return { ...data, response: { status: 400, message: `Error en la funcion addCliente: ${e}` } };
  }
};

module.exports = {
  addLote,
  addContenedor,
  addHistorialDescarte,
  addProveedor,
  addCliente
};
