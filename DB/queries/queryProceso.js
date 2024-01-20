const { default: mongoose } = require("mongoose");
const { Desverdizado } = require("../Schemas/lotes/schemaDesverdizado");
const { Lotes } = require("../Schemas/lotes/schemaLotes");
const { recordLotes } = require("../Schemas/lotes/schemaRecordLotes");
const { Proveedores } = require("../Schemas/proveedores/schemaProveedores");
const { historialDescarte } = require("../Schemas/lotes/schemaHistorialDescarte");
const { Clientes } = require("../Schemas/clientes/schemaClientes");
const { Contenedores } = require("../Schemas/contenedores/schemaContenedores");
const {
  obtenerCajasSinPallet,
  guardarCajasSinpallet,
} = require("../../ListaDeEmpaque/public/functions/listaDeEmpaque");
const { pesoTipoCaja } = require("../../ListaDeEmpaque/utils/pesoCajas");
const { obtenerIDs, guardarIDs } = require("../../AppDesktopCelifrut/public/inventarioFruta/functions/savegetDataJSON");
const fs = require("fs");
const { rendimiento, deshidratacion, saveFiles } = require("../functions/proceso");
const { recordProveedores } = require("../Schemas/proveedores/schemaRecordProveedores");

const obtenerProveedores = async data => {
  try {
    const proveedores = await Proveedores.find();
    data.data = proveedores;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const agregarProveedor = async data => {
  try {
    //console.log(data.data.data.documentos);

    const info = data.data.data;
    const paths = await saveFiles(info.documentos, `./Files/proveedores/${info.nombrePredio}`, info.nombrePredio);
    const proveedor = new Proveedores({
      "CODIGO INTERNO": info.codigoInterno,
      PREDIO: info.nombrePredio,
      ICA: info.ICA,
      DEPARTAMENTO: info.departamento,
      GGN: info.GGN,
      "FECHA VENCIMIENTO GGN": info.fechaVencimiento,
      N: info.naranja ? "X" : "",
      L: info.limon ? "X" : "",
      M: info.mandarina ? "X" : "",
      urlArchivos: paths
    });

    let record = new recordProveedores({
      operacionRealizada: "añadir",
      nombreProveedor: proveedor.PREDIO,
      fecha: new Date(),
    });

    await record.save();
    await proveedor.save();
    return data;
  } catch (e) {
    console.error(e);
  }
};
const modificarProveedor = async data => {
  try{
    const info = data.data.data;
    const id = new mongoose.Types.ObjectId(info.id);
    const proveedor = await Proveedores.findById(id);
    proveedor["CODIGO INTERNO"] = info.codigoInterno;
    proveedor.PREDIO = info.nombrePredio;
    proveedor.ICA = info.ICA;
    proveedor.GGN = info.GGN;
    proveedor["FECHA VENCIMIENTO GGN"] = info.fechaVencimiento;
    proveedor.N = info.naranja ? "X" : "";
    proveedor.L = info.limon ? "X" : "";
    proveedor.M = info.mandarina ? "X" : "";

    let record = new recordProveedores({
      operacionRealizada: "modificar",
      nombreProveedor: proveedor.PREDIO,
      fecha: new Date(),
    });

    // Guarda el registro
    await record.save();
    await proveedor.save();

    return data;
    
  } catch(e){
    console.error(e);
  }
};
const eliminarProveedor = async data => {
  try{
    const info = data.data.data;

    const id = new mongoose.Types.ObjectId(info._id);
    const proveedor = await Proveedores.findById(id);

    let record = new recordProveedores({
      operacionRealizada: "eliminar",
      nombreProveedor: proveedor.PREDIO,
      fecha: new Date(),
    });

    // Guarda el registro
    await record.save();
    await proveedor.deleteOne();

    return data;

  } catch (e){
    console.error(e);
  }
};
const guardarLote = async data => {
  try {
    const ids = await obtenerIDs();

    let fecha = new Date();
    let year = fecha.getFullYear().toString().slice(-2);
    let month = String(fecha.getMonth() + 1).padStart(2, "0");
    let enf;
    if (ids.enf < 10) {
      enf = "EF1-" + year + month + "0" + ids.enf;
    } else {
      enf = "EF1-" + year + month + ids.enf;
    }

    const datos = data.data.data;
    const lote = new Lotes({
      _id: enf,
      nombrePredio: datos.nombre,
      fechaIngreso: new Date(),
      canastillas: Number(datos.canastillas),
      tipoFruta: datos.tipoFruta,
      observaciones: datos.observaciones,
      kilos: Number(datos.kilos),
      placa: datos.placa,
      promedio: datos.promedio,
      inventarioActual: {
        inventario: Number(datos.canastillas),
        descarteLavado: { balin: 0, pareja: 0, descarteGeneral: 0 },
        descarteEncerado: { balin: 0, pareja: 0, extra: 0, descarteEncerado: 0 },
      },
      descarteLavado: {},
      descarteEncerado: {},
      calidad: {},
      exportacion: {},
    });
    lote._operationType = "Se añadio un lote";
    ids.enf += 1;

    await lote.save();
    await guardarIDs(ids);
    return { ...data, status: 200 };
  } catch (e) {
    console.error(e);
  }
};
const obtenerFrutaActual = async data => {
  try {
    const lotes = await Lotes.find(
      {
        "inventarioActual.inventario": { $gt: 0 },
      },
      "nombrePredio fechaIngreso observaciones tipoFruta promedio inventarioActual.inventario",
    );
    const arrayNombrePredios = lotes.map(lote => lote.nombrePredio);
    const proveedores = await Proveedores.find({ PREDIO: { $in: arrayNombrePredios } }, "ICA PREDIO");
    const objFrutaActual = lotes.map(lote => {
      const proveedor = proveedores.find(item => item.PREDIO === lote.nombrePredio);

      return {
        _id: lote._id,
        ICA: proveedor.ICA,
        nombre: lote.nombrePredio,
        fecha: lote.fechaIngreso,
        inventario: lote.inventarioActual.inventario,
        observaciones: lote.observaciones,
        tipoFruta: lote.tipoFruta,
        KilosActual: lote.promedio * lote.inventarioActual.inventario,
      };
    });

    data.data = objFrutaActual;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const vaciarLote = async data => {
  const enf = data.data.enf;
  const canastillas = data.data.canastillas;
  const lote = await Lotes.findById(
    enf,
    "promedio rendimiento kilosVaciados tipoFruta nombrePredio inventarioActual.inventario",
  );

  const promedio = lote.promedio;

  lote.inventarioActual.inventario -= Number(canastillas);
  lote.kilosVaciados += canastillas * lote.promedio;

  lote._operationType = "Vaciado";
  lote._canastillasProcesadas = Number(canastillas);

  await lote.save();

  data.data = {
    promedio: promedio,
    enf: enf,
    tipoFruta: lote.tipoFruta,
    nombrePredio: lote.nombrePredio,
    canastillas: canastillas,
  };
  return data;
};
const obtenerHistorialProceso = async data => {
  const historial = await recordLotes.find({ operacionRealizada: "Vaciado" }).sort({ fecha: -1 }).limit(200);
  const enfs = historial.map(item => item.documento._id);
  const lotes = await Lotes.find({ _id: enfs }, "tipoFruta nombrePredio rendimiento");

  let datos = historial.map(item => {
    const lote = lotes.find(lot => lot._id === item.documento._id);
    return {
      _id: item._id,
      enf: item.documento._id,
      nombre: lote.nombrePredio,
      canastillas: item.canastillas,
      kilos: Number(item.canastillas) * Number(item.documento.promedio),
      tipoFruta: lote.tipoFruta,
      fecha: item.fecha,
      rendimiento: lote.rendimiento,
    };
  });
  data.data = datos;
  return data;
};
const directoNacional = async data => {
  const lote = await Lotes.findById(data.data.enf);

  lote.inventarioActual.inventario -= Number(data.data.canastillas);
  lote.directoNacional += data.data.canastillas * lote.promedio;

  lote._operationType = "Directo nacional";
  lote._canastillasProcesadas = Number(data.data.canastillas);

  lote.deshidratacion = deshidratacion(lote);

  await lote.save();

  return data;
};
const obtenerHistorialDirectoNacional = async data => {
  const historial = await recordLotes.find({ operacionRealizada: "Directo nacional" }).sort({ fecha: -1 }).limit(200);
  const enfs = historial.map(item => item.documento._id);
  const lotes = await Lotes.find({ _id: enfs }, "tipoFruta nombrePredio");

  let datos = historial.map(item => {
    const lote = lotes.find(lot => lot._id === item.documento._id);
    return {
      _id: item._id,
      enf: item.documento._id,
      nombre: lote.nombrePredio,
      canastillas: item.canastillas,
      kilos: Number(item.canastillas) * Number(item.documento.promedio),
      tipoFruta: lote.tipoFruta,
      fecha: item.fecha,
    };
  });
  data.data = datos;
  return data;
};
const desverdizado = async data => {
  const canastillas = data.data.canastillas;
  const cuartoDesverdizado = data.data.cuartoDesverdizado;
  const lotes = await Lotes.findById(data.data.enf, "promedio rendimiento desverdizado inventarioActual");
  lotes.inventarioActual.inventario -= Number(canastillas);

  let desverdizando;
  desverdizando = await Desverdizado.findById({ _id: data.data.enf });
  if (desverdizando) {
    desverdizando.canastillas += Number(canastillas);
    desverdizando.canastillasIngreso += Number(canastillas);
    desverdizando.kilosIngreso += Number(canastillas) * lotes.promedio;
    desverdizando.kilos += Number(canastillas) * lotes.promedio;
    desverdizando.cuartoDesverdizado += cuartoDesverdizado + " ";
  } else {
    desverdizando = new Desverdizado({
      _id: data.data.enf,
      fechaIngreso: new Date(),
      desverdizando: true,
    });
    desverdizando.canastillas += Number(canastillas);
    desverdizando.canastillasIngreso += Number(canastillas);
    desverdizando.kilosIngreso += Number(canastillas) * lotes.promedio;
    desverdizando.kilos += Number(canastillas) * lotes.promedio;
    desverdizando.cuartoDesverdizado += cuartoDesverdizado + " ";
  }

  lotes.desverdizado += canastillas * lotes.promedio;
  lotes._operationType = "Desverdizado";

  await lotes.save();
  await desverdizando.save();

  return data;
};
const modificarHistorialVaciado = async data => {
  try {
    const lotes = await Lotes.findById(data.data.enf, "promedio kilosVaciados inventarioActual");
    const id = new mongoose.Types.ObjectId(data.data.id);
    const historial = await recordLotes.findById({ _id: id });

    lotes.inventarioActual.inventario += Number(data.data.canastillas);
    historial.canastillas -= Number(data.data.canastillas);

    lotes.kilosVaciados -= Number(data.data.canastillas) * lotes.promedio;
    lotes._operationType = "ModificarVaciado";
    lotes._canastillasProcesadas = Number(data.data.canastillas);

    await historial.save();
    await lotes.save();
    data.promedio = lotes.promedio;

    return data;
  } catch (e) {
    return console.error(`${e.name}: ${e.message}`);
  }
};
const modificarHistorialDirectoNacional = async data => {
  try {
    const canastillas = data.data.canastillas;
    const lotes = await Lotes.findById(data.data.enf);
    const id = new mongoose.Types.ObjectId(data.data.id);
    const historial = await recordLotes.findById({ _id: id });

    lotes.inventarioActual.inventario += Number(canastillas);

    historial.canastillas -= Number(canastillas);

    lotes.directoNacional -= Number(canastillas) * lotes.promedio;
    lotes._operationType = "ModificarDirectoNacional";
    lotes._canastillasProcesadas = Number(canastillas);

    lotes.deshidratacion = deshidratacion(lotes);

    await historial.save();
    await lotes.save();

    return data;
  } catch (e) {
    return console.error(`${e.name}: ${e.message}`);
  }
};
const obtenerFrutaDesverdizando = async data => {
  try {
    const desverdizado = await Desverdizado.find({ desverdizando: true });
    const enfs = desverdizado.map(item => item._id);
    const lotes = await Lotes.find({ _id: enfs }, "nombrePredio");

    let datos = desverdizado.map(item => {
      const lote = lotes.find(lote => lote._id === item._id);

      return {
        enf: item._id,
        nombrePredio: lote.nombrePredio,
        canastillas: item.canastillas,
        kilos: item.kilos,
        fechaIngreso: item.fechaIngreso,
        fechaFinalizado: item.fechaFinalizar,
        cuartoDesverdizado: item.cuartoDesverdizado,
      };
    });
    data.data = datos;
    return data;
  } catch (e) {
    console.error(e.message);
  }
};
const setParametrosDesverdizado = async data => {
  const desverdizado = await Desverdizado.findById(data.data.enf);

  desverdizado.parametros.push({
    fecha: new Date(),
    temperatura: data.data.temperatura,
    etileno: data.data.etileno,
    carbono: data.data.carbono,
    humedad: data.data.humedad,
  });

  await desverdizado.save();
  return data;
};
const finalizarDesverdizado = async data => {
  try {
    const desverdizado = await Desverdizado.findById(data.data.enf);
    desverdizado.fechaFinalizar = new Date();
    await desverdizado.save();
    return data;
  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
  }
};
const procesarDesverdizado = async data => {
  try {
    const canastillas = data.data.canastillas;
    const lotes = await Lotes.findById(data.data.enf, "promedio kilosVaciados tipoFruta nombrePredio");
    const desverdizado = await Desverdizado.findById(data.data.enf);
    const kilos = canastillas * lotes.promedio;

    desverdizado.canastillasSalida = Number(canastillas);
    desverdizado.canastillas -= Number(canastillas);
    desverdizado.kilos -= kilos;
    desverdizado.fechaProcesado = new Date();

    if (desverdizado.canastillas === 0) {
      desverdizado.desverdizando = false;
    }
    lotes.kilosVaciados += kilos;
    desverdizado._canastillasProcesadas = Number(canastillas);

    await lotes.save();
    await desverdizado.save();
    data.promedio = lotes.promedio;
    data.data = {
      promedio: lotes.promedio,
      enf: data.data.enf,
      tipoFruta: lotes.tipoFruta,
      nombrePredio: lotes.nombrePredio,
      canastillas: canastillas,
    };
    return data;
  } catch (e) {
    return `${e.name}: ${e.message}`;
  }
};
const ingresarDescarteLavado = async data => {
  try {
    const lote = await Lotes.findById(data.data.enf);
    if (!lote.inventarioActual.descarteLavado) {
      lote.inventarioActual.descarteLavado = {};
      lote.inventarioActual.descarteLavado.balin = 0;
      lote.inventarioActual.descarteLavado.pareja = 0;
      lote.inventarioActual.descarteLavado.descarteGeneral = 0;
    }

    lote.descarteLavado.descarteGeneral += data.data.descarteGeneral;
    lote.descarteLavado.pareja += data.data.pareja;
    lote.descarteLavado.balin += data.data.balin;
    lote.descarteLavado.descompuesta += data.data.descompuesta;
    lote.descarteLavado.piel += data.data.piel;
    lote.descarteLavado.hojas += data.data.hojas;

    lote.inventarioActual.descarteLavado.balin += data.data.balin;
    lote.inventarioActual.descarteLavado.pareja += data.data.pareja;
    lote.inventarioActual.descarteLavado.descarteGeneral += data.data.descarteGeneral;

    lote.rendimiento = rendimiento(lote);
    lote.deshidratacion = deshidratacion(lote);

    await lote.save();
    return { data: lote.inventarioActual };
  } catch (e) {
    console.error(e);
  }
};
const ingresarDescarteEncerado = async data => {
  try {
    const lote = await Lotes.findById(data.data.enf);
    if (!lote.inventarioActual.descarteEncerado) {
      lote.inventarioActual.descarteEncerado = {};
      lote.inventarioActual.descarteEncerado.balin = 0;
      lote.inventarioActual.descarteEncerado.pareja = 0;
      lote.inventarioActual.descarteEncerado.descarteGeneral = 0;
      lote.inventarioActual.descarteEncerado.extra = 0;
    }

    lote.descarteEncerado.descarteGeneral += data.data.descarteGeneral;
    lote.descarteEncerado.pareja += data.data.pareja;
    lote.descarteEncerado.balin += data.data.balin;
    lote.descarteEncerado.descompuesta += data.data.descompuesta;
    lote.descarteEncerado.extra += data.data.extra;
    lote.descarteEncerado.suelo += data.data.suelo;
    lote.frutaNacional += data.data.frutaNacional;

    lote.inventarioActual.descarteEncerado.balin += data.data.balin;
    lote.inventarioActual.descarteEncerado.pareja += data.data.pareja;
    lote.inventarioActual.descarteEncerado.descarteGeneral += data.data.descarteGeneral;
    lote.inventarioActual.descarteEncerado.extra += data.data.extra;

    lote.rendimiento = rendimiento(lote);
    lote.deshidratacion = deshidratacion(lote);

    await lote.save();
    return { data: lote.inventarioActual };
  } catch (e) {
    console.error(e);
  }
};
const obtenerDescarte = async data => {
  try {
    const lotes = await Lotes.find(
      {
        $or: [
          { "inventarioActual.descarteLavado.descarteGeneral": { $gt: 0 } },
          { "inventarioActual.descarteLavado.pareja": { $gt: 0 } },
          { "inventarioActual.descarteLavado.balin": { $gt: 0 } },
          { "inventarioActual.descarteEncerado.descarteGeneral": { $gt: 0 } },
          { "inventarioActual.descarteEncerado.pareja": { $gt: 0 } },
          { "inventarioActual.descarteEncerado.balin": { $gt: 0 } },
          { "inventarioActual.descarteEncerado.extra": { $gt: 0 } },
        ],
      },
      "inventarioActual.descarteLavado inventarioActual.descarteEncerado nombrePredio tipoFruta",
    );

    const datos = lotes.map(item => {
      return {
        _id: item._id,
        descarteEncerado: item.inventarioActual.descarteEncerado,
        descarteLavado: item.inventarioActual.descarteLavado,
        nombre: item.nombrePredio,
        tipoFruta: item.tipoFruta,
      };
    });
    data.data = datos;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const reprocesarDescarteUnPredio = async data => {
  try {
    let historialDescarteObj = {};
    const enfs = Object.keys(data.data.data).map(item => item.split("/")[0]);
    const enfDescarteSet = new Set(enfs);
    const enfDescarte = [...enfDescarteSet];
    let kilos = 0;

    historialDescarteObj[enfDescarte] = {
      descarteLavado: {},
      descarteEncerado: {},
    };

    const lote = await Lotes.findById(
      enfDescarte,
      "descarteLavado descarteEncerado inventarioActual promedio nombrePredio tipoFruta",
    );

    Object.keys(data.data.data).forEach(item => {
      let [, descarte, tipoDescarte] = item.split("/");

      historialDescarteObj[enfDescarte][descarte][tipoDescarte] = data.data.data[item];
      kilos += data.data.data[item];

      lote[descarte][tipoDescarte] = 0;
      lote.inventarioActual[descarte][tipoDescarte] = 0;
    });

    historialDescarteObj["fecha"] = new Date();
    historialDescarteObj["accion"] = "Reproceso de un Predio";

    const nuevoHistorialDescarte = new historialDescarte({
      fecha: historialDescarteObj.fecha,
      accion: historialDescarteObj.accion,
      predios: {},
    });

    enfDescarte.forEach(enf => {
      nuevoHistorialDescarte.predios.set(enf, historialDescarteObj[enf]);
    });

    await nuevoHistorialDescarte.save();
    lote._operationType = "Reproceso de predio";
    await lote.save();

    data.data.data = { data: kilos, enf: enfDescarte[0], tipoFruta: lote.tipoFruta, nombrePredio: lote.nombrePredio };

    return data;
  } catch (e) {
    console.error(e);
  }
};
const ReprocesarDescarteCelifrut = async data => {
  try {
    const ids = await obtenerIDs();

    let historialDescarteObj = {};
    const enfs = Object.keys(data.data.data).map(item => item.split("/")[0]);
    const enfDescarteSet = new Set(enfs);
    const enfDescarte = [...enfDescarteSet];
    let fruta;

    const lotes = await Lotes.find(
      { _id: { $in: enfDescarte } },
      "tipoFruta nombrePredio descarteLavado descarteEncerado inventarioActual tipoFruta",
    );

    // //se crean los objetos que tendran los datos del historiald e vaciado
    Object.keys(data.data.data).forEach(item => {
      let [enf, ,] = item.split("/");
      let obj = lotes.find(objeto => objeto._id === enf);
      fruta = obj.tipoFruta;
      historialDescarteObj[enf] = {
        descarteLavado: {},
        descarteEncerado: {},
      };
    });
    let sum = 0;

    // // se elimina la fruta del inventario y se mete en el historial
    Object.keys(data.data.data).forEach(item => {
      let [enf, descarte, tipoDescarte] = item.split("/");

      const index = lotes.findIndex(item => item._id === enf);
      lotes[index].inventarioActual[descarte][tipoDescarte] -= data.data.data[item];
      historialDescarteObj[enf][descarte][tipoDescarte] = data.data.data[item];
      sum += data.data.data[item];
    });

    historialDescarteObj["fecha"] = new Date();
    historialDescarteObj["accion"] = "Reproceso varios predios";

    //se crea en el inventario el item correspondiente a celifrut
    const celifrutLote = new Lotes({
      _id: "Celifrut-" + ids.idCelifrut,
      fechaIngreso: new Date(),
      kilos: sum,
      nombrePredio: "Celifrut",
      tipoFruta: fruta,
      descarteEncerado: {},
      descarteLavado: {},
      inventarioActual: {
        inventario: 0,
        descarteLavado: { balin: 0, pareja: 0, descarteGeneral: 0 },
        descarteEncerado: { balin: 0, pareja: 0, extra: 0, descarteEncerado: 0 },
      },
    });

    const nuevoHistorialDescarte = new historialDescarte({
      fecha: historialDescarteObj.fecha,
      accion: historialDescarteObj.accion,
      predios: {},
    });

    Object.keys(historialDescarteObj).map(enf => {
      if (enf !== "accion" && enf !== "accion") nuevoHistorialDescarte.predios.set(enf, historialDescarteObj[enf]);
    });

    await nuevoHistorialDescarte.save();

    celifrutLote.historialDescarte = nuevoHistorialDescarte._id;

    celifrutLote._operationType = "Reproceso Celifrut";
    await celifrutLote.save();

    data.data = { data: sum, enf: "Celifrut-" + ids.idCelifrut, tipoFruta: fruta, nombrePredio: "Celifrut" };

    ids.idCelifrut += 1;
    await guardarIDs(ids);
    return data;
  } catch (e) {
    console.error(e);
  }
};
const eliminarFrutaDescarte = async data => {
  try {
    let historialDescarteObj = {};
    const enfs = Object.keys(data.data.data[0]).map(item => item.split("/")[0]);
    const enfDescarteSet = new Set(enfs);
    const enfDescarte = [...enfDescarteSet];

    const lotes = await Lotes.find(
      { _id: { $in: enfDescarte } },
      "tipoFruta nombrePredio descarteLavado descarteEncerado inventarioActual tipoFruta",
    );
    Object.keys(data.data.data[0]).map(item => {
      let [enf, ,] = item.split("/");
      historialDescarteObj[enf] = {};
      historialDescarteObj[enf]["descarteLavado"] = {};
      historialDescarteObj[enf]["descarteEncerado"] = {};
      historialDescarteObj[enf]["cliente"] = {};
    });

    Object.keys(data.data.data[0]).map(async item => {
      let [enf, descarte, tipoDescarte] = item.split("/");
      const index = lotes.findIndex(item => item._id === enf);

      lotes[index].inventarioActual[descarte][tipoDescarte] -= data.data.data[0][item];
      historialDescarteObj[enf]["cliente"] = data.data.data[1];
      historialDescarteObj[enf][descarte][tipoDescarte] = data.data.data[0][item];
    });

    for (const lote of lotes) {
      await lote.save();
    }

    historialDescarteObj["fecha"] = new Date();
    historialDescarteObj["accion"] = "Salida de fruta";

    const nuevoHistorialDescarte = new historialDescarte({
      fecha: historialDescarteObj.fecha,
      accion: historialDescarteObj.accion,
      predios: {},
    });

    Object.keys(historialDescarteObj).map(enf => {
      if (enf !== "accion" && enf !== "accion") nuevoHistorialDescarte.predios.set(enf, historialDescarteObj[enf]);
    });

    await nuevoHistorialDescarte.save();
    //}
    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerHistorialDescarte = async data => {
  try {
    const descarte = await historialDescarte.find().sort({ fecha: -1 }).limit(200);
    let obj = {};
    let datos = [];
    let ids = [];

    for (let item of descarte) {
      const predios = Array.from(item.predios.keys());
      ids.push(predios[0]);
    }
    const lotes = await Lotes.find({ _id: ids }, "tipoFruta");

    for (let i = 0; i < ids.length; i++) {
      let objetoNormal = descarte[i].toObject();
      objetoNormal.predios = Object.fromEntries(objetoNormal.predios);
      const fruta = lotes.find(lote => ids[i] === lote._id);
      obj = objetoNormal;
      obj = { ...obj, tipoFruta: fruta.tipoFruta };
      datos.push(obj);
    }
    data.data = datos;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerClientes = async data => {
  try {
    const clientes = await Clientes.find().select("CLIENTE");
    data.data = clientes;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const crearContenedor = async data => {
  try {
    let subDocumentos = new Map();
    for (let i = 1; i <= data.data.data.pallets; i++) {
      let subDocumento = {
        EF1: [],
        cajasTotal: 0,
        listaLiberarPallet: {
          rotulado: false,
          paletizado: false,
          enzunchado: false,
          estadoCajas: false,
          estiba: false,
        },
        settings: {
          tipoCaja: "",
          calidad: 0,
          calibre: 0,
        },
      };

      subDocumentos.set(String(i), subDocumento);
    }
    const id = new mongoose.Types.ObjectId(data.data.data.cliente);

    const cliente = await Clientes.findById({ _id: id }).select("CLIENTE");

    const contenedor = new Contenedores({
      _id: data.data.data.numeroContenedor,
      infoContenedor: {
        nombreCliente: cliente.CLIENTE,
        tipoEmpaque: data.data.data.tipoEmpaque,
        tipoFruta: data.data.data.tipoFruta,
        fechaCreacion: new Date(),
        desverdizado: data.data.data.desverdizado,
        observaciones: data.data.data.observaciones,
        cerrado: false,
        pesoCaja: {
          "G-37": 16.1,
          "B-37": 16.1,
          "G-4_5": 4.5,
          "G-30": 13.5,
          "B-30": 13.5,
          "B-40": 18,
          "G-40": 18,
          Rojo: 40,
          verde: 40,
          granel: 40,
        },
      },
      pallets: subDocumentos,
    });

    await contenedor.save();
    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerDataContenedor = async data => {
  try {
    const contenedores = await Contenedores.find({ "infoContenedor.cerrado": false }).select("pallets infoContenedor _id __v");
    data.data = contenedores;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const guardarSettingsPallet = async data => {
  try {
    const contenedor = await Contenedores.findById(data.data.data.contenedor);

    contenedor.pallets.get(String(data.data.data.pallet)).settings.calibre = data.data.data.settings.calibre;
    contenedor.pallets.get(String(data.data.data.pallet)).settings.tipoCaja = data.data.data.settings.tipoCaja;
    contenedor.pallets.get(String(data.data.data.pallet)).settings.calidad = data.data.data.settings.calidad;

    await contenedor.save();

    const newData = await obtenerDataContenedor(data);
    return newData;
  } catch (e) {
    console.error(e);
  }
};
const guardarItem = async data => {
  try {
    const lote = await Lotes.findById(data.data.item.id);
    const proveedor = await Proveedores.findOne({ PREDIO: data.data.item.nombre });
    const contenedor = await Contenedores.findById(data.data.contenedor);
    const cliente = await Clientes.findOne({ CLIENTE: contenedor.infoContenedor.nombreCliente });
    let numeroContenedor = data.data.contenedor;
    const obj = {
      calidad1: 0,
      calidad1_5: 0,
      calidad2: 0,
    };

    if (data.data.pallet === 0) {
      numeroContenedor = 0;
      const cajasSinPallet = await obtenerCajasSinPallet();

      cajasSinPallet.data.push(data.data.item);
      if (lote.exportacion) {
        if (!lote.exportacion.get(String(numeroContenedor))) {
          lote.exportacion.set(String(numeroContenedor), obj);
        }
      }

      await guardarCajasSinpallet(cajasSinPallet.data);
    } else {
      contenedor.pallets.get(String(data.data.pallet)).EF1.push(data.data.item);
      contenedor.pallets.get(String(data.data.pallet)).cajasTotal += data.data.item.cajas;

      await contenedor.save();
    }

    if (!lote.exportacion) {
      lote.exportacion = new Map();
      lote.exportacion.set(String(numeroContenedor), obj);
    }

    if (!lote.exportacion.get(String(numeroContenedor))) {
      lote.exportacion.set(String(numeroContenedor), obj);
    }
    const tipoCaja = data.data.item.tipoCaja.replace(".", "_");

    if (data.data.item.calidad === 1) {
      lote.exportacion.get(String(numeroContenedor)).calidad1 +=
        data.data.item.cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
    } else if (data.data.item.calidad === 1.5) {
      lote.exportacion.get(String(numeroContenedor)).calidad1_5 +=
        data.data.item.cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
    } else if (data.data.item.calidad === 2) {
      lote.exportacion.get(String(numeroContenedor)).calidad2 += data.data.item.cajas * 40;
    }

    lote.rendimiento = rendimiento(lote);
    lote.deshidratacion = deshidratacion(lote);

    lote.markModified("exportacion");
    await lote.save();
    return {
      proveedor: { code: proveedor["CODIGO INTERNO"], ICA: proveedor.ICA, GGN: proveedor.GGN },
      cliente: {
        code: cliente.CODIGO,
        destino: cliente["PAIS_DESTINO"],
        cliente: cliente.CLIENTE,
        clienteID: cliente.ID,
        telefono: cliente.TELEFONO,
        correo: cliente.CORREO,
      },
      tipoFruta: lote.tipoFruta,
    };
  } catch (e) {
    console.error(e);
  }
};
const eliminarItem = async data => {
  try {
    const contenedor = await Contenedores.findById(data.data.contenedor);
    let tipoCajaS;
    let calidad;
    let ef1;
    let cajas;
    let numeroContenedor = data.data.contenedor;

    if (data.data.pallet === 0) {
      numeroContenedor = 0;
      const cajasSinPallet = await obtenerCajasSinPallet();

      cajas = cajasSinPallet.data[Number(data.data.item)].cajas;
      tipoCajaS = cajasSinPallet.data[Number(data.data.item)].tipoCaja;
      calidad = cajasSinPallet.data[Number(data.data.item)].calidad;
      ef1 = cajasSinPallet.data[Number(data.data.item)].id;

      cajasSinPallet.data.splice(Number(data.data.item), 1);

      await guardarCajasSinpallet(cajasSinPallet.data);
    } else {
      const id = new mongoose.Types.ObjectId(data.data.item);
      cajas = contenedor.pallets.get(String(data.data.pallet)).EF1.find(item => item._id.equals(id)).cajas;
      contenedor.pallets.get(String(data.data.pallet)).cajasTotal -= cajas;
      ef1 = contenedor.pallets.get(String(data.data.pallet)).EF1.find(item => item._id.equals(id)).id;
      const index = contenedor.pallets.get(String(data.data.pallet)).EF1.findIndex(item => item._id.equals(id));
      contenedor.pallets.get(String(data.data.pallet)).EF1.splice(index, 1);
      tipoCajaS = contenedor.pallets.get(String(data.data.pallet)).settings.tipoCaja;
      calidad = contenedor.pallets.get(String(data.data.pallet)).settings.calidad;
    }
    const lote = await Lotes.findById(ef1);

    const tipoCaja = tipoCajaS.replace(".", "_");

    if (calidad === 1) {
      lote.exportacion.get(String(numeroContenedor)).calidad1 -= cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
    } else if (calidad === 1.5) {
      lote.exportacion.get(String(numeroContenedor)).calidad1_5 -= cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
    } else if (calidad === 2) {
      lote.exportacion.get(String(numeroContenedor)).calidad2 -= cajas * 40;
    }

    lote.rendimiento = rendimiento(lote);
    lote.deshidratacion = deshidratacion(lote);

    lote.markModified("exportacion");
    await lote.save();
    await contenedor.save();
    return { status: 200 };
  } catch (e) {
    console.error(e);
  }
};
const moverItem = async data => {
  try {
    const cajasSinPallet = await obtenerCajasSinPallet();
    const contenedor = await Contenedores.findById(data.data.contenedor);
    let item;
    let index;

    if (data.data.pallet === 0) {
      index = data.data.item.id;
      item = cajasSinPallet.data[index];
    } else {
      const id = new mongoose.Types.ObjectId(data.data.item);
      item = contenedor.pallets.get(String(data.data.pallet)).EF1.find(item => item._id.equals(id));
      index = contenedor.pallets.get(String(data.data.pallet)).EF1.findIndex(item => item._id.equals(id));
    }

    let lote = await Lotes.findById(item.id);

    const obj = {
      calidad1: 0,
      calidad1_5: 0,
      calidad2: 0,
    };

    //se crea el nuevo item
    const nuevoItem = {
      id: item.id,
      nombre: item.nombre,
      cajas: Number(data.data.item.cajasMover),
      tipoCaja: item.tipoCaja,
      calibre: item.calibre,
      calidad: item.calidad,
      fecha: item.fecha,
    };

    if (data.data.item.nuevoPallet === "0" && data.data.pallet !== "0") {
      //se crea el contendor en caso de que no exista en el lote
      if (!lote.exportacion) {
        lote.exportacion = new Map();
        lote.exportacion.set(String(0), obj);
      }

      if (!lote.exportacion.get(String(0))) {
        lote.exportacion.set(String(0), obj);
      }

      if (item.calidad === 1) {
        lote.exportacion.get(String(0)).calidad1 += nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      } else if (item.calidad === 1.5) {
        lote.exportacion.get(String(0)).calidad1_5 += nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      } else if (item.calidad === 2) {
        lote.exportacion.get(String(0)).calidad2 += nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      }

      if (item.calidad === 1) {
        lote.exportacion.get(String(data.data.contenedor)).calidad1 -=
          nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      } else if (item.calidad === 1.5) {
        lote.exportacion.get(String(data.data.contenedor)).calidad1_5 -=
          nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      } else if (item.calidad === 2) {
        lote.exportacion.get(String(data.data.contenedor)).calidad2 -=
          nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      }

      cajasSinPallet.data.push(nuevoItem);
    } else if (data.data.pallet === 0 && data.data.item.nuevoPallet !== "0") {
      //se crea el contendor en caso de que no exista en el lote
      if (!lote.exportacion) {
        lote.exportacion = new Map();
        lote.exportacion.set(String(data.data.contenedor), obj);
      }

      if (!lote.exportacion.get(String(data.data.contenedor))) {
        lote.exportacion.set(String(data.data.contenedor), obj);
      }

      if (item.calidad === 1) {
        lote.exportacion.get(String(0)).calidad1 -= nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      } else if (item.calidad === 1.5) {
        lote.exportacion.get(String(0)).calidad1_5 -= nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      } else if (item.calidad === 2) {
        lote.exportacion.get(String(0)).calidad2 -= nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      }

      if (item.calidad === 1) {
        lote.exportacion.get(String(data.data.contenedor)).calidad1 +=
          nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      } else if (item.calidad === 1.5) {
        lote.exportacion.get(String(data.data.contenedor)).calidad1_5 +=
          nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      } else if (item.calidad === 2) {
        lote.exportacion.get(String(data.data.contenedor)).calidad2 +=
          nuevoItem.cajas * pesoTipoCaja(nuevoItem.tipoCaja);
      }

      contenedor.pallets.get(data.data.item.nuevoPallet).EF1.push(nuevoItem);
      contenedor.pallets.get(data.data.item.nuevoPallet).cajasTotal += Number(data.data.item.cajasMover);
    } else {
      contenedor.pallets.get(data.data.item.nuevoPallet).EF1.push(nuevoItem);
      contenedor.pallets.get(data.data.item.nuevoPallet).cajasTotal += Number(data.data.item.cajasMover);
    }

    const cajasTotal = item.cajas - Number(data.data.item.cajasMover);

    //se modifica el viejo
    if (data.data.pallet === 0) {
      cajasSinPallet.data[index].cajas -= Number(data.data.item.cajasMover);
    } else {
      contenedor.pallets.get(String(data.data.pallet)).cajasTotal -= Number(data.data.item.cajasMover);
      contenedor.pallets.get(String(data.data.pallet)).EF1[index].cajas -= Number(data.data.item.cajasMover);
    }

    //si se mueven todas las cajas
    if (cajasTotal === 0) {
      if (data.data.pallet === 0) {
        cajasSinPallet.data.splice(index, 1);
      } else {
        if (index > -1) {
          contenedor.pallets.get(String(data.data.pallet)).EF1.splice(index, 1);
        }
      }
    }
    await contenedor.save();
    lote.markModified("exportacion");
    await lote.save();
    await guardarCajasSinpallet(cajasSinPallet.data);

    return 200;
  } catch (e) {
    console.error(e);
  }
};
const restarItem = async data => {
  try {
    const contenedor = await Contenedores.findById(data.data.contenedor);
    let tipoCajaS;
    let calidad;
    let ef1;
    if (data.data.pallet === 0) {
      const cajasSinPallet = await obtenerCajasSinPallet();
      cajasSinPallet.data[data.data.item.seleccion].cajas -= Number(data.data.item.cajas);
      tipoCajaS = cajasSinPallet.data[data.data.item.seleccion].tipoCaja;
      calidad = cajasSinPallet.data[data.data.item.seleccion].calidad;
      ef1 = cajasSinPallet.data[data.data.item.seleccion].id;
      if (cajasSinPallet.data[data.data.item.seleccion].cajas === 0) {
        cajasSinPallet.data.splice(data.data.item.seleccion, 1);
      }
      await guardarCajasSinpallet(cajasSinPallet.data);
    } else {
      const id = new mongoose.Types.ObjectId(data.data.item.seleccion);
      contenedor.pallets.get(String(data.data.pallet)).cajasTotal -= data.data.item.cajas;
      contenedor.pallets.get(String(data.data.pallet)).EF1.find(item => item._id.equals(id)).cajas -=
        data.data.item.cajas;
      tipoCajaS = contenedor.pallets.get(String(data.data.pallet)).settings.tipoCaja;
      calidad = contenedor.pallets.get(String(data.data.pallet)).settings.calidad;
      ef1 = contenedor.pallets.get(String(data.data.pallet)).EF1.find(item => item._id.equals(id)).id;
      if (contenedor.pallets.get(String(data.data.pallet)).EF1.find(item => item._id.equals(id)).cajas === 0) {
        const index = contenedor.pallets.get(String(data.data.pallet)).EF1.findIndex(item => item._id.equals(id));
        contenedor.pallets.get(String(data.data.pallet)).EF1.splice(index, 1);
      }

      await contenedor.save();
    }

    const lote = await Lotes.findById(ef1);

    const tipoCaja = tipoCajaS.replace(".", "_");

    if (data.data.pallet === 0) {
      if (calidad === 1) {
        lote.exportacion.get(String(0)).calidad1 -= data.data.item.cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
      } else if (calidad === 1.5) {
        lote.exportacion.get(String(0)).calidad1_5 -=
          data.data.item.cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
      } else if (calidad === 2) {
        lote.exportacion.get(String(0)).calidad2 -= data.data.item.cajas * 40;
      }
    } else {
      if (calidad === 1) {
        lote.exportacion.get(String(data.data.contenedor)).calidad1 -=
          data.data.item.cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
      } else if (calidad === 1.5) {
        lote.exportacion.get(String(data.data.contenedor)).calidad1_5 -=
          data.data.item.cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
      } else if (calidad === 2) {
        lote.exportacion.get(String(data.data.contenedor)).calidad2 -= data.data.item.cajas * 40;
      }
    }

    lote.rendimiento = rendimiento(lote);
    lote.deshidratacion = deshidratacion(lote);

    lote.markModified("exportacion");
    await lote.save();
    await contenedor.save();
  } catch (e) {
    console.error(e);
  }
};
const liberacionPallet = async data => {
  try {
    const contenedor = await Contenedores.findById(data.data.contenedor);

    contenedor.pallets.get(String(data.data.pallet)).listaLiberarPallet.rotulado = data.data.item.rotulado;

    contenedor.pallets.get(String(data.data.pallet)).listaLiberarPallet.paletizado = data.data.item.paletizado;
    contenedor.pallets.get(String(data.data.pallet)).listaLiberarPallet.enzunchado = data.data.item.enzunchado;
    contenedor.pallets.get(String(data.data.pallet)).listaLiberarPallet.estadoCajas = data.data.item.estadoCajas;
    contenedor.pallets.get(String(data.data.pallet)).listaLiberarPallet.estiba = data.data.item.estiba;

    await contenedor.save();
  } catch (e) {
    console.error(e);
  }
};
const cerrarContenedor = async data => {
  try {
    const contenedor = await Contenedores.findById(data.contenedor);
    contenedor.infoContenedor.cerrado = true;
    contenedor.infoContenedor.fechaFinalizado = new Date();

    await contenedor.save();
  } catch (e) {
    console.error(e);
  }
};
const obtenerRendimiento = async data => {
  try {
    const lotes = await Lotes.find({ _id: data.data.data }, "rendimiento _id");
    data.data = lotes;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerLotesCalidadInterna = async data => {
  try {
    let objReturn = [];
    const lotes = await Lotes.find({ "calidad.calidadInterna": { $exists: false } });

    lotes.forEach(lote => {
      if (lote._id[0] !== "C") {
        objReturn.push({
          id: lote._id,
          nombre: lote.nombrePredio,
          tipoFruta: lote.tipoFruta,
        });
      }
    });
    data.data = objReturn;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const guardarCalidadInterna = async data => {
  try {
    const lotes = await Lotes.findById(data.data.data.lote, "calidad.calidadInterna");

    if (!lotes) {
      throw new Error("No se encontró ningún lote con el ID proporcionado");
    }

    if (!lotes.calidad) {
      lotes.calidad = {};
    }

    if (!lotes.calidad.calidadInterna) {
      lotes.calidad.calidadInterna = {};
    }

    lotes.calidad.calidadInterna.acidez = Number(data.data.data.acidez);
    lotes.calidad.calidadInterna.brix = Number(data.data.data.brix);
    lotes.calidad.calidadInterna.ratio = Number(data.data.data.ratio);
    lotes.calidad.calidadInterna.peso = Number(data.data.data.peso / 10);
    lotes.calidad.calidadInterna.zumo = Number(data.data.data.zumo);

    await lotes.save();

    return { ...data, status: 200 };
  } catch (e) {
    console.error(e);
  }
};
const obtenerLotesClasificacionCalidad = async data => {
  try {
    let objReturn = [];
    const lotes = await Lotes.find({ "calidad.clasificacionCalidad": { $exists: false } });

    lotes.forEach(lote => {
      if (lote._id[0] !== "C") {
        objReturn.push({
          id: lote._id,
          nombre: lote.nombrePredio,
          tipoFruta: lote.tipoFruta,
        });
      }
    });
    data.data = objReturn;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const guardarClasificacionCalidad = async data => {
  try {
    const lotes = await Lotes.findById(data.data.data.lote, "calidad.clasificacionCalidad");

    if (!lotes) {
      throw new Error("No se encontró ningún lote con el ID proporcionado");
    }

    if (!lotes.calidad) {
      lotes.calidad = {};
    }

    if (!lotes.calidad.clasificacionCalidad) {
      lotes.calidad.clasificacionCalidad = {};
    }
    Object.keys(data.data.data).forEach(item => {
      if (item !== "lote") {
        lotes.calidad.clasificacionCalidad[item] = data.data.data[item] / 100;
      }
    });

    await lotes.save();
    return { ...data, status: 200 };
  } catch (e) {
    console.error(e);
  }
};
const obtenerLotesFotosCalidad = async data => {
  try {
    let objReturn = [];
    const lotes = await Lotes.find({ "calidad.fotosCalidad": { $exists: false } });

    lotes.forEach(lote => {
      if (lote._id[0] !== "C") {
        objReturn.push({
          id: lote._id,
          nombre: lote.nombrePredio,
          tipoFruta: lote.tipoFruta,
        });
      }
    });

    data.data = objReturn;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const guardarFotosCalidad = async data => {
  try {
    const loteInfo = data.data.data;
    const fotosPath = "G:/Mi unidad/fotos_frutas/";
    const base64Data = loteInfo.foto.replace(/^data:image\/\w+;base64,/, "");
    const fotoPath = fotosPath + loteInfo.enf + "_" + loteInfo.fotoName + ".png";
    const lote = await Lotes.findById(loteInfo.enf);
    fs.writeFileSync(fotoPath, base64Data, { encoding: "base64" }, err => {
      if (err) {
        console.error(err);
      } else {
        console.error("guardado exitoso");
      }
    });

    if (!lote) {
      throw new Error("No se encontró ningún lote con el ID proporcionado");
    }
    if (!lote.calidad) {
      lote.calidad = {};
    }
    if (!lote.calidad.fotosCalidad) {
      lote.calidad.fotosCalidad = new Map();
    }

    lote.calidad.fotosCalidad.set(loteInfo.fotoName, fotoPath);
    lote.markModified("calidad.fotosCalidad");

    await lote.save();
    return { ...data, status: 200 };
  } catch (e) {
    console.error(e);
  }
};
const obtenerInfoRotulosCajas = async data => {
  try {
    const datos = {};
    datos.cliente = await Clientes.findOne({ CLIENTE: data.data.data.cliente });
    const proveedor = await Proveedores.findOne({ PREDIO: data.data.data.nombrePredio });
    datos.proveedor = { "CODIGO INTERNO": proveedor["CODIGO INTERNO"], ICA: proveedor.ICA, GGN: proveedor.GGN };
    datos.lote = await Lotes.findOne({ _id: data.data.data.enf }, "tipoFruta");
    return datos;
  } catch (e) {
    console.error(e);
  }
};
const obtenerInformesCalidad = async data => {
  try {
    const lotes = await Lotes.find({ informeEnviado: true }, "_id nombrePredio tipoFruta urlInformeCalidad");
    data.data = lotes;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerDatosLotes = async data => {
  try {
    const filtro = data.data.data.filtros;
    let consulta = {};
    let cantidad = 50;

    if (filtro.tipoFruta !== "") {
      consulta.tipoFruta = filtro.tipoFruta;
    }
    if (filtro.fechaIngreso.$gte !== null) {
      consulta.fechaIngreso = {};
      consulta.fechaIngreso.$gte = filtro.fechaIngreso.$gte;
      consulta.fechaIngreso.$lt = new Date();
    }
    if (filtro.fechaIngreso.$lt !== null) {
      consulta.fechaIngreso.$lt = filtro.fechaIngreso.$lt;
    }
    if (filtro.rendimiento.$gte !== "") {
      consulta.rendimiento = {};
      consulta.rendimiento.$gte = Number(filtro.rendimiento.$gte);
      consulta.rendimiento.$lt = 100;
    }
    if (filtro.rendimiento.$lt !== "") {
      consulta.rendimiento.$lt = Number(filtro.rendimiento.$lt);
    }
    if (filtro.nombrePredio !== "") {
      consulta.nombrePredio = filtro.nombrePredio;
    }
    if (filtro.cantidad !== "") {
      cantidad = Number(filtro.cantidad);
    }
    const lotes = await Lotes.find(consulta).sort({ fecha: -1 }).limit(cantidad);
    data.data = lotes;
    return data;
  } catch (e) {
    console.log(`${e.name}: ${e.message}`);
  }
};
const enviarDatosFormularioInspeccionMulas = async data =>{
  try{
    const info = data.data.data;
    const contenedor = await Contenedores.findById(Number(info.numContenedor));
    contenedor.formularioInspeccionMula = {};
    contenedor.formularioInspeccionMula.placa = info.placa;
    contenedor.formularioInspeccionMula.conductor = info.conductor;
    contenedor.formularioInspeccionMula.empresaTransporte = info.conductor;
    contenedor.formularioInspeccionMula.cumpleRequisitos = info.cumpleRequisitos === "Si" ? true: false;


    if (!contenedor.formularioInspeccionMula.criterios) {
      contenedor.formularioInspeccionMula.criterios = new Map();
    }

    info.criterios.forEach((item, index )=> {
      contenedor.formularioInspeccionMula.criterios.set(String(index), {
        nombre: item.nombre,
        cumplimiento: item.cumplimiento === "C" ? true : false,
        observaciones: item.observaciones
      });
    });

    contenedor.markModified("formularioInspeccionMula.criterios");
    await contenedor.save();
    const contenedores = await obtenerDataContenedorFormularioInspeccionMulas(data);
    return contenedores;
  } catch(e) {
    console.error(e);
  }
};
const obtenerDataContenedorFormularioInspeccionMulas = async data => {
  try {
    const contenedores = await Contenedores.find({ formularioInspeccionMula: { $exists: false } }, "infoContenedor");
    data.data = contenedores;

    return data;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  obtenerProveedores,
  agregarProveedor,
  modificarProveedor,
  eliminarProveedor,
  guardarLote,
  obtenerFrutaActual,
  vaciarLote,
  obtenerHistorialProceso,
  directoNacional,
  obtenerHistorialDirectoNacional,
  desverdizado,
  modificarHistorialVaciado,
  modificarHistorialDirectoNacional,
  obtenerFrutaDesverdizando,
  setParametrosDesverdizado,
  finalizarDesverdizado,
  procesarDesverdizado,
  ingresarDescarteLavado,
  ingresarDescarteEncerado,
  obtenerDescarte,
  reprocesarDescarteUnPredio,
  ReprocesarDescarteCelifrut,
  eliminarFrutaDescarte,
  obtenerHistorialDescarte,
  obtenerClientes,
  crearContenedor,
  obtenerDataContenedor,
  guardarSettingsPallet,
  guardarItem,
  eliminarItem,
  moverItem,
  restarItem,
  liberacionPallet,
  cerrarContenedor,
  obtenerLotesCalidadInterna,
  guardarCalidadInterna,
  obtenerLotesClasificacionCalidad,
  guardarClasificacionCalidad,
  obtenerLotesFotosCalidad,
  guardarFotosCalidad,
  obtenerRendimiento,
  obtenerInfoRotulosCajas,
  obtenerInformesCalidad,
  obtenerDatosLotes,
  enviarDatosFormularioInspeccionMulas,
  obtenerDataContenedorFormularioInspeccionMulas
};