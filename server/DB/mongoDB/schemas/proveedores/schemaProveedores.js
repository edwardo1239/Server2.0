
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGODB_PROCESO);

const PredioSchema = new Schema({
  PREDIO: { type: String, required: true },
  ICA: String,
  "CODIGO INTERNO": { type: String, required: true },
  GGN: String,
  "FECHA VENCIMIENTO GGN": String,
  N: String,
  L: String,
  M: String,
  PROVEEDORES: String,
  DEPARTAMENTO: String,
  urlArchivos: [String]
});


const Proveedores = conn.model("Proveedor", PredioSchema);

module.exports.Proveedores = Proveedores;