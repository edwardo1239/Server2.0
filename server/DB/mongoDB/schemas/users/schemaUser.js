const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection("mongodb://localhost:27017/develop");

const usuariosSchema = new Schema({
  user:String,
  password:String,
  permisos:[String],
  cargo: String,
  correo: String
});

const UserDev = conn.model("User", usuariosSchema);

module.exports.UserDev = UserDev;