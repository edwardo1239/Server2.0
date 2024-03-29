require("dotenv").config();

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { recordContenedores } = require("./schemaRecordContenedores.js");
const { Clientes } = require("../clientes/schemaClientes");
const { Proveedores } = require("../proveedores/schemaProveedores.js");

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);

const listaLiberarPalletSchema = new Schema({
  rotulado: Boolean,
  paletizado: Boolean,
  enzunchado: Boolean,
  estadoCajas: Boolean,
  estiba: Boolean
}, { _id: false });

const settingsSchema = new Schema({
  tipoCaja: String,
  calidad: Number,
  calibre: Number
}, { _id: false });

const EF1Schema = new Schema({
  id: String,
  nombre: String,
  predioId: {type: Schema.Types.ObjectId, ref: Proveedores},
  cajas: Number,
  tipoCaja: String,
  calibre: Number,
  calidad: Number,
  fecha: Date
});

const subSchema = new Schema({
  settings: settingsSchema,
  EF1: [EF1Schema],
  cajasTotal: Number,
  listaLiberarPallet: listaLiberarPalletSchema
}, { _id: false });

const pesoCajaSchema = new Schema({
  "G-37": {type:Number, default:16.65},
  "B-37": {type:Number, default:16.65},
  "G-4_5": {type:Number, default:4.5},
  "G-30": {type:Number, default:13.5},
  "B-30": {type:Number, default:13.5},
  "B-40": {type:Number, default:18},
  "G-40": {type:Number, default:18},
  "Rojo": {type:Number, default:40},

}, {_id: false});

const infoContenedorSchema = new Schema({
  clienteInfo: {type: Schema.Types.ObjectId, ref: Clientes},
  nombreCliente: String,
  fechaCreacion:Date,
  fechaInicio: Date,
  fechaFinalizado: Date,
  tipoFruta: String,
  tipoEmpaque: String,
  cerrado: Boolean,
  observaciones:String,
  desverdizado: Boolean,
  pesoCaja: pesoCajaSchema,
  fechaSalida: Date,
  urlInforme: String
});


const criteriosSchema = new Schema({
  nombre: String,
  cumplimiento: Boolean,
  observaciones: String
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
  criterios:{
    type: Map,
    of: criteriosSchema
  }
});

const listaEmpaqueSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  pallets: {
    type: Map,
    of: subSchema
  },
  infoContenedor: infoContenedorSchema,
  formularioInspeccionMula: schemaFormularioInspeccionMulas
});

listaEmpaqueSchema.post("save", function (doc){
  let record = new recordContenedores({
    nombreColeccion : "contenedores",
    documento: doc._id,
  });
  record.save().catch(error => console.error("Error al guardar recordContenedor", error.message));
});


const Contenedores = conn.model("Contenedor", listaEmpaqueSchema);


module.exports.Contenedores = Contenedores;

