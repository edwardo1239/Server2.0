const mongoose = require("mongoose");
const { Lotes } = require("../schemas/lotes/schemaLotes");


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


module.exports = {
  convertir_objectsIds_listaEmpaque,
  oobtener_datos_lotes_to_listaEmpaque,
};