const apiLotes = {
  modificar_lote: async (data, client) => {
    const query =  `INSERT INTO record_lotes (usuario, fecha, record, tipo) 
                        VALUES ($1, $2, $3, $4) RETURNING *`;
  
    return new Promise ((resolve, reject) => {
      client.query(query, [
        data.user,
        new Date(),
        data.record,
        data.tipo
      ], (err, ) => {
        if(err){
          console.error(err);
          reject(new Error(err));
          return;
        }
        resolve({status:200, message:"Record guardado con éxito"});
        return;
          
      });
    });
  }
};

module.exports.apiLotes = apiLotes;