const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGODB_PROCESO);


const schemaPrecioFruta = new Schema({
  anno: Number,
  semana: Number,
  tipoFruta: String,
  exportacion1: Number,
  exportacion15: Number,
  pareja: { type: Number, default: 0 },
  descarte: Number,
  nacional: Number,
  fecha_creacion: { type: Date, default: Date.now } 
});

const precioFrutaProveedor = conn.model("precioFrutaProveedor", schemaPrecioFruta);

module.exports.precioFrutaProveedor = precioFrutaProveedor;