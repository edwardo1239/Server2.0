const fs = require("fs");
const { descarteTotal } = require("./functions/proceso");
const { iniciarRedisDB } = require("../../DB_redis/config/init");

const clientePromise = iniciarRedisDB();


const apiVariablesProceso = {
  obtenerEF1: async data => {
    try {
      const pathIDs = "./serverless/variablesDeProceso/ids.json";
      if (!fs.existsSync(pathIDs)) {
        fs.writeFileSync(pathIDs, JSON.stringify({}));
      }
      const idsJSON = fs.readFileSync(pathIDs);
      const ids = JSON.parse(idsJSON);
      return { ...data, response: ids, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: "Error obteniendo el EF1" };
    }
  },
  generarEF1: async data => {
    try {
      const pathIDs = "./serverless/variablesDeProceso/ids.json";
      if (!fs.existsSync(pathIDs)) {
        fs.writeFileSync(pathIDs, JSON.stringify({}));
      }
      const idsJSON = fs.readFileSync(pathIDs);
      const ids = JSON.parse(idsJSON);
      let fecha = new Date();
      let year = fecha.getFullYear().toString().slice(-2);
      let month = String(fecha.getMonth() + 1).padStart(2, "0");
      let enf;
      if (ids.enf < 10) {
        enf = "EF1-" + year + month + "0" + ids.enf;
      } else {
        enf = "EF1-" + year + month + ids.enf;
      }
      ids.enf += 1;

      const newidsJSON = JSON.stringify(ids);
      fs.writeFileSync(pathIDs, newidsJSON);

      return { ...data, response: enf, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: "Error generando la fecha" };
    }
  },
  procesarEF1: async data => {
    try {
      const pathListaEmpaqueIDs = "./serverless/variablesDeProceso/listaEmpaque/predioListaEmpaque.json";
      const pathDescartesIDs = "./serverless/variablesDeProceso/descartes/predioDescartes.json";
      const pathIDs = "./serverless/variablesDeProceso/ids.json";

      const idsJSON = fs.readFileSync(pathIDs);
      const ids = JSON.parse(idsJSON);
      const cliente = await clientePromise;
      const lote = data.data.lote;
      const obj = {
        _id: lote._id,
        enf: lote.enf,
        predio: lote.predio._id,
        nombrePredio: lote.predio.PREDIO,
        tipoFruta: lote.tipoFruta,
      };

      const kilosVaciados = lote.promedio * data.data.vaciado;

      ids.kilosVaciados = kilosVaciados;
      ids.kilosProcesados = 0;
      await cliente.set("descarteLavado", 0);
      await cliente.set("descarteEncerado", 0);
      await cliente.hSet("predioProcesando", {
        _id: lote._id,
        enf: lote.enf,
        predio: lote.predio._id,
        nombrePredio: lote.predio.PREDIO,
        tipoFruta: lote.tipoFruta,
      });

      const newidsDescartesJSON = JSON.stringify(obj);
      fs.writeFileSync(pathDescartesIDs, newidsDescartesJSON);
      const newidsListaEmpaqueJSON = JSON.stringify(obj);
      fs.writeFileSync(pathListaEmpaqueIDs, newidsListaEmpaqueJSON);
      const newIdsJSON = JSON.stringify(ids);
      fs.writeFileSync(pathIDs, newIdsJSON);

      return { status: 200, message: "Ok", data:obj };
    } catch (e) {
      return { status: 402, message: `Error obteniendo el EF1: ${e}` };
    }
  },
  obtenerEF1Descartes: async data => {
    try {
      const pathDescartesIDs = "./serverless/variablesDeProceso/descartes/predioDescartes.json";
      const idsJSON = fs.readFileSync(pathDescartesIDs);
      const ids = JSON.parse(idsJSON);
      return { ...data, response: ids, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: "Error obteniendo el EF1" };
    }
  },
  obtenerEF1ListaEmpaque: async data => {
    try {
      const pathListaEmpaqueIDs = "./serverless/variablesDeProceso/listaEmpaque/predioListaEmpaque.json";
      const idsJSON = fs.readFileSync(pathListaEmpaqueIDs);
      const ids = JSON.parse(idsJSON);
      return { ...data, response: {...ids, status: 200, message: "Ok"} };
    } catch (e) {
      return { ...data, response: {status: 402, message: "Error obteniendo el EF1" }};
    }
  },
  obtenerEF1Sistema: async data => {
    try {
      const cliente = await clientePromise;
      const predioData = await cliente.hGetAll("predioProcesando");

      return { ...data, response: predioData, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: "Error obteniendo el EF1" };
    }
  },
  generarCelifrut: async data => {
    try {
      const pathIDs = "./serverless/variablesDeProceso/ids.json";
      const idsJSON = fs.readFileSync(pathIDs);
      const ids = JSON.parse(idsJSON);
      
      const enf = "Celifrut-" + ids.idCelifrut;
      ids.idCelifrut += 1;

      const newidsJSON = JSON.stringify(ids);
      fs.writeFileSync(pathIDs, newidsJSON);

      return { ...data, response: enf, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: "Error generando la fecha" };
    }
  },
  obtenerCajasSinPallet: async data => {
    try {
      const pathCajasSinPallet = "./serverless/variablesDeProceso/listaEmpaque/cajasSinPallet.json";
      const cajasJSON = fs.readFileSync(pathCajasSinPallet);
      const cajas = JSON.parse(cajasJSON);
      return { ...data, response:{data: cajas, status: 200, message: "Ok"}};
    } catch (e) {
      return { ...data, response: {status: 402, message: `Error obteniendo las cajas, ${e}`}};
    }
  },
  guardarCajasSinPallet: async data => {
    try {
      const pathCajasSinPallet = "./serverless/variablesDeProceso/listaEmpaque/cajasSinPallet.json";
      const newCajasSinPalletJSON = JSON.stringify(data);
      fs.writeFileSync(pathCajasSinPallet, newCajasSinPalletJSON);
      return { ...data, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: `Error obteniendo las cajas, ${e}` };
    }
  },
  obtenerOrdenDeVaceo: async data => {
    try {
      const pathOrdenDeVaceo = "./serverless/variablesDeProceso/desktop/ordenDeVaceo.json";
      const ordenVaceoJSON = fs.readFileSync(pathOrdenDeVaceo);
      const orden = JSON.parse(ordenVaceoJSON);
      return { ...data, response: orden, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: `Error obteniendo el orden de vaceo, ${e}` };
    }
  },
  guardarOrdenDeVaceo: async data => {
    try {
      const pathOrdenDeVaceo = "./serverless/variablesDeProceso/desktop/ordenDeVaceo.json";
      const newOrdenJSON = JSON.stringify(data.data);
      fs.writeFileSync(pathOrdenDeVaceo, newOrdenJSON);
      return { response:{status: 200, message: "Ok" }};
    } catch (e) {
      return {response:{ status: 402, message: `Error obteniendo el orden de vaceo, ${e}`} };
    }
  },
  ingresoDescarte: async data => {
    try{
      const pathIDs = "./serverless/variablesDeProceso/ids.json";
      const idsJSON = fs.readFileSync(pathIDs);
      const ids = JSON.parse(idsJSON);
      const cliente = await clientePromise;
      if(Object.prototype.hasOwnProperty.call(data.data.lote, "descarteLavado")){
        const descarteLavado = await descarteTotal(data.data.lote.descarteLavado);
        await cliente.set("descarteLavado", descarteLavado);
      }
      if(Object.prototype.hasOwnProperty.call(data.data.lote, "descarteEncerado")){
        const descarteEncerado = await descarteTotal(data.data.lote.descarteEncerado);
        await cliente.set("descarteEncerado", descarteEncerado);
      }
      const descarteLavado = await cliente.get("descarteLavado");
      const descarteEncerado = await cliente.get("descarteEncerado");

      const descarte = Number(descarteLavado) + Number(descarteEncerado);
      ids.kilosProcesados = descarte;

      const newIdsJSON = JSON.stringify(ids);
      fs.writeFileSync(pathIDs, newIdsJSON);

      return { status: 200, message: "Ok" };

    } catch (e){
      console.error(`Error en ingresoDescarte, ${e}`);
      return {response:{ status: 402, message: `Error en ingresoDescarte, ${e}`} };
    }
  },
  fechaInicioProceso: async data => {
    try {
      const cliente = await clientePromise;

      await cliente.set("inicioProceso", data.fechaInicio);
  
 
      return { status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: `Error ingresando la fecha de inicio: ${e}` };
    }
  }
};

module.exports.apiVariablesProceso = apiVariablesProceso;
