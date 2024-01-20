require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const conn = mongoose.createConnection(process.env.MONGO_URL_PERSONAL);

const usuariosSchema = new Schema({
  user:String,
  password:String,
  permisos:[String],
  cargo: String,
  correo: String
});

const User = conn.model("User", usuariosSchema);

// connectPersonalDB().then((conn) => {
//     const User = conn.model('User', usuariosSchema);
//     module.exports.User = User;
//   });
module.exports.User = User;