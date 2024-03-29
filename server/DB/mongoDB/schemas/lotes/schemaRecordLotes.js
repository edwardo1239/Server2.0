const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGODB_PROCESO);


const HistorialLotesSchema = new Schema({
  operacionRealizada: String,
  documento: Object,
  fecha: {type: Date, default: Date.now, index: {expires: "30d"}},
},{timestamps: true});


const recordLotes = conn.model("recordLote", HistorialLotesSchema);


module.exports.recordLotes = recordLotes;

