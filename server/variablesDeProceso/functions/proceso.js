const descarteTotal = async (descarte) => {
  try{
    const sum = Object.values(descarte).reduce((acu, descarte) => acu += descarte, 0);
    return sum;
  } catch (e){
    console.error(`Error en la fncion descarteTotal que calcula el descarte: ${e}`);
    return 0;
  }
};


module.exports = {
  descarteTotal,
};