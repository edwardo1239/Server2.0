const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);

const ParametroSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  temperatura: Number,
  etileno: Number,
  carbono: Number,
  humedad: Number
}, {_id:false});


const desverdizadoSchema = new Schema({
  enf: String,
  canastillasIngreso: {type:Number, default:0},
  canastillas: {type:Number, default:0},
  kilos: {type:Number, default:0},
  kilosIngreso: {type:Number, default:0},
  cuartoDesverdizado: {type:String, default:""},
  fechaIngreso: {type:Date, default:new Date()},
  fechaFinalizar: Date,
  desverdizando: Boolean,
  canastillasSalida: {type:Number, default:0},
  parametros: [ParametroSchema],
  fechaProcesado: Date,
});


const Desverdizado = conn.model("Desverdizado", desverdizadoSchema);


module.exports.Desverdizado = Desverdizado;
