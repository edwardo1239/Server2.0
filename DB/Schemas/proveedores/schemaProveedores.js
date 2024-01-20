require("dotenv").config();
const mongoose = require("mongoose");
const { recordProveedores } = require("./schemaRecordProveedores");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);


const PredioSchema = new Schema({
  PREDIO: { type: String, required: true },
  ICA: String,
  "CODIGO INTERNO": { type: String, required: true },
  GGN: String,
  "FECHA VENCIMIENTO GGN": String,
  N: String,
  L: String,
  M: String,
  PROVEEDORES: String,
  DEPARTAMENTO: String,
  urlArchivos: [String]
});

PredioSchema.post("save", function (doc) {
  let record = new recordProveedores({
    nombreColeccion: "Proveedores",
    operacionRealizada: doc._operationType,
    nombreProveedor: doc._nombreProveedor,
    documento: doc,
    fecha: new Date(),
  });
  
  record.save()
    .then(() => console.log("Registro guardado correctamente"))
    .catch(err => console.error("Error al guardar el registro:", err));
   
});

const Proveedores = conn.model("Proveedor", PredioSchema);

module.exports.Proveedores = Proveedores;