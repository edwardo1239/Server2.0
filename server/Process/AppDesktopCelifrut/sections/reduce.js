const { apiVariablesProceso } = require("../../../variablesDeProceso/reduce");
const { apiClientes } = require("./clientes/reducer");
const { apiContenedores } = require("./contenedores/reducer");
const { apiLotes } = require("./lotes/reducer");
const { apiProveedores } = require("./proveedores/reducer");
const { apiUser } = require("./user/reducer");

const apiDesktop = {
  proveedors: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiProveedores, data.action)){
      const response = await apiProveedores[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiProveedores"});
    }
  },
  clientes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiClientes, data.action)){
      const response = await apiClientes[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiClientes"});
    }
  },
  lotes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiLotes, data.action)){
      const response = await apiLotes[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiLotes"});
    }
  },
  historialLotes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiLotes, data.action)){
      const response = await apiLotes[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiLotes"});
    }
  },
  contenedores: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiContenedores, data.action)){
      const response = await apiContenedores[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiContenedores"});
    }
  },
  variablesDesktop: async (data) => {

    if(Object.prototype.hasOwnProperty.call(apiVariablesProceso, data.action)){
      const response = await apiVariablesProceso[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on variablesDesktop"});
    }
  },
  historialDescartes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiLotes, data.action)){
      const response = await apiLotes[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiLotes"});
    }
  },
  permisos: async (data)=> {
    if(Object.prototype.hasOwnProperty.call(apiUser, data.action)){
      const response = await apiUser[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiLotes"});
    }
  },
  users: async (data)=> {
    if(Object.prototype.hasOwnProperty.call(apiUser, data.action)){
      const response = await apiUser[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiLotes"});
    }
  },
};

module.exports.apiDesktop = apiDesktop;
