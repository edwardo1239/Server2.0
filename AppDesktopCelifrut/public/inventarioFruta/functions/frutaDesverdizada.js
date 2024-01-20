const { obtenerIDs, guardarIDs } = require("./savegetDataJSON");


const procesarDesverdizado = async data =>{
  try{ 
    const ids = await obtenerIDs();
    ids["ENF-vaciando"] = data.data.enf;
    ids["kilosVaciados"] = Number(data.data.canastillas) * Number(data.promedio);
    ids.kilosProcesados = 0;
    await guardarIDs(ids);
  } catch(e){
    console.error(e);
  }
};

module.exports = {
  procesarDesverdizado
};