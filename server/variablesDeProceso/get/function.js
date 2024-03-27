const fs = require("fs");
const { iniciarRedisDB } = require("../../../DB_redis/config/init");

const get_orden_de_vaceo = async () => {
  const pathOrdenDeVaceo = "./server/variablesDeProceso/ordenDeVaceo.json";
  const ordenVaceoJSON = fs.readFileSync(pathOrdenDeVaceo);
  const orden = JSON.parse(ordenVaceoJSON);
  return {response: {data: orden, status: 200, message: "Ok" }};
};

const obtener_EF1_procesando = async () => {
  const cliente = await iniciarRedisDB();
  const predioData = await cliente.hGetAll("predioProcesandoDescartes");
  return {response: {data: predioData, status: 200, message: "Ok" }};
};
module.exports ={
  get_orden_de_vaceo,
  obtener_EF1_procesando
};