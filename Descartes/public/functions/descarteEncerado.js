
const { obtenerIDs, guardarIDs } = require("../../utils/variablesProceso");

const obtenerLoteVaciandoEncerado= async () => {
  try{
    const ids = await obtenerIDs();
    const out = {
      enf:ids["ENF-vaciando"],
      nombrePredio: ids.nombrePredio,
      tipoFruta: ids.tipoFruta
    };
    return out;
  } catch(e){
    console.error(e);
  }
};
const ingresarDescarteEncerado = async data => {
  try{
    process.send({
      fn:data.fn,
      query:"proceso",
      data:data.data
    });
    return new Promise((resolve) =>{
      process.on("message", async (msg) => {
        if(msg.fn === data.fn){
          const ids = await obtenerIDs();
          ids.kilosProcesados = Object.values(data).reduce((acu, item) => {
            return typeof item === "number" ? acu + item: acu;
          }, 0);
            
          await guardarIDs(ids);
          resolve({status:200});
        }
      });
    });
  } catch(e){
    console.error(e);
  }
};
  

module.exports = {
  obtenerLoteVaciandoEncerado,
  ingresarDescarteEncerado
};