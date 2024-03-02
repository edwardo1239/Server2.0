const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection("mongodb://localhost:27017/develop");

const permisosSchema = new Schema({
  permisos:[String],
  cargo:[String]
});

const permisosUsusarioDev = conn.model("permiso", permisosSchema);


module.exports.permisosUsusarioDev = permisosUsusarioDev;