const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PERSONAL);

const higieneSchema = new Schema({
  pantalon: { type: Boolean, required: true },
  unasCortas: { type: Boolean, required: true },
  tapaoidos: { type: Boolean, required: true },
  estadoSalud: { type: Boolean, required: true },
  barba: { type: Boolean, required: true },
  accesorio: { type: Boolean, required: true },
  camisa: { type: Boolean, required: true },
  maquillaje: { type: Boolean, required: true },
  tapabocas: { type: Boolean, required: true },
  cofia: { type: Boolean, required: true },
  botas: { type: Boolean, required: true },
}, { _id : false });



const registroHigieneSchema = new Schema({
  responsable: { type: String, required: true },
  elementosHigiene: { type: higieneSchema, required: true },
  colaborador: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

const registroHigiene = conn.model("registroHigiene", registroHigieneSchema);

module.exports.registroHigiene = registroHigiene;
