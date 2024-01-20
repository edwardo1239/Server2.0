const { default: mongoose } = require("mongoose");
const { connectPersonalDB } = require("../../DB/config/configDB");
const { registroVolanteCalidad } = require("../../DB/Schemas/formatosCalidad/schemaVolanteCalidad");

connectPersonalDB();

fetch(
  "https://script.google.com/macros/s/AKfycbwrKXJf-sEmReEUGPWh5lg-eX_gw7UgykeC4KlIJcZo8pqKtIyJOFe1zWiNtt5HRlu_ug/exec",
)
  .then(data => data.json())
  .then(async data => {
    for(const element of data) {
      const volanteCalidad = new registroVolanteCalidad({
        unidades: element.unidades,
        fruta: element.fruta,
        defecto: element.defecto,
        operario: element.operario,
        fecha: element.fecha
      });
      try {
        await volanteCalidad.save();
        console.log("Datos guardados exitosamente");
      } catch (err) {
        console.error("Error al guardar los datos:", err);
      }
    }
    mongoose.connection.close();
  });