const { obtenerIDs, guardarIDs } = require("./savegetDataJSON");

const guardarLote = async () => {

  const ids = await obtenerIDs();

  let fecha = new Date();
  let year = fecha.getFullYear().toString().slice(-2);
  let month = String(fecha.getMonth() + 1).padStart(2, "0");
  let enf = "EF1-" + year + month + ids.enf;

 
  ids.enf += 1;

  await  guardarIDs(ids);
  return enf;

};
const vaciarLote = async data => {
  try{ 

    const ids = await obtenerIDs();
    ids["ENF-vaciando"] = data.data.enf;
    ids["kilosVaciados"] = Number(data.data.canastillas) * Number(data.data.promedio);
    ids.kilosProcesados = 0;
    await guardarIDs(ids);
        
  } catch(e){
    console.error(e);
  }
};
const modificarHistorialVaciado = async data => {
  const ids = await obtenerIDs();
  if (ids["ENF-vaciando"] === data.data.enf) {
    ids.kilosVaciados -= Number(data.data.canastillas) * Number(data.data.promedio);
  }
  await guardarIDs(ids);
 
};
const reprocesarDescarteUnPredio = async data =>{
  try{
    const ids = await obtenerIDs();
    ids["ENF-vaciando"] = data.data.enf;
    ids["kilosVaciados"] = data.data.data;
    ids.kilosProcesados = 0;
    await guardarIDs(ids);

  }catch(e){
    console.error(e);
  }
};
const ReprocesarDescarteCelifrut = async data =>{
  try{
 
    const ids = await obtenerIDs();
    ids["ENF-vaciando"] = data.data.enf;
    ids["kilosVaciados"] = data.data.data;
    ids.kilosProcesados = 0;
    await guardarIDs(ids);

  }catch(e){
    console.error(e);
  }
};

module.exports = {
  guardarLote,
  vaciarLote,
  modificarHistorialVaciado,
  reprocesarDescarteUnPredio,
  ReprocesarDescarteCelifrut
};
