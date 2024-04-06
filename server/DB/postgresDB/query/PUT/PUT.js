const apiPut = {
  addOperario: async (data, client) => {
    const { 
      nombre, 
      apellido, 
      fechaNacimiento, 
      genero, 
      direccion, 
      telefono, 
      email } = data.data;
    const query =  `INSERT INTO operarios (nombre, apellido, fecha_nacimiento, genero, direccion, telefono, correo_electronico, estado) 
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    return new Promise ((resolve, reject) => {
      client.query(query, [nombre, apellido, fechaNacimiento, genero, direccion, telefono, email, "activo"], (err, res) => {
        if(err){
          console.error(err);
          reject(new Error(err));
        }
        if(res.rowCount > 0){
          resolve({status:200, message:"Operario agregado con éxito"});
          return;
        } else {
          resolve( {status:403, message:"No se pudo agregar el operario"});
          return;
        }
      });
    });
  },
  addUser: async (data, client) => {
    console.log(data);
    const { 
      usuario, 
      contrasenna, 
      cargo, 
      nombre, 
      apellido, 
      genero, 
      cumpleannos,
      direccion,
      telefono,
      email,
      estado,
      permisos
    } = data.data;
 
    const query =  
      `INSERT INTO 
        usuarios (usuario, contrasenna, cargo_id, nombre, apellido, genero, cumpleannos, direccion, telefono, email, estado, permisos_id, add_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;

    return new Promise ((resolve, reject) => {
      client.query(query, [     
        usuario === "" ? null : usuario, 
        contrasenna === "" ? null : contrasenna, 
        cargo === "" ? null : Number(cargo), 
        nombre === "" ? null : nombre, 
        apellido === "" ? null : apellido, 
        genero === "" ? null : genero, 
        cumpleannos === "" ? null : new Date(cumpleannos),
        direccion === "" ? null : direccion,
        telefono === "" ? null : telefono,
        email === "" ? null : email,
        estado === "" ? null : estado,
        permisos === "" ? null : permisos,
        new Date()], (err, res) => {
        if(err){
          console.error(err);
          reject(new Error(err));
        }
        if(res.rowCount > 0){
          resolve({status:200, message:"Usuario agregado con éxito"});
          return;
        } else {
          resolve( {status:403, message:"No se pudo agregar el usuario"});
          return;
        }
      });
    });
  },
};

module.exports.apiPut = apiPut;