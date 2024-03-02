require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);


const HistorialLotesSchema = new Schema({
  nombreColeccion: String,
  operacionRealizada: String,
  documento: Object,
  canastillas: Number,
  fecha: {type:Date, default: Date.now},
});


HistorialLotesSchema.index({ fecha: 1 }, { expireAfterSeconds: 600 });
const recordLotes = conn.model("recordLote", HistorialLotesSchema);


module.exports.recordLotes = recordLotes;

