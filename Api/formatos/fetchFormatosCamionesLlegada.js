const { connectProcesoDB } = require("../../DB/config/configDB");
const { formularioCamiones } = require("../../DB/Schemas/formatosCarros/schemaFormatoCamionesLlegada");
console.log("asdasdad");
connectProcesoDB().then((db) => {
  fetch(
    "https://script.google.com/macros/s/AKfycbw2xwdEqE4cJ-EXntuQsnM8pBctYr8XlZrQOV_mWAJc1F9esqeisF5xbuOV7KYdJ0R52Q/exec"
  )
    .then(data => data.json())
    .then(async data => {
      console.error(data);
      for(let element of data) {
        const nuevaArea = new formularioCamiones(element);
        try {
          await nuevaArea.save();
          console.log("Datos guardados exitosamente");
        } catch (err) {
          console.error("Error al guardar los datos:", err);
        }
      }
      await db.close();
    });
}
);


