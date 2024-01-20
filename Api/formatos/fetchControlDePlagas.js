const { default: mongoose } = require("mongoose");
const { connectPersonalDB } = require("../../DB/config/configDB");
const { ControlDePlagas } = require("../../DB/Schemas/formatosCalidad/schemaControlDePlagas");

connectPersonalDB();

fetch(
  "https://script.google.com/macros/s/AKfycbxe23WzxtAfcnzqu0FDOACpdUu8XcrnaXEuWs_iNnDcbTykkp_fpFaL0tIVg1UWGnL1Fg/exec",
)
  .then(data => data.json())
  .then(async data => {
    for(let element of data) {
      const nuevaArea = new ControlDePlagas(element);
      try {
        await nuevaArea.save();
        console.log("Datos guardados exitosamente");
      } catch (err) {
        console.error("Error al guardar los datos:", err);
      }
    }
    mongoose.connection.close();
  });
