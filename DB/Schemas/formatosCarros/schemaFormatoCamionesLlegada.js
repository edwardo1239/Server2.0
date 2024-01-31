require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);


const formularioFormatoCamionLlegadaSchema = new Schema({
  criterio1: String,
  criterio2: String,
  criterio3: String,
  criterio4: String,
  criterio5: String,
  criterio6: String,
  criterio7: String,
  criterio8: String,
  criterio9: String,
  criterio10: String,
  criterio11: String,
  criterio12: String,
  criterio13: String,
  criterio14: String,
  criterio15: String,
  criterio16: String,
  placa: String,
  calificacion: Number,
  responsable: String,
  observaciones1: String,
  observaciones2: String,
  observaciones3: String,
  observaciones4: String,
  observaciones5: String,
  observaciones6: String,
  observaciones7: String,
  observaciones8: String,
  observaciones9: String,
  observaciones10: String,
  observaciones11: String,
  observaciones12: String,
  observaciones13: String,
  observaciones14: String,
  observaciones15: String,
  observaciones16: String,
  lugar: String,
  tipoFruta: String,
  nombreConductor: String,
  inspeccionCalidad: String,
  fecha: { type: Date, default: Date.now }
});

const formularioCamiones = conn.model("formularioCamion", formularioFormatoCamionLlegadaSchema);


module.exports.formularioCamiones = formularioCamiones;
