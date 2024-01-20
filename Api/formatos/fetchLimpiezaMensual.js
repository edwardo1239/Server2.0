const { default: mongoose } = require("mongoose");
const { connectPersonalDB } = require("../../DB/config/configDB");
const { LimpiezaMensual } = require("../../DB/Schemas/formatosCalidad/schemalimpiezaMensual");

connectPersonalDB();

fetch(
  "https://script.google.com/macros/s/AKfycbxto6zAHpwuMWpSkK8Dqder5ZfCU7_-AW4YQVfEPxv8_onh3qV1dhC1CEqjxvoJFyBT/exec",
)
  .then(data => data.json())
  .then(async data => {
    for(let element of data) {
        
      const nuevaArea = new LimpiezaMensual(element);
      try {
        await nuevaArea.save();
        console.log("Datos guardados exitosamente");
      } catch (err) {
        console.error("Error al guardar los datos:", err);
      }
    }
    mongoose.connection.close();
  });
