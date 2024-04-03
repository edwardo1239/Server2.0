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
  },
  getUsers: async (data, client) =>{
    const query = `SELECT 
                    usuarios.*, 
                    cargos.nombre AS nombre_cargo, 
                    ARRAY_AGG(permisos.nombre) AS nombres_permisos
                  FROM 
                    usuarios
                  LEFT JOIN 
                    cargos ON usuarios.cargo_id = cargos.cargo_id
                  LEFT JOIN 
                    permisos ON usuarios.permisos_id @> ARRAY[permisos.permiso_id]
                  GROUP BY 
                    usuarios.usuario_id,
                    cargos.nombre;`;
    return new Promise((resolve, reject) => {
      client.query(query, (err, res) =>{
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