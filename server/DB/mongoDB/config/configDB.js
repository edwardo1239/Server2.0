const mongoose = require("mongoose");

const connectProcesoDB = async () => {
  let tipoBaseDatos = process.env.MONGODB_PROCESO;

  //process.send(tipoBaseDatos);

  const db = mongoose.createConnection(tipoBaseDatos);

  //const db = mongoose.connection;

  db.on("error", () => console.error("connection error:"));
  db.once("open", function () {
    console.log(`¡Conexión exitosa! se connecto como ${tipoBaseDatos}`);
  });
  return db;
};
const connectPersonalDB = async () => {
  let tipoBaseDatos = process.env.MONGODB_PERSONAL;

  const db = mongoose.createConnection(tipoBaseDatos);

  db.on("error", () => console.error("connection error:"));
  db.once("open", function () {
    console.log(`¡Conexión exitosa! se connecto como ${tipoBaseDatos}`);
  });

  return db;
};
const disconnectDB = (db) => {
  db.close((err) => {
    if (err) {
      console.log("Hubo un error al cerrar la conexión:", err);
    } else {
      console.log("Conexión cerrada exitosamente");
    }
  });
};

module.exports = {
  connectProcesoDB,
  connectPersonalDB,
  disconnectDB
};
