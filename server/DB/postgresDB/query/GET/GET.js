const apiGET = {
  getOperarios: async (data, client) => {
    const query = `SELECT nombre, apellido, id 
                    FROM operarios`;
    return new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
        if (res.rowCount > 0) {
          resolve({ status: 200, message: "Ok", data: res.rows });
          return;
        } else {
          resolve({ status: 403, message: "No se pudo obtener los datos" });
          return;
        }
      });
    });
  },
  getSeleccionadoras: async (data, client) => {
    const query = `SELECT nombre, apellido, id 
                    FROM operarios
                    WHERE cargo = 'Seleccionadora'`;
    return new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
        if (res.rowCount > 0) {
          resolve({ status: 200, message: "Ok", data: res.rows });
          return;
        } else {
          resolve({ status: 403, message: "No se pudo obtener los datos" });
          return;
        }
      });
    });
  },
  getUsers: async (data, client) => {
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
      client.query(query, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
        if (res.rowCount > 0) {
          resolve({ status: 200, message: "Ok", data: res.rows });
          return;
        } else {
          resolve({ status: 403, message: "No se pudo obtener los datos" });
          return;
        }
      });
    });
  },
  getCargos: async (data, client) => {
    const query = `SELECT * FROM cargos`;
    return new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
        if (res.rowCount > 0) {
          resolve({ status: 200, message: "Ok", data: res.rows });
          return;
        } else {
          resolve({ status: 403, message: "No se pudo obtener los datos" });
          return;
        }
      });
    });
  },
  getPermisos: async (data, client) => {
    const query = `SELECT * FROM permisos`;
    return new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
        if (res.rowCount > 0) {
          resolve({ status: 200, message: "Ok", data: res.rows });
          return;
        } else {
          resolve({ status: 403, message: "No se pudo obtener los datos" });
          return;
        }
      });
    });
  },
  getVolanteCalidad: async (data, client) => {
    let query = `SELECT 
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
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
        resolve({ status: 200, message: "Ok", data: res.rows });
        return;
      });
    });
  },
  getHigienePersonal: async (data, client) => {
    let query = `SELECT 
                      higiene_personal.*,
                      operarios.nombre,
                      operarios.apellido
                    FROM higiene_personal
                    LEFT JOIN
                      operarios ON higiene_personal.operario_id = operarios.id
                    WHERE 1=1 `;
    const queryParams = [];
    let paramCount = 1;

    if (data.fecha_inicio && data.fecha_inicio !== "" && data.fecha_fin && data.fecha_fin !== "") {
      query += ` AND higiene_personal.fecha_ingreso BETWEEN $${paramCount} AND $${paramCount + 1}`;
      queryParams.push(data.fecha_inicio, data.fecha_fin);
      paramCount += 2;
    }

    if (data.page) {
      const offset = (data.page - 1) * 50; // Calcula el offset basado en la página
      query += ` ORDER BY higiene_personal.fecha_ingreso DESC LIMIT 50 OFFSET $${paramCount}`;
      queryParams.push(offset);
    }

    return new Promise((resolve, reject) => {
      client.query(query, queryParams, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
        resolve({ status: 200, message: "Ok", data: res.rows });
        return;
      });
    });
  },
  get_control_plagas_control: async (data, client) => {
    const offset = (data.page - 1) * 50;
    let query = `SELECT * 
                  FROM control_plagas_control`;
           
    let paramCount = 1;
    const queryParams = [];
    let whereClauseAdded = false; 

    if (data.responsable !== "") {
      query += ` WHERE LOWER(responsable) LIKE '%' || LOWER($${paramCount}) || '%'`;
      queryParams.push(data.responsable.toLowerCase());
      paramCount++;
      whereClauseAdded = true; 
    }

    if (data.area !== "") {
      query += whereClauseAdded ? ` AND` : ` WHERE`;
      query += ` control_plagas_control.elemento = $${paramCount}`;
      queryParams.push(data.area);
      paramCount++;
      whereClauseAdded = true;

    }

    if (data.fecha !== "") {
      query += whereClauseAdded ? ` AND` : ` WHERE`;
      query += ` control_plagas_control.fecha_creacion BETWEEN $${paramCount} AND $${paramCount + 1}`;
      queryParams.push(data.fecha_inicio, new Date());
      paramCount += 2;
    }

    query += ` ORDER BY fecha_creacion DESC
    LIMIT 50
    OFFSET $${paramCount}`;

    queryParams.push(offset);

    return new Promise((resolve, reject) => {
      client.query(query,queryParams, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
      
        resolve({ status: 200, message: "Ok", data: res.rows });
        return;
   
      });
    });
  },
  get_control_plagas_cebo: async (data, client) => {
    const offset = (data.page - 1) * 50;
    let query = `SELECT * 
                  FROM control_plagas_cebo`;
           
    let paramCount = 1;
    const queryParams = [];
    let whereClauseAdded = false; 

    if (data.responsable !== "") {
      query += ` WHERE LOWER(responsable) LIKE '%' || LOWER($${paramCount}) || '%'`;
      queryParams.push(data.responsable.toLowerCase());
      paramCount++;
      whereClauseAdded = true; 
    }

    if (data.fecha !== "") {
      query += whereClauseAdded ? ` AND` : ` WHERE`;
      query += ` control_plagas_cebo.fecha_creacion BETWEEN $${paramCount} AND $${paramCount + 1}`;
      queryParams.push(data.fecha_inicio, new Date());
      paramCount += 2;
      
    }

    query += ` ORDER BY fecha_creacion DESC
    LIMIT 50
    OFFSET $${paramCount}`;

    queryParams.push(offset);

    return new Promise((resolve, reject) => {
      client.query(query,queryParams, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
      
        resolve({ status: 200, message: "Ok", data: res.rows });
        return;
   
      });
    });
  },
  get_control_plagas_hallazgos: async (data, client) => {
    const offset = (data.page - 1) * 50;
    let query = `SELECT * 
                  FROM control_plagas_hallazgos`;
           
    let paramCount = 1;
    const queryParams = [];
    let whereClauseAdded = false; 

    if (data.responsable !== "") {
      query += ` WHERE LOWER(responsable) LIKE '%' || LOWER($${paramCount}) || '%'`;
      queryParams.push(data.responsable.toLowerCase());
      paramCount++;
      whereClauseAdded = true; 
    }

    if (data.area !== "") {
      query += whereClauseAdded ? ` AND` : ` WHERE`;
      query += ` control_plagas_hallazgos.elemento = $${paramCount}`;
      queryParams.push(data.area);
      paramCount++;
      whereClauseAdded = true;

    }

    if (data.fecha !== "") {
      query += whereClauseAdded ? ` AND` : ` WHERE`;
      query += ` control_plagas_hallazgos.fecha_creacion BETWEEN $${paramCount} AND $${paramCount + 1}`;
      queryParams.push(data.fecha_inicio, new Date());
      paramCount += 2;
    }

    query += ` ORDER BY fecha_creacion DESC
    LIMIT 50
    OFFSET $${paramCount}`;

    queryParams.push(offset);

    return new Promise((resolve, reject) => {
      client.query(query,queryParams, (err, res) => {
        if (err) {
          console.error(err);
          reject(new Error(err));
        }
      
        resolve({ status: 200, message: "Ok", data: res.rows });
        return;
   
      });
    });
  },
};

module.exports.apiGET = apiGET;