const mongoose = require("mongoose");
const { Lotes } = require("../schemas/lotes/schemaLotes");
const { logger } = require("../../../error/config");
const { crear_informes_calidad } = require("../../../functions/sistema");

const descarteTotal = (descarte) => {
  try{
    const sum = Object.values(descarte).reduce((acu, descarte) => acu += descarte, 0);
    return sum;
  } catch (e){
    console.error(`Error en la fncion descarteTotal que calcula el descarte: ${e}`);
    return 0;
  }
};
const convertir_objectsIds_listaEmpaque = async (contenedor) => {
  for(let i = 0; i < contenedor.pallets.length; i++){
    for(let j = 0; j < contenedor.pallets[i].EF1.length; j++){
      if(mongoose.Types.ObjectId.isValid(contenedor.pallets[i].EF1[j].lote)){
        contenedor.pallets[i].EF1[j].lote = new mongoose.Types.ObjectId(contenedor.pallets[i].EF1[j].lote);
      }
    }
  }
  return contenedor;
};
const oobtener_datos_lotes_to_listaEmpaque = async (contenedores) => {
  try{
    const ids = contenedores.map(contenedor => contenedor._id);
    const lotes = await Lotes.find({ contenedores: { $in: ids }}).select({enf:1}).populate("predio", "PREDIO");
    for (let i = 0; i< contenedores.length; i++) {
      for(let j = 0; j<contenedores[i].pallets.length; j++){
        for(let n = 0; n<contenedores[i].pallets[j].get("EF1").length; n++){
          const lote = lotes.find(item => item._id.toString() === contenedores[i].pallets[j].get("EF1")[n].lote); 
          contenedores[i].pallets[j].get("EF1")[n].lote = typeof lote === "object" ?
            {enf:lote._doc.enf, predio:lote._doc.predio.PREDIO}
            :
            contenedores[i].pallets[j].get("EF1")[n].lote;
        }
      }
      contenedores[i].pallets = contenedores[i].pallets.map(pallet => Object.fromEntries(pallet));
    }
    return contenedores;
  } catch (e){
    console.error(e);
    return contenedores;
  }
};
const rendimiento_lote = async (data) => {
  try{
    const kilosVaciados = Number(data.kilosVaciados);
    if(kilosVaciados === 0) return 0;
    const calidad1 = data.calidad1;
    const calidad15 = data.calidad15;
    const calidad2 = data.calidad2;
    const total = calidad1 + calidad15 + calidad2;
    const rendimiento = (total * 100) / kilosVaciados;

    return rendimiento;
  } catch (e){
    logger.error("Error obteniendo rendimiento del lote" + e);
  }
};
const deshidratacion_lote = async (data) => {
  try{
    const kilosTotal = data.kilos;
    if(kilosTotal === 0) return 0;
    const descarteLavado = descarteTotal(data.descarteLavado);
    const descarteEncerado = descarteTotal(data.descarteEncerado);
    const frutaNacional = data.frutaNacional;
    const directoNacional = data.directoNacional;
    const calidad1 = data.calidad1;
    const calidad15 = data.calidad15;
    const calidad2 = data.calidad2;
    const total = calidad1 + calidad15 + calidad2 + descarteLavado + descarteEncerado + frutaNacional + directoNacional ;
    const deshidratacion = 100 - (total * 100) / kilosTotal;

    if(deshidratacion <= 2 && deshidratacion >= 0){
      await crear_informes_calidad(data);
    }
    return deshidratacion;
 
  } catch (e){
    logger.error("Error obteniendo rendimiento del lote" + e);
  }
};


module.exports = {
  convertir_objectsIds_listaEmpaque,
  oobtener_datos_lotes_to_listaEmpaque,
  rendimiento_lote,
  deshidratacion_lote
};