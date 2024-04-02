const apiPOST = {
  ingresar_volante_calidad: async (data, client) => {
    const { id, tipoFruta, unidadesRevisadas, numeroDefectos} = data.data;
    const query =  `INSERT INTO volante_calidad (id_operario, tipo_fruta, unidades_revisadas, numero_defectos, fecha_ingreso) 
                      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    return new Promise((resolve, reject) => {
      client.query(query, [id, tipoFruta, unidadesRevisadas, numeroDefectos, new Date()], (err, res) =>{
        if(err){
          console.error(err);
          reject(new Error(err));
        }
        if(res.rowCount > 0){
          resolve({status:200, message:"Volante guardado con exito"});
          return;
        } else {
          resolve( {status:401, message:"No se pudo agregar el elemento"});
          return;
        }
      });
    });
  }
};

module.exports.apiPOST = apiPOST;