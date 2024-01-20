require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);


const HistorialLotesSchema = new Schema({
  nombreColeccion: String,
  operacionRealizada: String,
  documento: Object,
  canastillas: Number,
  fecha: {type:Date, default: new Date()}
});



const recordLotes = conn.model("recordLote", HistorialLotesSchema);


module.exports.recordLotes = recordLotes;

