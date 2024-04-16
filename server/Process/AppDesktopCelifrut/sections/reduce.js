
const codeError = require("../../../error/codeErrors.json");
// Definimos los módulos API en un objeto
const apiModules = {
  proveedors: require("./proveedores/reducer"),
  clientes: require("./clientes/reducer"),
  lotes: require("./lotes/reducer"),
  precios: require("./lotes/reducer"),
  historialLotes: require("./lotes/reducer"),
  contenedores: require("./contenedores/reducer"),
  variablesDesktop: require("../../../variablesDeProceso/reduce"),
  historialDescartes: require("./lotes/reducer"),
  permisos: require("./user/reducer"),
  users: require("./user/reducer"),
  calidad: require("./calidad/reducer")
};

// Creamos un nuevo objeto para almacenar las funciones API
const apiDesktop = {};

// Iteramos sobre cada módulo API en apiModules
for (const [key, apiModule] of Object.entries(apiModules)) {
  apiDesktop[key] = async (data) => {
    if (Object.prototype.hasOwnProperty.call(apiModule[Object.keys(apiModule)], data.action)) {
      const response = await apiModule[Object.keys(apiModule)][data.action](data);
      return response;
    } else {
      throw new Error(`apiDesktop ${codeError.STATUS_FUNCTION_DONT_FOUND.message} on ${key}`);
    }
  };
}

// Exportamos apiDesktop
module.exports.apiDesktop = apiDesktop;

