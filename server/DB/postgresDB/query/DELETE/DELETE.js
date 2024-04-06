const apiDELETE = {
  deleteUser: async (data, client) => {
    const id = data.data;
    const query =  `DELETE FROM usuarios
                    WHERE usuario_id = $1`;
    return new Promise((resolve, reject) => {
      client.query(query, [id], (err, res) => {
        if(err){
          console.error(err);
          reject(new Error(err));
        }
        if(res.rowCount > 0){
          resolve({status:200, message:"Ok", data: res.rows});
          return;
        } else {
          resolve( {status:403, message:"No se ha eliminado el usuario"});
          return;
        }
      });
    });
  },
};

module.exports.apiDELETE = apiDELETE;