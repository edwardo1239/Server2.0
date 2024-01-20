require("dotenv").config();
const mongoose = require("mongoose");

const connectProcesoDB = async () => {
  let tipoBaseDatos = process.env.MONGO_URL_PROCESO;
  //process.send(tipoBaseDatos);

  const db = mongoose.createConnection(tipoBaseDatos);

  //const db = mongoose.connection;

  db.on("error", () => console.error("connection error:"));
  db.once("open", function () {
    console.log(`¡Conexión exitosa! se connecto como ${tipoBaseDatos}`);
  });
};

const connectPersonalDB = async () => {
  let tipoBaseDatos = process.env.MONGO_URL_PERSONAL;

  const db = mongoose.createConnection(tipoBaseDatos);

  db.on("error", () => console.error("connection error:"));
  db.once("open", function () {
    console.log(`¡Conexión exitosa! se connecto como ${tipoBaseDatos}`);
  });
};

module.exports = {
  connectProcesoDB,
  connectPersonalDB
};
