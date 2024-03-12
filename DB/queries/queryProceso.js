const { default: mongoose, trusted } = require("mongoose");
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
const { fork } = require("child_process");
const { rendimiento, deshidratacion, saveFiles } = require("../functions/proceso");
const { recordProveedores } = require("../Schemas/proveedores/schemaRecordProveedores");
const { formularioCamiones } = require("../Schemas/formatosCarros/schemaFormatoCamionesLlegada");

const obtenerProveedores = async data => {
  try {
    const proveedores = await Proveedores.find();
    data.data = proveedores;
    return { ...data, status: 200, message: "Ok" };
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error en obtenerProveedores del servidor" };
  }
};
const agregarProveedor = async data => {
  try {
    if (data.userSession.cargo === "cordinadora de calidad" || data.userSession.cargo === "admin") {
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
        urlArchivos: paths,
      });

      let record = new recordProveedores({
        operacionRealizada: "añadir",
        nombreProveedor: proveedor.PREDIO,
        fecha: new Date(),
      });

      await record.save();
      await proveedor.save();
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error en agregarProveedor del servidor" };
  }
};
const modificarProveedor = async data => {
  try {
    if (true) {
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

      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error en modificarProveedor del servidor" };
  }
};
const eliminarProveedor = async data => {
  try {
    if (data.userSession.cargo === "cordinadora de calidad" || data.userSession.cargo === "admin") {
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

      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error en modificarProveedor del servidor" };
  }
};
const guardarLote = async data => {
  try {
    const ids = await obtenerIDs();
    // if (data.userSession.cargo === "recepcion" ) {
    if (true) {
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

      const id = new mongoose.Types.ObjectId(datos.predio);
      const predio = await Proveedores.findById(id);
      const lote = new Lotes({
        _id: enf,
        predio: predio._id,
        nombrePredio: predio.PREDIO,
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
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error en la funcion crear lote" };
  }
};
const obtenerFrutaActual = async data => {
  try {
    const lotes = await Lotes.find(
      {
        "inventarioActual.inventario": { $gt: 0 },
      },
      "nombrePredio fechaIngreso observaciones tipoFruta promedio inventarioActual.inventario",
    )
      .populate("predio", "PREDIO ICA")
      .sort({ fechaIngreso: -1 });

    const objFrutaActual = await lotes.map(lote => {
      return {
        ...lote._doc,
        KilosActual: lote.promedio * lote.inventarioActual.inventario,
      };
    });
    data.data = objFrutaActual;
    return { ...data, status: 200 };
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error obteniendo fruta sin procesar" };
  }
};
const vaciarLote = async data => {
  try {
    if (true) {
      const enf = data.data.enf;
      const canastillas = data.data.canastillas;
      const lote = await Lotes.findById(
        enf,
        "promedio rendimiento kilosVaciados tipoFruta inventarioActual.inventario",
      ).populate("predio", "PREDIO");

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
        nombrePredio: lote.predio.PREDIO,
        canastillas: canastillas,
        predioId: lote.predio._id.toString(),
      };
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error al modificar los datos en la base de datos" };
  }
};
const obtenerHistorialProceso = async data => {
  try {
    const historial = await recordLotes
      .find({ operacionRealizada: "Vaciado", "documento.predio": { $exists: true } })
      .sort({ fecha: -1 })
      .limit(50);
    const enfs = historial.map(item => item.documento._id);
    const lotes = await Lotes.find({ _id: enfs, predio: { $exists: true } }, "tipoFruta rendimiento").populate(
      "predio",
      "PREDIO",
    );

    let datos = historial.map(item => {
      const lote = lotes.find(lot => lot._id === item.documento._id);

      return {
        _id: item._id,
        enf: item.documento._id,
        nombre: lote.predio.PREDIO,
        canastillas: item.canastillas,
        kilos: Number(item.canastillas) * Number(item.documento.promedio),
        tipoFruta: lote.tipoFruta,
        fecha: item.fecha,
        rendimiento: lote.rendimiento,
      };
    });
    data.data = datos;
    return { ...data, status: 200 };
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error obteniendo fruta sin procesar" };
  }
};
const directoNacional = async data => {
  try {
    if (true) {
      const lote = await Lotes.findById(data.data.enf);
      lote.inventarioActual.inventario -= Number(data.data.canastillas);
      lote.directoNacional += data.data.canastillas * lote.promedio;

      if (!Object.prototype.hasOwnProperty.call(lote, "infoSalidaDirectoNacional")) {
        lote.infoSalidaDirectoNacional = {};
      }
      lote.infoSalidaDirectoNacional.placa = String(data.data.placa);
      lote.infoSalidaDirectoNacional.nombreConductor = data.data.nombreConductor;
      lote.infoSalidaDirectoNacional.telefono = data.data.telefono;
      lote.infoSalidaDirectoNacional.cedula = data.data.cedula;
      lote.infoSalidaDirectoNacional.remision = data.data.remision;
      lote._operationType = "Directo nacional";
      lote._canastillasProcesadas = Number(data.data.canastillas);

      lote.deshidratacion = deshidratacion(lote);

      await lote.save();

      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error al modificar los datos en la base de datos" };
  }
};
const obtenerHistorialDirectoNacional = async data => {
  try {
    const historial = await recordLotes
      .find({ operacionRealizada: "Directo nacional", "documento.predio": { $exists: true } })
      .sort({ fecha: -1 })
      .limit(200);
    const enfs = historial.map(item => item.documento._id);
    const lotes = await Lotes.find({ _id: enfs }, "tipoFruta").populate("predio", "PREDIO");

    let datos = historial.map(item => {
      const lote = lotes.find(lot => lot._id === item.documento._id);
      return {
        _id: item._id,
        enf: item.documento._id,
        nombre: lote.predio.PREDIO,
        canastillas: item.canastillas,
        kilos: Number(item.canastillas) * Number(item.documento.promedio),
        tipoFruta: lote.tipoFruta,
        fecha: item.fecha,
      };
    });
    data.data = datos;
    return { ...data, status: 200 };
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en obtenerHistorialDirectoNacional ${e.name}` };
  }
};
const desverdizado = async data => {
  try {
    if (true) {
      const canastillas = data.data.canastillas;
      const cuartoDesverdizado = data.data.cuartoDesverdizado;
      const lotes = await Lotes.findById(data.data.enf, "promedio rendimiento desverdizado inventarioActual");
      lotes.inventarioActual.inventario -= Number(canastillas);

      let desverdizando;
      desverdizando = await Desverdizado.findById(data.data.enf);
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

      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: "Error al modificar los datos en la base de datos" };
  }
};
const modificarHistorialVaciado = async data => {
  try {
    if (true) {
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

      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
    return { ...data, status: 401, message: "Error al modificar los datos en la base de datos" };
  }
};
const modificarHistorialDirectoNacional = async data => {
  try {
    if (true) {
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

      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
    return { ...data, status: 401, message: "Error al modificar los datos en la base de datos" };
  }
};
const obtenerFrutaDesverdizando = async data => {
  try {
    const desverdizado = await Desverdizado.find({ desverdizando: true });
    const enfs = desverdizado.map(item => item._id);
    const lotes = await Lotes.find({ _id: enfs }).populate("predio", "PREDIO");

    let datos = desverdizado.map(item => {
      const lote = lotes.find(lote => lote._id === item._id);

      return {
        enf: item._id,
        nombrePredio: lote.predio.PREDIO,
        canastillas: item.canastillas,
        kilos: item.kilos,
        fechaIngreso: item.fechaIngreso,
        fechaFinalizado: item.fechaFinalizar,
        cuartoDesverdizado: item.cuartoDesverdizado,
      };
    });
    data.data = datos;
    return { ...data, status: 200, message: "Ok" };
  } catch (e) {
    console.error(e.message);
    return { ...data, status: 401, message: `Error en obtenerFrutaDesverdizando: ${e.name}` };
  }
};
const setParametrosDesverdizado = async data => {
  try {
    if (true) {
      console.log(data);

      const desverdizado = await Desverdizado.findById(data.data.enf);
      desverdizado.parametros.push({
        fecha: new Date(),
        temperatura: data.data.temperatura,
        etileno: data.data.etileno,
        carbono: data.data.carbono,
        humedad: data.data.humedad,
      });

      await desverdizado.save();
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en setParametrosDesverdizado: ${e.name}` };
  }
};
const finalizarDesverdizado = async data => {
  try {
    if (true) {
      const desverdizado = await Desverdizado.findById(data.data.enf);
      desverdizado.fechaFinalizar = new Date();
      await desverdizado.save();
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
    return { ...data, status: 401, message: `Error en finalizarDesverdizado: ${e.name}` };
  }
};
const procesarDesverdizado = async data => {
  try {
    if (true) {
      const canastillas = data.data.canastillas;
      const lotes = await Lotes.findById(data.data.enf, "promedio kilosVaciados tipoFruta").populate(
        "predio",
        "PREDIO",
      );
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
        nombrePredio: lotes.predio.PREDIO,
        canastillas: canastillas,
      };
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en procesarDesverdizado: ${e.name}` };
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

    lote.rendimiento = Number(rendimiento(lote));
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
        predio: { $exists: true },
      },
      "inventarioActual.descarteLavado inventarioActual.descarteEncerado  tipoFruta",
    ).populate("predio", "PREDIO");

    const datos = lotes.map(item => {
      return {
        _id: item._id,
        descarteEncerado: item.inventarioActual.descarteEncerado,
        descarteLavado: item.inventarioActual.descarteLavado,
        nombre: item.predio.PREDIO,
        tipoFruta: item.tipoFruta,
      };
    });
    data.data = datos;
    return { ...data, status: 200, message: "Ok" };
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en obtenerDescarte: ${e.name}` };
  }
};
const reprocesarDescarteUnPredio = async data => {
  try {
    if (data.userSession.cargo === "recepcion" || data.userSession.cargo === "admin") {
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
        "descarteLavado descarteEncerado inventarioActual promedio tipoFruta",
      ).populate("predio", "PREDIO");
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

      data.data = { data: kilos, enf: enfDescarte[0], tipoFruta: lote.tipoFruta, nombrePredio: lote.predio.PREDIO };
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en reprocesarDescarteUnPredio: ${e.name}` };
  }
};
const ReprocesarDescarteCelifrut = async data => {
  try {
    if (data.userSession.cargo === "recepcion" || data.userSession.cargo === "admin") {
      const ids = await obtenerIDs();

      let historialDescarteObj = {};
      const enfs = Object.keys(data.data.data).map(item => item.split("/")[0]);
      const enfDescarteSet = new Set(enfs);
      const enfDescarte = [...enfDescarteSet];
      let fruta;

      const lotes = await Lotes.find(
        { _id: { $in: enfDescarte } },
        "tipoFruta descarteLavado descarteEncerado inventarioActual tipoFruta",
      ).populate("predio", "PREDIO");

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
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en ReprocesarDescarteCelifrut: ${e.name}` };
  }
};
const eliminarFrutaDescarte = async data => {
  try {
    if (true) {
      let historialDescarteObj = {};
      const enfs = Object.keys(data.data.data[0]).map(item => item.split("/")[0]);
      const enfDescarteSet = new Set(enfs);
      const enfDescarte = [...enfDescarteSet];

      const lotes = await Lotes.find(
        { _id: { $in: enfDescarte } },
        "tipoFruta descarteLavado descarteEncerado inventarioActual tipoFruta",
      ).populate("predio", "PREDIO");
      Object.keys(data.data.data[0]).map(item => {
        let [enf, ,] = item.split("/");
        historialDescarteObj[enf] = {};
        historialDescarteObj[enf]["descarteLavado"] = {};
        historialDescarteObj[enf]["descarteEncerado"] = {};
      });

      Object.keys(data.data.data[0]).map(async item => {
        let [enf, descarte, tipoDescarte] = item.split("/");
        const index = lotes.findIndex(item => item._id === enf);

        lotes[index].inventarioActual[descarte][tipoDescarte] -= data.data.data[0][item];
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
        cliente: data.data.cliente,
        placa: data.data.placa,
        nombreConductor: data.data.nombreConductor,
        telefono: data.data.telefono,
        cedula: data.data.cedula,
        remision: data.data.remision,
        predios: {},
      });

      Object.keys(historialDescarteObj).map(enf => {
        if (enf !== "accion" && enf !== "accion") nuevoHistorialDescarte.predios.set(enf, historialDescarteObj[enf]);
      });

      await nuevoHistorialDescarte.save();
      //}
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en eliminarFrutaDescarte: ${e.name}` };
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
    const lotes = await Lotes.find({ _id: ids, predio: { $exists: true } }, "tipoFruta");

    for (let i = 0; i < ids.length; i++) {
      let objetoNormal = descarte[i].toObject();
      objetoNormal.predios = Object.fromEntries(objetoNormal.predios);
      const fruta = lotes.find(lote => ids[i] === lote._id);
      obj = objetoNormal;
      obj = { ...obj, tipoFruta: fruta.tipoFruta };
      datos.push(obj);
    }
    data.data = datos;
    return { ...data, status: 200, message: "Ok" };
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en obtenerHistorialDescarte: ${e.name}` };
  }
};
const obtenerClientes = async data => {
  try {
    const clientes = await Clientes.find().sort({ CODIGO: 1 });
    data.data = clientes;
    return { ...data, status: 200, message: "Ok" };
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en obtenerClientes: ${e.name}` };
  }
};
const crearContenedor = async data => {
  try {
    console.log(data);
    if (1 === 1) {
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

      const cliente = await Clientes.findById(id);

      const contenedor = new Contenedores({
        _id: data.data.data.numeroContenedor,
        infoContenedor: {
          clienteInfo: cliente._id,
          nombreCliente:cliente.CLIENTE,
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
      return { ...data, status: 200, message: "Ok" };
    } else {
      return { ...data, status: 403, message: "Acceso no permitido" };
    }
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en crearContenedor: ${e.name}` };
  }
};
const obtenerDataContenedor = async data => {
  try {
    const contenedores = await Contenedores.find({ "infoContenedor.cerrado": false }, "pallets infoContenedor _id __v");
    const cajasSinPallet = await obtenerCajasSinPallet();
    data.data.contenedores = contenedores;
    data.data.cajasSinPallet = cajasSinPallet.data;
    return { ...data, status: 200, message: "Ok" };
  } catch (e) {
    console.error(e);
    return { ...data, status: 401, message: `Error en obtenerDataContenedor: ${e.name}` };
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
    const lote = await Lotes.findById(data.data.item.id).populate("predio", "CODIGO INTERNO ICA GGN");
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
    const resRendimiento = rendimiento(lote);
    if (isNaN(resRendimiento)) {
      lote.rendimiento = 100;
    } else {
      lote.rendimiento = resRendimiento;
    }
    lote.deshidratacion = deshidratacion(lote);

    lote.markModified("exportacion");
    await lote.save();
    return {
      proveedor: { code: lote.predio["CODIGO INTERNO"], ICA: lote.predio.ICA, GGN: lote.predio.GGN },
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
    console.log(contenedor)
    if (calidad === 1) {
      lote.exportacion.get(String(numeroContenedor)).calidad1 -= cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
    } else if (calidad === 1.5) {
      lote.exportacion.get(String(numeroContenedor)).calidad1_5 -= cajas * contenedor.infoContenedor.pesoCaja[tipoCaja];
    } else if (calidad === 2) {
      lote.exportacion.get(String(numeroContenedor)).calidad2 -= cajas * 40;
    }

    const resRendimiento = rendimiento(lote);
    if (isNaN(resRendimiento)) {
      lote.rendimiento = 100;
    } else {
      lote.rendimiento = resRendimiento;
    }
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
    const contenedor = await Contenedores.findById(data.data.contenedor);
    const child = fork("./Api/CrearInformes/crearInformeListaEmpaque.js");
    child.send(contenedor);
    child.on("message", async url => {
      contenedor.infoContenedor.urlInforme = url;
      contenedor.infoContenedor.cerrado = true;
      contenedor.infoContenedor.fechaFinalizado = new Date();

      await contenedor.save();
      child.kill("SIGTERM");
    });
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
    const lotes = await Lotes.find({ "calidad.fotosCalidad": { $exists: false }, predio: { $exists: true } })
      .populate("predio", "PREDIO")
      .sort({ fechaIngreso: -1 });
    lotes.forEach(lote => {
      if (lote._id[0] !== "C") {
        objReturn.push({
          id: lote._id,
          nombre: lote.predio.PREDIO,
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
    let salto = 0;
    if (data.data.data) {
      salto = 50 * data.data.data;
    }
    const lotes = await Lotes.find().sort({ fechaIngreso: -1 }).skip(salto).limit(50);
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
    let ordenar = { fechaIngreso: -1 };

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
    if (filtro.tipoDato && Object.keys(filtro.tipoDato).length !== 0) {
      const key = Object.keys(filtro.tipoDato)[0];
      consulta["calidad.calidadInterna." + key] = {};
      consulta["calidad.calidadInterna." + key].$gte = Number(filtro.tipoDato[key].$gte);
      if (filtro.tipoDato[key].$lt === "") {
        consulta["calidad.calidadInterna." + key].$lt = 10000;
      } else {
        consulta["calidad.calidadInterna." + key].$lt = Number(filtro.tipoDato[key].$lt);
      }
    }
    if (filtro.tipoDato && Object.prototype.hasOwnProperty.call(filtro, "ordenar") && filtro.ordenar !== "") {
      const key = Object.keys(filtro.tipoDato)[0];

      ordenar["calidad.calidadInterna." + key] = Number(filtro.ordenar);
      delete ordenar.fechaIngreso;
    }
    const lotes = await Lotes.find(consulta).sort(ordenar).limit(cantidad);
    data.data = lotes;
    return data;
  } catch (e) {
    console.log(`${e.name}: ${e.message}`);
  }
};
const enviarDatosFormularioProgramacionMulas = async data => {
  try {
    const info = data.data.data;
    const contenedor = await Contenedores.findById(Number(info.contenedor));
    contenedor.formularioInspeccionMula = {};
    contenedor.formularioInspeccionMula.placa = info.placa;
    contenedor.formularioInspeccionMula.trailer = info.trailer;
    contenedor.formularioInspeccionMula.conductor = info.conductor;
    contenedor.formularioInspeccionMula.cedula = info.cedula;
    contenedor.formularioInspeccionMula.celular = info.celular;
    contenedor.formularioInspeccionMula.color = info.color;
    contenedor.formularioInspeccionMula.modelo = info.modelo;
    contenedor.formularioInspeccionMula.marca = info.marca;
    contenedor.formularioInspeccionMula.prof = info.prof;
    contenedor.formularioInspeccionMula.puerto = info.puerto;
    contenedor.formularioInspeccionMula.naviera = info.naviera;
    contenedor.formularioInspeccionMula.agenciaAduanas = info.agenciaAduanas;

    await contenedor.save();

    const contenedores = await obtenerDataContenedorFormularioProgramacionMulas(data);
    data.data = contenedores.data;
    return data;
  } catch (e) {
    console.error("enviarDatosFormularioProgramacionMulas", e);
  }
};
const enviarDatosFormularioInspeccionMulas = async data => {
  try {
    const info = data.data.data;
    const contenedor = await Contenedores.findById(Number(info.numContenedor));
    contenedor.formularioInspeccionMula = {};
    contenedor.formularioInspeccionMula.cumpleRequisitos = info.cumpleRequisitos === "Si" ? true : false;
    contenedor.infoContenedor.fechaSalida = info.fecha;
    contenedor.formularioInspeccionMula.responsable = info.responsable;

    if (!contenedor.formularioInspeccionMula.criterios) {
      contenedor.formularioInspeccionMula.criterios = new Map();
    }

    info.criterios.forEach((item, index) => {
      contenedor.formularioInspeccionMula.criterios.set(String(index), {
        nombre: item.nombre,
        cumplimiento: item.cumplimiento === "C" ? true : false,
        observaciones: item.observaciones,
      });
    });

    contenedor.markModified("formularioInspeccionMula.criterios");
    await contenedor.save();
    const contenedores = await obtenerDataContenedorFormularioInspeccionMulas(data);
    return contenedores.data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerDataContenedorFormularioProgramacionMulas = async data => {
  try {
    const contenedores = await Contenedores.find({ formularioInspeccionMula: { $exists: false } }, "infoContenedor");
    data.data = contenedores;

    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerDataContenedorFormularioInspeccionMulas = async data => {
  try {
    const contenedores = await Contenedores.find(
      { "formularioInspeccionMula.criterios": { $exists: false } },
      "infoContenedor formularioInspeccionMula",
    );
    data.data = contenedores;

    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerHistorialDataContenedorFormularioInspeccionMulas = async data => {
  try {
    const filtro = data.data.fechas;

    let consulta = { formularioInspeccionMula: { $exists: true } };
    let cantidad = 50;
    if (data.data.tipoFruta !== "") {
      consulta["infoContenedor.tipoFruta"] = data.data.tipoFruta;
    }

    if (filtro.fechaInicio !== null) {
      consulta["infoContenedor.fechaSalida"] = {};
      consulta["infoContenedor.fechaSalida"].$gte = new Date(filtro.fechaInicio);
      consulta["infoContenedor.fechaSalida"].$lt = new Date();
    }

    if (filtro.fechaFin !== null) {
      consulta["infoContenedor.fechaSalida"].$lt = new Date(filtro.fechaInicio);
    }
    if (filtro.cantidad !== "") {
      cantidad = Number(filtro.cantidad);
    }

    const contenedores = await Contenedores.find(
      consulta,
      "formularioInspeccionMula infoContenedor.fechaSalida infoContenedor.tipoFruta",
    )
      .sort({ fecha: -1 })
      .limit(cantidad);
    data.data = contenedores;

    return data;
  } catch (e) {
    console.error(e);
  }
};
const ObtenerInfoContenedoresCelifrut = async data => {
  try {
    const filtro = data.data.filtro;
    let consulta = {};
    let cantidad = 0;

    if (filtro.fecha.tipo === "entrada") {
      if (filtro.fecha.inicio !== null) {
        consulta["infoContenedor.fechaCreacion"] = {};
        consulta["infoContenedor.fechaCreacion"].$gte = new Date(filtro.fecha.inicio);
        if (filtro.fecha.fin === null) {
          const fecha = new Date();
          consulta["infoContenedor.fechaCreacion"].$lt = fecha;
        } else {
          const fecha = new Date(filtro.fecha.fin);
          fecha.setUTCHours(23);
          fecha.setUTCMinutes(59);
          fecha.setUTCSeconds(59);
          consulta["infoContenedor.fechaCreacion"].$lt = fecha;
        }
      }
    }
    if (filtro.fecha.tipo === "finalizado") {
      if (filtro.fecha.inicio !== null) {
        consulta["infoContenedor.fechaFinalizado"] = {};
        consulta["infoContenedor.fechaFinalizado"].$gte = new Date(filtro.fecha.inicio);
        if (filtro.fecha.fin === null) {
          const fecha = new Date();
          consulta["infoContenedor.fechaFinalizado"].$lt = fecha;
        } else {
          const fecha = new Date(filtro.fecha.fin);
          fecha.setUTCHours(23);
          fecha.setUTCMinutes(59);
          fecha.setUTCSeconds(59);
          consulta["infoContenedor.fechaFinalizado"].$lt = fecha;
        }
      }
    }
    if (filtro.fecha.tipo === "salida") {
      if (filtro.fecha.inicio !== null) {
        consulta["infoContenedor.fechaSalida"] = {};
        consulta["infoContenedor.fechaSalida"].$gte = new Date(filtro.fecha.inicio);
        if (filtro.fecha.fin === null) {
          const fecha = new Date();
          consulta["infoContenedor.fechaSalida"].$lt = fecha;
        } else {
          const fecha = new Date(filtro.fecha.fin);
          fecha.setUTCHours(23);
          fecha.setUTCMinutes(59);
          fecha.setUTCSeconds(59);
          consulta["infoContenedor.fechaSalida"].$lt = fecha;
        }
      }
    }

    // if (filtro.cantidad !== "") {
    //   cantidad = Number(filtro.cantidad);
    // }
    const contenedores = await Contenedores.find(consulta, "infoContenedor formularioInspeccionMula")
      .sort({ _id: -1 })
      .limit(cantidad);
    data.data = contenedores;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const dataHistorialCalidadInterna = async data => {
  try {
    const filtro = data.data.data.filtros;

    const query = { "calidad.calidadInterna": { $exists: true }, "calidad.calidadInterna.fecha": { $exists: true } };
    let cantidad = 50;
    if (filtro.tipoFruta !== "") {
      query.tipoFruta = filtro.tipoFruta;
    }
    if (filtro.fechaIngreso.$gte !== null) {
      query["calidad.calidadInterna.fecha"] = {};
      query["calidad.calidadInterna.fecha"].$gte = filtro.fechaIngreso.$gte;
      query["calidad.calidadInterna.fecha"].$lt = new Date();
    }
    if (filtro.fechaIngreso.$lt !== null) {
      query["calidad.calidadInterna.fecha"].$lt = filtro.fechaIngreso.$lt;
    }
    if (filtro.cantidad !== "") {
      cantidad = Number(filtro.cantidad);
    }
    const lotes = await Lotes.find(query, "calidad.calidadInterna tipoFruta nombrePredio")
      .sort({ fecha: -1 })
      .limit(cantidad);
    data.data = lotes;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const dataHistorialClasificacionCalidad = async data => {
  try {
    const filtro = data.data.data.filtros;

    const query = {
      "calidad.clasificacionCalidad": { $exists: true },
      "calidad.clasificacionCalidad.fecha": { $exists: true },
    };
    let cantidad = 50;
    if (filtro.tipoFruta !== "") {
      query.tipoFruta = filtro.tipoFruta;
    }
    if (filtro.fechaIngreso.$gte !== null) {
      query["calidad.clasificacionCalidad.fecha"] = {};
      query["calidad.clasificacionCalidad.fecha"].$gte = filtro.fechaIngreso.$gte;
      query["calidad.clasificacionCalidad.fecha"].$lt = new Date();
    }
    if (filtro.fechaIngreso.$lt !== null) {
      query["calidad.clasificacionCalidad.fecha"].$lt = filtro.fechaIngreso.$lt;
    }
    if (filtro.cantidad !== "") {
      cantidad = Number(filtro.cantidad);
    }
    const lotes = await Lotes.find(query, "calidad.clasificacionCalidad tipoFruta nombrePredio")
      .sort({ fecha: -1 })
      .limit(cantidad);
    data.data = lotes;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerHistorialFormularioInspeccionVehiculos = async data => {
  try {
    const filtro = data.data;

    const query = {};
    let cantidad = 50;

    if (filtro.fechaInicio !== null) {
      query.fecha = {};
      query.fecha.$gte = new Date(filtro.fechaInicio);
      query.fecha.$lt = new Date();
    }
    if (filtro.fechaFin !== null) {
      query.fecha.$lt = new Date(filtro.fechaFin);
    }
    if (filtro.cantidad !== "") {
      cantidad = Number(filtro.cantidad);
    }
    if (filtro.nombreConductor !== "") {
      query.nombreConductor = filtro.nombreConductor;
    }

    const fomularios = await formularioCamiones.find(query).sort({ fecha: -1 }).limit(cantidad);
    data.data = fomularios;

    return data;
  } catch (e) {
    console.error(e);
  }
};
const ingresarCliente = async data => {
  try {
    const cliente = data.data.data;
    const clienteNuevo = new Clientes({
      CODIGO: Number(cliente.codigo),
      CLIENTE: cliente.cliente,
      CORREO: cliente.correo,
      DIRECCIÓN: cliente.direccion,
      PAIS_DESTINO: cliente.pais,
      TELEFONO: cliente.telefono,
      ID: cliente.id,
    });
    await clienteNuevo.save();
    return data;
  } catch (e) {
    console.error(e);
  }
};
const eliminarCliente = async data => {
  try {
    const info = data.data.data;

    const id = new mongoose.Types.ObjectId(info);
    const cliente = await Clientes.findById(id);
    await cliente.deleteOne();

    return data;
  } catch (e) {
    console.error(e);
  }
};
const modificarCliente = async data => {
  try {
    const info = data.data.data;
    const id = new mongoose.Types.ObjectId(info._id);
    const cliente = await Clientes.findById(id);
    cliente.CODIGO = info.codigo;
    cliente.CLIENTE = info.cliente;
    cliente.CORREO = info.correo;
    cliente.PAIS_DESTINO = info.pais;
    cliente.TELEFONO = info.telefono;
    cliente.ID = info.id;

    await cliente.save();
    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerFormularioProgramacionMula = async data => {
  try {
    const hitorial = await Contenedores.find({formularioInspeccionMula:{$exists: true}}, "infoContenedor formularioInspeccionMula").sort({_id:-1});
    data.data = hitorial;
    return data;
  } catch (e) {
    console.error(e);
  }
};
const editarFormularioProgramacionMula  = async data => {
  try {
    await Contenedores.findOneAndUpdate({_id:data.data._id}, data.data, {new: true});
    const hitorial = await Contenedores.find({formularioInspeccionMula:{$exists: true}}, "infoContenedor formularioInspeccionMula").sort({_id:-1});
    data.data = hitorial;
    console.log(data)
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
  obtenerDataContenedorFormularioInspeccionMulas,
  obtenerHistorialDataContenedorFormularioInspeccionMulas,
  ObtenerInfoContenedoresCelifrut,
  dataHistorialCalidadInterna,
  dataHistorialClasificacionCalidad,
  obtenerHistorialFormularioInspeccionVehiculos,
  ingresarCliente,
  eliminarCliente,
  modificarCliente,
  enviarDatosFormularioProgramacionMulas,
  obtenerDataContenedorFormularioProgramacionMulas,
  obtenerFormularioProgramacionMula,
  editarFormularioProgramacionMula
};
