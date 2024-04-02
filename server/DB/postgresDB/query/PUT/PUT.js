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
  }
};

module.exports.apiPut = apiPut;