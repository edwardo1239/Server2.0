const fs = require("fs");
const { iniciarRedisDB } = require("../../DB_redis/config/init");
const { updateApi } = require("./update/reduce");
const { modificar_predio_proceso_descartes, modificar_predio_proceso, modificar_predio_proceso_listaEmpaque } = require("./update/functions");
const { getApi } = require("./get/reduce");

const clientePromise = iniciarRedisDB();


const apiVariablesProceso = {
  obtenerEF1: async data => {
    try {
      const pathIDs = "./server/variablesDeProceso/ids.json";
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
      const pathIDs = "./server/variablesDeProceso/ids.json";
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
      const pathIDs = "./server/variablesDeProceso/ids.json";

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

      const kilosVaciadosExist = await cliente.exists("kilosVaciadosHoy");
      if(kilosVaciadosExist !== 1){
        await cliente.set("kilosVaciadosHoy", 0);
      }
      const kilosVaciadosHoy = await cliente.get("kilosVaciadosHoy");
      ids.kilosVaciados = kilosVaciados;
      ids.kilosProcesados = 0;
      const kilosVaciadosRedis = Number(kilosVaciadosHoy) + Number(kilosVaciados);
      //se ingresa los datos a redis
      await cliente.set("descarteLavado", 0);
      await cliente.set("descarteEncerado", 0);
      await cliente.set("kilosVaciadosHoy", kilosVaciadosRedis);
      await modificar_predio_proceso(lote);
      await modificar_predio_proceso_descartes(lote);
      await modificar_predio_proceso_listaEmpaque(lote);

      const newIdsJSON = JSON.stringify(ids);
      fs.writeFileSync(pathIDs, newIdsJSON);

      return { status: 200, message: "Ok", data:obj };
    } catch (e) {
      return { status: 402, message: `Error obteniendo el EF1: ${e}` };
    }
  },
  obtenerEF1Descartes: async data => {
    try {
      const cliente = await clientePromise;
      const predioData = await cliente.hGetAll("predioProcesandoDescartes");
      return { ...data, response: predioData, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: "Error obteniendo el EF1" };
    }
  },
  obtenerEF1ListaEmpaque: async data => {
    try {
      const cliente = await clientePromise;
      const predioData = await cliente.hGetAll("predioProcesandoDescartes");
      return { ...data, response: {...predioData, status: 200, message: "Ok"} };
    } catch (e) {
      return { ...data, response: {status: 402, message: "Error obteniendo el EF1" }};
    }
  },
  obtenerEF1Sistema: async data => {
    try {
      const cliente = await clientePromise;
      const inicioProceso = await cliente.get("inicioProceso");
      const predioData = await cliente.hGetAll("predioProcesando");
      const kilosVaciadosHoy = await cliente.get("kilosVaciadosHoy");
      const kilosProcesadosHoy = await cliente.get("kilosProcesadosHoy");
      const kilosExportacionHoy = await cliente.get("kilosExportacionHoy");
      const kilosProcesadosHora = await cliente.get("kilosProcesadosHora");
      const kilosExportacionHora = await cliente.get("kilosExportacionHora");
      let rendimientoTotal;
      if(Number(kilosProcesadosHoy) === 0)
        rendimientoTotal = 0;
      else
        rendimientoTotal = (Number(kilosExportacionHoy) * 100) / Number(kilosProcesadosHoy);
      console.log(kilosProcesadosHora);
      return { ...data, response: {
        predioProcesando: predioData, 
        kilosVaciadosHoy: Number(kilosVaciadosHoy),
        kilosProcesadosHoy: Number(kilosProcesadosHoy),
        inicioProceso: inicioProceso,
        kilosProcesadosHora: isNaN(kilosProcesadosHora) ? 0 : Number(kilosProcesadosHora),
        kilosExportacionHoy: Number(kilosExportacionHoy),
        kilosExportacionHora: isNaN(kilosExportacionHora) ? 0 : Number(kilosExportacionHora),
        rendimiento: Number(rendimientoTotal)
      }, 
      status: 200,
      message: "Ok" 
      };
    } catch (e) {
      return { status: 402, message: "Error obteniendo el EF1" };
    }
  },
  generarCelifrut: async data => {
    try {
      const pathIDs = "./server/variablesDeProceso/ids.json";
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
      const pathCajasSinPallet = "./server/variablesDeProceso/listaEmpaque/cajasSinPallet.json";
      const cajasJSON = fs.readFileSync(pathCajasSinPallet);
      const cajas = JSON.parse(cajasJSON);
      return { ...data, response:{data: cajas, status: 200, message: "Ok"}};
    } catch (e) {
      return { ...data, response: {status: 402, message: `Error obteniendo las cajas, ${e}`}};
    }
  },
  guardarCajasSinPallet: async data => {
    try {
      const pathCajasSinPallet = "./server/variablesDeProceso/listaEmpaque/cajasSinPallet.json";
      const newCajasSinPalletJSON = JSON.stringify(data);
      fs.writeFileSync(pathCajasSinPallet, newCajasSinPalletJSON);
      return { ...data, status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: `Error obteniendo las cajas, ${e}` };
    }
  },
  ingresoDescarte: async data => {
    try {
      const kilos = data.data.lote.$inc;
      const cliente = await clientePromise;
      const kilosProcesadosHoy = await cliente.get("kilosProcesadosHoy");
      const sumKilos = Object.entries(kilos)
        .filter(([key]) => key.startsWith("descarteLavado") || key.startsWith("descarteEncerado"))
        .reduce((sum, [, value]) => sum + value, Number(kilosProcesadosHoy));
      await cliente.set("kilosProcesadosHoy", sumKilos);
      return { status: 200, message: "Ok" };
    } catch (e) {
      console.error(`Error en ingresoDescarte, ${e}`);
      return {response:{ status: 402, message: `Error en ingresoDescarte, ${e}`} };
    }
  },
  fechaInicioProceso: async data => {
    try {
      const cliente = await clientePromise;
      const fechaInicio = await cliente.get("inicioProceso");
      if (Number(fechaInicio) === 0) {
        await cliente.set("inicioProceso", data.fechaInicio);
      } 
      
      console.log(fechaInicio);
      return { status: 200, message: "Ok" };
    } catch (e) {
      return { status: 402, message: `Error ingresando la fecha de inicio: ${e}` };
    }
  },
  ingresarExportacion: async data => {
    try {
      const cliente = await clientePromise;
      const kilosProcesadosHoy = await cliente.get("kilosProcesadosHoy");
      const kilosExportacionHoy = await cliente.get("kilosExportacionHoy");
      const kilos = Number(kilosProcesadosHoy) + data;
      const kilosExportacion = Number(kilosExportacionHoy) + data;
      await cliente.set("kilosProcesadosHoy", kilos);
      await cliente.set("kilosExportacionHoy", kilosExportacion);

    } catch(e) {
      console.error(`Error en ingresarExportacion, ${e}`);
      return {response:{ status: 402, message: `Error en ingreso exportacion variables proceso, ${e}`} };
    }
  },
  modificar_sistema: async data => {
    return await updateApi[data.query](data);
  },
  obtener_datos_sistem: async data => {
    return await getApi[data.query](data);
  }
};

module.exports.apiVariablesProceso = apiVariablesProceso;
