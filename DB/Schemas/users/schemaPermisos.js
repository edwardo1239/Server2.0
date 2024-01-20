require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PERSONAL);

const permisosSchema = new Schema({
  permisos:[String],
  cargo:[String]
});

const permisosUsusario = conn.model("permiso", permisosSchema);


module.exports.permisosUsusario = permisosUsusario;