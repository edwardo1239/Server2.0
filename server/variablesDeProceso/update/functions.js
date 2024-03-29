const { iniciarRedisDB } = require("../../../DB_redis/config/init");
const fs = require("fs");

const clientePromise = iniciarRedisDB();

const modificar_predio_proceso = async lote => {
  const cliente = await clientePromise;
  await cliente.hSet("predioProcesando", {
    _id: lote._id,
    enf: lote.enf,
    predio: lote.predio._id,
    nombrePredio: lote.predio.PREDIO,
    tipoFruta: lote.tipoFruta,
  });

  return { response: { status: 200, message: "Ok" } };
};
const modificar_predio_proceso_descartes = async lote => {
  const cliente = await clientePromise;

  await cliente.hSet("predioProcesandoDescartes", {
    _id: lote._id,
    enf: lote.enf,
    predio: lote.predio._id,
    nombrePredio: lote.predio.PREDIO,
    tipoFruta: lote.tipoFruta,
  });

  return { response: { status: 200, message: "Ok" } };
};
const modificar_predio_proceso_listaEmpaque = async lote => {
  const cliente = await clientePromise;

  await cliente.hSet("predioProcesandoListaEmpaque", {
    _id: lote._id,
    enf: lote.enf,
    predio: lote.predio._id,
    nombrePredio: lote.predio.PREDIO,
    tipoFruta: lote.tipoFruta,
  });

  return { response: { status: 200, message: "Ok" } };
};
const add_orden_de_vaceo = async data => {
  const pathOrdenDeVaceo = "./server/variablesDeProceso/ordenDeVaceo.json";
  const newOrdenJSON = JSON.stringify(data);
  fs.writeFileSync(pathOrdenDeVaceo, newOrdenJSON);
  process.send({data:data, fn:"OrdenVaciado", status:200});
  return { response:{status: 200, message: "Ok" }};
};



module.exports = {
  modificar_predio_proceso,
  modificar_predio_proceso_descartes,
  modificar_predio_proceso_listaEmpaque,
  add_orden_de_vaceo
};
