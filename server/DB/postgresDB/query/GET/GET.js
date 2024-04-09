const apiGET = {
  getOperarios: async (data, client) => {
    const query =  `SELECT nombre, apellido, id 
                    FROM operarios`;
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
  getSeleccionadoras: async (data, client) => {
    const query =  `SELECT nombre, apellido, id 
                    FROM operarios
                    WHERE cargo = 'Seleccionadora'`;
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
  },
  getCargos: async (data, client) => {
    const query =  `SELECT * FROM cargos`;
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
  getPermisos: async (data, client) => {
    const query =  `SELECT * FROM permisos`;
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
  getVolanteCalidad: async (data, client) => {
    console.log(data);
    let query =  `SELECT 
                      volante_calidad.*,
                      operarios.nombre,
                      operarios.apellido
                    FROM volante_calidad
                    LEFT JOIN
                      operarios ON volante_calidad.id_operario = operarios.id
                    WHERE 1=1 `;
    const queryParams = [];
    let paramCount = 1;

    if (data.tipo_fruta !== "") {
      query += ` AND volante_calidad.tipo_fruta = $${paramCount}`;
      queryParams.push(data.tipo_fruta);
      paramCount++;
    }
    if (data.fecha_inicio && data.fecha_inicio !== "" && data.fecha_fin && data.fecha_fin !== "") {
      query += ` AND volante_calidad.fecha_ingreso BETWEEN $${paramCount} AND $${paramCount + 1}`;
      queryParams.push(data.fecha_inicio, data.fecha_fin);
      paramCount += 2;
    }
    if (data.page) {
      const offset = (data.page - 1) * 50; // Calcula el offset basado en la página
      query += ` ORDER BY volante_calidad.fecha_ingreso DESC LIMIT 50 OFFSET $${paramCount}`;
      queryParams.push(offset);
    }
    return new Promise((resolve, reject) => {
      client.query(query, queryParams, (err, res) => {
        if(err){
          console.error(err);
          reject(new Error(err));
        }
        resolve({status:200, message:"Ok", data: res.rows});
        return;
      });
    });
  },
};

module.exports.apiGET = apiGET;