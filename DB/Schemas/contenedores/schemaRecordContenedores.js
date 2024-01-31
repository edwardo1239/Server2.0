require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PROCESO);


const HistorialContenedoresSchema = new Schema({
  nombreColeccion: String,
  fecha: {type:Date, expires: "60d", default: Date.now},
  documento: String
});



const recordContenedores = conn.model("recordContenedor", HistorialContenedoresSchema);


module.exports.recordContenedores = recordContenedores;

