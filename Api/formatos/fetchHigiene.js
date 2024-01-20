const { default: mongoose } = require("mongoose");
const { connectPersonalDB } = require("../../DB/config/configDB");
const { registroHigiene } = require("../../DB/Schemas/formatosCalidad/schemaHigiene");

connectPersonalDB().then(() => {
  fetch(
    "https://script.google.com/macros/s/AKfycbywxqeqHCfSqfPJRbhcj4sk3x7zRHfi_eyHJuo66xjdTgupeRNyaLaI3kwLi3qLYE_Mwg/exec",
  )
    .then(data => data.json())
    .then(async data => {
      for(const element of data) { 
        const higiene = new registroHigiene({
          colaborador: element.colaborador,
          responsable: element.responsable,
          fecha: element.fecha,
          elementosHigiene: {
            pantalon: element.elementosHigiene.pantalon,
            estadoSalud: element.elementosHigiene.estadoSalud,
            tapabocas: element.elementosHigiene.tapabocas,
            tapaoidos: element.elementosHigiene.tapaoidos,
            unasCortas: element.elementosHigiene.unasCortas,
            barba: element.elementosHigiene.barba,
            accesorio: element.elementosHigiene.accesorio,
            botas: element.elementosHigiene.botas,
            maquillaje: element.elementosHigiene.maquillaje,
            cofia: element.elementosHigiene.cofia,
            camisa: element.elementosHigiene.camisa
          }
        });
        try {
          await higiene.save();
          console.log("Datos guardados exitosamente");
        } catch (err) {
          console.error("Error al guardar los datos:", err);
        }
      }
      mongoose.connection.close();
    });
  
});