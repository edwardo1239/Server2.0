const fs = require("fs");

const get_orden_de_vaceo = async () => {
  const pathOrdenDeVaceo = "./server/variablesDeProceso/ordenDeVaceo.json";
  const ordenVaceoJSON = fs.readFileSync(pathOrdenDeVaceo);
  const orden = JSON.parse(ordenVaceoJSON);
  return {response: {data: orden, status: 200, message: "Ok" }};
};

module.exports ={
  get_orden_de_vaceo
};