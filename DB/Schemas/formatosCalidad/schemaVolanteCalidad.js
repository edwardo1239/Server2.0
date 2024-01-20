const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PERSONAL);

const calidadSchema = new Schema({
  unidades: { type: String, required: true },
  fruta: { type: String, required: true },
  defecto: { type: String, required: true },
  operario: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

const registroVolanteCalidad = conn.model("VolanteCalidad", calidadSchema);

module.exports.registroVolanteCalidad = registroVolanteCalidad;