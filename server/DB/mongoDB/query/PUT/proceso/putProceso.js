const { default: mongoose } = require("mongoose");
const { Lotes } = require("../../../schemas/lotes/schemaLotes");
const { recordLotes } = require("../../../schemas/lotes/schemaRecordLotes");
const { Proveedores } = require("../../../schemas/proveedores/schemaProveedores");
const { Clientes } = require("../../../schemas/clientes/schemaClientes");
const { Contenedores } = require("../../../schemas/contenedores/schemaContenedores");
const { deshidratacion_lote, rendimiento_lote, oobtener_datos_lotes_to_informe } = require("../../../functions/proceso");
const { logger } = require("../../../../../error/config");

const putLote = async data => {
  try {
    const id = data.data.lote._id;
    const originalLote = await Lotes.findById(id);
    const lote = await Lotes.findOneAndUpdate({ _id: id }, data.data.lote, { new: true });
    const lote_obj = new Object(lote.toObject());
    const deshidratacion = await deshidratacion_lote(lote_obj);
    const rendimiento = await rendimiento_lote(lote_obj);
    lote.deshidratacion = deshidratacion;
    lote.rendimiento = rendimiento;
    await lote.save();
    let record = new recordLotes({
      operacionRealizada: data.record,
      documento: data.data.lote,
    });

    await record.save();

    return { ...data, response: { status: 200, message: "Ok", record:originalLote } };
  } catch (e) {
    logger.error(e, data);
    console.error(data);
    logger.error(data);

    return { ...data, response: { status: 400, message: "Error en la funcion putLote" + e.message } };
  }
};
const putProveedor = async data => {
  try {
    const id = data._id;
    await Proveedores.updateOne({ _id: id }, data.data);

    return { ...data, response: { status: 200, message: "Ok" } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion putProveedor" } };
  }
};
const putCliente = async data => {
  try {
    const id = data._id;
    await Clientes.updateOne({ _id: id }, data.data);

    return { ...data, response: { status: 200, message: "Ok" } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion putProveedor" } };
  }
};
const putContenedor = async data => {
  try {
    const id = new mongoose.Types.ObjectId(data.data.contenedor._id);
    await Contenedores.updateOne({ _id: id }, data.data.contenedor);

    return { ...data, response: { status: 200, message: "Ok" } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion putContenedor" } };
  }
};
const agregarSettingsPallet = async data => {
  try {
    const dataC = data.data.contenedor;
    const id = new mongoose.Types.ObjectId(dataC._id);
    const contenedor = await Contenedores.findById({ _id: id });
    if (contenedor) {

      contenedor.pallets[dataC.pallet].get("settings").tipoCaja = dataC.item.tipoCaja;
      contenedor.pallets[dataC.pallet].get("settings").calidad = dataC.item.calidad;
      contenedor.pallets[dataC.pallet].get("settings").calibre = dataC.item.calibre;

      await Contenedores.updateOne({ _id: id }, { $set: { pallets: contenedor.pallets } });


    }

    return { ...data, response: { status: 200, message: "Ok" } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion putContenedor" } };
  }
};
const liberarPallet = async data => {
  try {
    const dataC = data.data.contenedor;
    const id = new mongoose.Types.ObjectId(dataC._id);
    const contenedor = await Contenedores.findById({ _id: id });
    if (contenedor) {

      contenedor.pallets[dataC.pallet].get("listaLiberarPallet").rotulado = dataC.item.rotulado;
      contenedor.pallets[dataC.pallet].get("listaLiberarPallet").paletizado = dataC.item.paletizado;
      contenedor.pallets[dataC.pallet].get("listaLiberarPallet").enzunchado = dataC.item.enzunchado;
      contenedor.pallets[dataC.pallet].get("listaLiberarPallet").estadoCajas = dataC.item.estadoCajas;
      contenedor.pallets[dataC.pallet].get("listaLiberarPallet").estiba = dataC.item.estiba;

      await Contenedores.updateOne({ _id: id }, { $set: { pallets: contenedor.pallets } });

    }

    return { ...data, response: { status: 200, message: "Ok" } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion putContenedor" } };
  }
};
const cerrarContenedor = async data => {
  try {
    const dataC = data.data.contenedor;
    const id = new mongoose.Types.ObjectId(dataC._id);
    const contenedor = await Contenedores.findById({ _id: id });
    if (contenedor) {
      contenedor.infoContenedor.cerrado = true;
      await contenedor.save();
    }

    return { ...data, response: { status: 200, message: "Ok", data: contenedor } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion putContenedor" } };
  }
};
const addPallet = async data => {
  try {
    const dataC = data.data.contenedor;

    const id = new mongoose.Types.ObjectId(dataC._id);
    const contenedor = await Contenedores.findById({ _id: id });
    if (contenedor) {
      contenedor.pallets[dataC.pallet].get("EF1").push(dataC.item);

      await Contenedores.updateOne({ _id: id }, { $set: { pallets: contenedor.pallets } });
    }
    return { ...data, response: { status: 200, message: "Ok" } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion putContenedor" } };
  }
};
const eliminarItem = async data => {
  try {
    let cajas = [];
    const dataC = data.data.contenedor;

    const seleccion = dataC.item.sort((a, b) => b - a);
    const len = seleccion.length;
    const id = new mongoose.Types.ObjectId(dataC._id);
    const contenedor = await Contenedores.findById({ _id: id });
    for (let i = 0; i < len; i++) {
      cajas.push(contenedor.pallets[dataC.pallet].get("EF1").splice(seleccion[i], 1)[0]);
    }
    await Contenedores.updateOne({ _id: id }, { $set: { pallets: contenedor.pallets } });

    return { ...data, response: { status: 200, message: "Ok", data: cajas } };

  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion eliminarItem" } };
  }
};
const restarItem = async data => {
  try {
    const dataC = data.data.contenedor;
    let item;
    const id = new mongoose.Types.ObjectId(dataC._id);
    const contenedor = await Contenedores.findById({ _id: id });
    if (contenedor) {
      contenedor.pallets[dataC.pallet].get("EF1")[dataC.item].cajas -= dataC.cajas;
      item = contenedor.pallets[dataC.pallet].get("EF1")[dataC.item];
      if (contenedor.pallets[dataC.pallet].get("EF1")[dataC.item].cajas === 0) {
        contenedor.pallets[dataC.pallet].get("EF1").splice(dataC.item, 1)[0];
      }
      await Contenedores.updateOne({ _id: id }, { $set: { pallets: contenedor.pallets } });
    }
    return { ...data, response: { status: 200, message: "Ok", data: item } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion restarItem" } };
  }
};
const putHistorialLote = async data => {
  try {
    const id = new mongoose.Types.ObjectId(data.data.lote._id);
    await recordLotes.findByIdAndUpdate({ _id: id }, data.data.lote, { new: true });

    return { ...data, response: { status: 200, message: "Ok" } };
  } catch (e) {
    logger.error(e, data);
    return { ...data, response: { status: 400, message: "Error en la funcion putProveedor" } };
  }
};
const actualizar_contenedor = async data => {
  const id = new mongoose.Types.ObjectId(data.data.contenedor._id);
  const contenedor = await Contenedores.findByIdAndUpdate({ _id: id }, data.data.contenedor, { new: true });
  const new_conts = contenedor.toObject();
  const new_contenedores = await oobtener_datos_lotes_to_informe([new_conts]);
  Promise.all(new_contenedores);
  return { ...data, response: { data: new_contenedores, status: 200, message: "Ok" } };
};



module.exports = {
  putLote,
  putProveedor,
  putCliente,
  putContenedor,
  agregarSettingsPallet,
  addPallet,
  eliminarItem,
  restarItem,
  liberarPallet,
  putHistorialLote,
  cerrarContenedor,
  actualizar_contenedor
};
