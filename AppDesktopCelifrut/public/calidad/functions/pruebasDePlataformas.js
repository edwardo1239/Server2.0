const obtenerLotesCalidadInterna = async data => {
  return new Promise((resolve, reject) => {
    try {
      process.send({ ...data, query: "proceso" });
      process.on("message", (clientes) => {
        if(clientes.fn === data.fn){
          resolve({status:200, data:clientes.data});
        }
      });
    } catch (e) {
      reject({status:400, data:e});
    }
  });
};

module.exports = {
  obtenerLotesCalidadInterna
};