const mongoose = require("mongoose");
const { Lotes } = require("../lotes/schemaLotes");
const { Clientes } = require("../clientes/schemaClientes");
const { Schema } = mongoose;

const conn = mongoose.createConnection("mongodb://localhost:27017/proceso");

const listaLiberarPalletSchema = new Schema(
  {
    rotulado: Boolean,
    paletizado: Boolean,
    enzunchado: Boolean,
    estadoCajas: Boolean,
    estiba: Boolean,
  },
  { _id: false },
);

const settingsSchema = new Schema(
  {
    tipoCaja: String,
    calidad: Number,
    calibre: Number,
  },
  { _id: false },
);

const EF1Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  lote: { type: Schema.Types.ObjectId, ref: Lotes },
  cajas: Number,
  tipoCaja: String,
  calibre: Number,
  calidad: Number,
  fecha: Date,
});

const subSchema = new Schema(
  {
    settings: settingsSchema,
    EF1: [{ type: Map, of: EF1Schema }],
    listaLiberarPallet: listaLiberarPalletSchema,
  },
  { _id: false },
);

const infoContenedorSchema = new Schema({
  clienteInfo: { type: Schema.Types.ObjectId, ref: Clientes },
  fechaCreacion: Date,
  fechaInicio: Date,
  fechaFinalizado: Date,
  fechaEstimadaCargue: Date,
  fechaSalida: Date,
  tipoFruta: String,
  tipoEmpaque: String,
  tipoCaja: [String],
  calidad: [Number],
  cerrado: Boolean,
  observaciones: String,
  desverdizado: Boolean,
  calibres: String,
  urlInforme: String,
});

const criteriosSchema = new Schema({
  nombre: String,
  cumplimiento: Boolean,
  observaciones: String,
});

const schemaFormularioInspeccionMulas = new Schema({
  placa: String,
  trailer: String,
  conductor: String,
  cedula: String,
  celular: String,
  color: String,
  modelo: String,
  marca: String,
  prof: String,
  puerto: String,
  naviera: String,
  agenciaAduanas: String,
  empresaTransporte: String,
  cumpleRequisitos: Boolean,
  responsable: String,
  criterios: {
    type: Map,
    of: criteriosSchema,
  },
});

const listaEmpaqueSchema = new Schema({
  numeroContenedor: Number,
  pallets: [{ type: Map, of: subSchema }],
  infoContenedor: infoContenedorSchema,
  formularioInspeccionMula: schemaFormularioInspeccionMulas,
});

const Contenedores = conn.model("Contenedor", listaEmpaqueSchema);

module.exports.Contenedores = Contenedores;
