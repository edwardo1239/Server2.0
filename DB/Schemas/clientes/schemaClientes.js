const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);

const ClienteSchema = new Schema({
  CLIENTE: {
    type: String,
    required: true
  },
  PAIS_DESTINO: {
    type: String,
    required: true
  },
  CODIGO: {
    type: Number,
    required: true
  },
  CORREO: {
    type: String,
    required: true
  },
  DIRECCIÓN: {
    type: String,
    required: true
  },
  ID: {
    type: String,
    required: true
  },
  TELEFONO: {
    type: String,
    required: true
  }
});



const Clientes = conn.model("Cliente", ClienteSchema);


module.exports.Clientes = Clientes;