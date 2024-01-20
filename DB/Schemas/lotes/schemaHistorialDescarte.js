require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);


const DescarLavadoteSchema = new Schema(
  {
    balin: Number,
    pareja: Number,
    descarteGeneral: Number,
  },
  { _id: false },
);

const DescarEnceradoteSchema = new Schema(
  {
    balin: Number,
    pareja: Number,
    descarteGeneral: Number,
    extra: Number,
  },
  { _id: false },
);

const PredioSchema = new Schema(
  {
    descarteLavado: DescarLavadoteSchema,
    descarteEncerado: DescarEnceradoteSchema,
    cliente: String,
  },
  { _id: false, strict: false },
);

const RegistroSchema = new Schema({
  fecha: Date,
  accion: String,
  predios: {
    type: Map,
    of: PredioSchema,
  },
});

const historialDescarte = conn.model("historialDescarte", RegistroSchema);


module.exports.historialDescarte = historialDescarte;
