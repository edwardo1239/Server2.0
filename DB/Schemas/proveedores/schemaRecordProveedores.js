require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);

const HistorialProveedoresSchema = new Schema({
  nombreProveedor: String,
  operacionRealizada: String,
  documento: Object,
  fecha: {type:Date, default: new Date()}
});


const recordProveedores = conn.model("recordProveedor", HistorialProveedoresSchema);


module.exports.recordProveedores = recordProveedores;