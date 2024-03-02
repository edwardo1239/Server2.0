require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection("mongodb://localhost:27017/proceso");

const ClienteSchema = new Schema({
  CLIENTE:String,
  PAIS_DESTINO: String,
  CODIGO:Number,
  CORREO: String,
  DIRECCIÓN: String,
  ID: String,
  TELEFONO:String,
});

const Clientes = conn.model("Cliente", ClienteSchema);

module.exports.Clientes = Clientes;