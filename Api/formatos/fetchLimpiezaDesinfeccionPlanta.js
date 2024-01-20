const { default: mongoose } = require("mongoose");
const { connectPersonalDB } = require("../../DB/config/configDB");
const { LimpiezaDesinfeccionPlanta } = require("../../DB/Schemas/formatosCalidad/schemaLimpiezaDesinfeccionPlanta");

connectPersonalDB();

fetch(
  "https://script.google.com/macros/s/AKfycbxF6fjtI0vp1Z5E1hdPvZsVxLrMLHK8G2P3YN0yF3CRyKlxeQ3a4bc2kWmQuCyivbNeNg/exec",
)
  .then(data => data.json())
  .then(async data => {
    for(let element of data) {
      const nuevaArea = new LimpiezaDesinfeccionPlanta(element);
      try {
        await nuevaArea.save();
        console.log("Datos guardados exitosamente");
      } catch (err) {
        console.error("Error al guardar los datos:", err);
      }
    }
    mongoose.connection.close();
  });
