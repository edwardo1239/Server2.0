const  fs  = require("fs");
const { obtenerIDs } = require("../../utils/variablesProceso");
const obtenerDataContenedor = async data => {
  try{
    process.send({
      fn:data.fn,
      query:"proceso"
    });
    return new Promise((resolve) =>{
      process.on("message", (msg) => {
        if(msg.fn === data.fn){
          resolve({status:200, data:msg.data});
        }
      });
    });
  }catch(e){
    console.error(e);
  }
};
const obtenerCajasSinPallet = async () => {
  try{
    const pathCajasSinpallet = "./ListaDeEmpaque/data/cajasSinPallet.json";
    const cajasSinPalletJSON = fs.readFileSync(pathCajasSinpallet);
    const cajasSinPallet = JSON.parse(cajasSinPalletJSON);
    return {status:200, data:cajasSinPallet};
  } catch(e){
    console.error(e);
  }
};
const guardarCajasSinpallet = async (cajasSinPallet) => {
  try{
    const pathCajasSinpallet = "./ListaDeEmpaque/data/cajasSinPallet.json";
    let cajasSinPalletJSON = JSON.stringify(cajasSinPallet);
    fs.writeFileSync(pathCajasSinpallet, cajasSinPalletJSON);
  }catch(e){
    console.error(e);
  }
};
const obtenerLoteVaciando = async () =>{
  try{
    const ids = await obtenerIDs();
    return  {enf:ids["ENF-vaciando"], nombrePredio:ids.nombrePredio, tipoFruta:ids.tipoFruta};
  }catch(e){
    console.error(e);
  }
};
const guardarSettingsPallet = async data =>{
  try{
    process.send({
      fn:data.fn,
      query:"proceso",
      data: data.data
    });
    return new Promise((resolve) =>{
      process.on("message", (msg) => {
        if(msg.fn === data.fn){
          resolve({status:200, data:msg.data});
        }
      });
    });
  }catch(e){
    console.error(e);
  }
};
const guardarItem = async data => {
  try{
    process.send({
      fn:data.fn,
      query:"proceso",
      data: data.data
    });
    return new Promise((resolve) =>{
      process.on("message", (msg) => {
        if(msg.fn === data.fn){
          resolve({status:200, data:msg.data});
        }
      });
    });
  }catch(e){
    console.error(e);
  }
};
const eliminarItem = async data => {
  try{
    process.send({
      fn:data.fn,
      query:"proceso",
      data: data.data
    });
    return new Promise((resolve) =>{
      process.on("message", (msg) => {
        if(msg.fn === data.fn){
          resolve({status:200, data:msg.data});
        }
      });
    });
  }catch(e){
    console.error(e);
  }
};
const moverItem = async data =>{
  try{
    process.send({
      fn:data.fn,
      query:"proceso",
      data: data.data
    });
    return new Promise((resolve) =>{
      process.on("message", (msg) => {
        if(msg.fn === data.fn){
          resolve({status:200, data:msg.data});
        }
      });
    });
  }catch(e){
    console.error(e);
  } 
};
const restarItem = async data =>{
  try{
    process.send({
      fn:data.fn,
      query:"proceso",
      data: data.data
    });
    return new Promise((resolve) =>{
      process.on("message", (msg) => {
        if(msg.fn === data.fn){
          resolve({status:200, data:msg.data});
        }
      });
    });
  }catch(e){
    console.error(e);
  } 
};
const liberacionPallet = async data =>{
  try{
    process.send({
      fn:data.fn,
      query:"proceso",
      data: data.data
    });
    return new Promise((resolve) =>{
      process.on("message", (msg) => {
        if(msg.fn === data.fn){
          resolve({status:200, data:msg.data});
        }
      });
    });
  }catch(e){
    console.error(e);
  } 
};
const cerrarContenedor = async data =>{
  try{
    process.send({
      fn:data.fn,
      query:"proceso",
      data: data.data
    });
    return new Promise((resolve) =>{
      process.on("message", (msg) => {
        if(msg.fn === data.fn){
          resolve({status:200, data:msg.data});
        }
      });
    });
  }catch(e){
    console.error(e);
  } 
};

module.exports = {
  obtenerDataContenedor,
  obtenerCajasSinPallet,
  obtenerLoteVaciando,
  guardarSettingsPallet,
  guardarItem,
  guardarCajasSinpallet,
  eliminarItem,
  moverItem,
  restarItem,
  liberacionPallet,
  cerrarContenedor
};