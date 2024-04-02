const apiGET = {
  getOperarios: async (data, client) => {
    const query =  `SELECT nombre, apellido, id FROM operarios`;
    return new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
        if(err){
          console.error(err);
          reject(new Error(err));
        }
        if(res.rowCount > 0){
          resolve({status:200, message:"Ok", data: res.rows});
          return;
        } else {
          resolve( {status:403, message:"No se pudo obtener los datos"});
          return;
        }
      });
    });
  }
};

module.exports.apiGET = apiGET;