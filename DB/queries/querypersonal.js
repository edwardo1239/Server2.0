const { registroHigiene } = require("../Schemas/formatosCalidad/schemaHigiene");
const { ControlDePlagas } = require("../Schemas/formatosCalidad/schemaControlDePlagas");
const { LimpiezaDesinfeccionPlanta } = require("../Schemas/formatosCalidad/schemaLimpiezaDesinfeccionPlanta");
const { LimpiezaMensual } = require("../Schemas/formatosCalidad/schemalimpiezaMensual");
const { User } = require("../Schemas/users/schemaUser");
const { permisosUsusario } = require("../Schemas/users/schemaPermisos");
const { registroVolanteCalidad } = require("../Schemas/formatosCalidad/schemaVolanteCalidad");
const { default: mongoose } = require("mongoose");

const logIn = async (data) => {
  try{
    const user = await  User.findOne({user:data.data.user});
    if(user === null){
      data.data = 401;
      return data;
    } 
    if(data.data.password !== user.password){
      data.data = 402;
      return data;
    } 
    data.data = user;
    return data;
  } catch(e){
    process.send(`${e.name}:${e.message}`);
  }
}; 
const obtenerPermisosUsuario = async (data) => {
  try{
    const permisos = await permisosUsusario.find();
    data.data = permisos[0];
    return data;
  } catch(e) {
    console.error(e);
  }
};
const crearUsuario = async (data) => {
  try{
    const user = new User({
      user: data.data.data.usuario,
      password: data.data.data.contraseña,
      cargo: data.data.data.cargo,
      permisos: data.data.data.permisos,
      correo: data.data.data.correo
    });
    await user.save();
    return data;
  } catch (e) {
    console.error(e);
  }
};
const obtenerRegistroHigiene = async (data) => {
  try{
    let registros;
    if(data.data.data){
      const fechaInicio = new Date(data.data.data);
      const fechaFin = new Date(data.data.data+"T23:59:59Z");
      console.log(fechaFin);
      registros = await registroHigiene.find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFin
        }
      });
    } else {
      registros = await registroHigiene.find().sort({_id:-1}).limit(100);
    }
    data.data = registros;
    return data;
  }catch(e){
    console.error(e);
  }
};
const obtenerRegistroControlPlagas = async (data) => {
  try{
    let registros;
    if(data.data.data){
      const date = new Date(data.data.data);
      const fechaInicio = new Date(date.getFullYear(), date.getMonth(), 1);
      const fechaFin = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
      registros = await ControlDePlagas.find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFin
        }
      });
    } else {
      registros = await ControlDePlagas.find().sort({_id:-1}).limit(100);
    }
    data.data = registros;
    return data;
  }catch(e){
    console.error(e);
  }
};
const obtenerRegistroLimpiezaDesinfeccionPlanta = async (data) => {
  try{
    let registros;
    if(data.data.data){
      const fechaInicio = new Date(data.data.data);
      const fechaFin = new Date(data.data.data+"T23:59:59Z");
      registros = await LimpiezaDesinfeccionPlanta.find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFin
        }
      });
    } else {
      registros = await LimpiezaDesinfeccionPlanta.find().sort({_id:-1}).limit(100);
    }
    data.data = registros;

    return data;
  }catch(e){
    console.error(e);
  }
};
const obtenerRegistroLimpiezaMensual = async (data) => {
  try{
    let registros;

    if(data.data.data){
      const date = new Date(data.data.data);
      const fechaInicio = new Date(date.getFullYear(), date.getMonth(), 1);
      const fechaFin = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      registros = await LimpiezaMensual.find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFin
        }
      });
    } else {
      registros = await LimpiezaMensual.find().sort({_id:-1}).limit(100);
    }
    data.data = registros;

    return data;
  }catch(e){
    console.error(e);
  }
};
const obtenerVolanteCalidad = async (data) => {
  try{
    let registros;
    if(Object.prototype.hasOwnProperty.call(data.data.data, "fechaInicio")){
      const fechaInicio = new Date(data.data.data.fechaInicio);
      const fechaFin = new Date(data.data.data.fechaFin);
      registros = await registroVolanteCalidad.find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFin
        }
      });
    }
    else {
      registros = await registroVolanteCalidad.find().sort({_id:-1}).limit(100);
    }
    data.data = registros;
    return data;
  } catch(e) {
    console.error(e);
  }
};
const obtenerCuentas = async data => {
  try {
    const cuentas = await User.find();
    data.data = cuentas;
    return data;
  } catch (e){
    console.error(e);
  }
};
const eliminarCuenta = async data => {
  try {
    const id = new mongoose.Types.ObjectId(data.data.id);
    const cuenta = await User.findById(id);

    await cuenta.deleteOne();
    const cuentas = await User.find();
    data.data = cuentas;
    return data;
  } catch(e){
    console.error(e);
  }
};
const editarCuenta = async data => {
  try{
    const info = data.data.formData;
    const id = new mongoose.Types.ObjectId(info._id);
    const cuenta = await User.findById(id);

    cuenta.user = info.user;
    cuenta.password = info.password;
    cuenta.cargo = info.cargo;
    cuenta.correo = info.correo;
    cuenta.permisos = info.permisos;

    await cuenta.save();
    const cuentas = await User.find();
    data.data = cuentas;
    return data;
  } catch(e){
    console.error(e);
  }
};

module.exports = {
  logIn,
  obtenerRegistroHigiene,
  obtenerRegistroControlPlagas,
  obtenerRegistroLimpiezaDesinfeccionPlanta,
  obtenerRegistroLimpiezaMensual,
  obtenerPermisosUsuario,
  crearUsuario,
  obtenerVolanteCalidad,
  obtenerCuentas,
  eliminarCuenta,
  editarCuenta
};