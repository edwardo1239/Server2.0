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
  },
  ingresar_higiene_personal: async (data, client) => {
    const { 
      responsable, 
      colaborador_id, 
      botas, 
      pantalon,
      camisa,
      tapaoidos,
      cofia,
      tapabocas,
      unnas_cortas,
      accesorios,
      barba,
      maquillaje,
      estado_de_salud
    } = data.data;
    const query =  `INSERT INTO 
                      higiene_personal (
                        responsable,
                        operario_id,
                        botas,
                        pantalon,
                        camisa,
                        tapaoidos,
                        cofia,
                        tapabocas,
                        unnas_cortas,
                        accesorios,
                        barba,
                        maquillaje,
                        estado_salud,
                        fecha_ingreso
                      ) 
                      VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`;
    return new Promise((resolve, reject) => {
      client.query(query, [
        responsable, 
        colaborador_id, 
        botas, 
        pantalon,
        camisa,
        tapaoidos,
        cofia,
        tapabocas,
        unnas_cortas,
        accesorios,
        barba,
        maquillaje,
        estado_de_salud, 
        new Date()], (err, res) =>{
        if(err){
          console.error(err);
          reject(new Error(err));
        }
        if(res.rowCount > 0){
          resolve({status:200, message:"Higiene personal guardado con exito"});
          return;
        } else {
          resolve( {status:401, message:"No se pudo agregar el elemento"});
          return;
        }
      });
    });
  },
  ingresar_control_plagas_control: async (data, client) => {
    const responsable = data.data.responsable;

    for(const item of data.data.data){
      const values =  [responsable, item.elemento, item.cumple, item.observaciones, item.acciones, new Date()];

      const query = {
        text: "INSERT INTO control_plagas_control (responsable, elemento, cumple, observaciones, acciones, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6)",
        values: values // Aplanar el array de arrays
      };
      await client.query(query);
    }
    return {response:{status:200, message:"Ok"}};
  },
  ingresar_control_plagas_cebo: async (data, client) => {
    const {responsable, elemento, cumple, observaciones, acciones} = data.data;
    const values =  [responsable, elemento, cumple, observaciones, acciones, new Date()];

    const query = {
      text: "INSERT INTO control_plagas_cebo (responsable, elemento, cumple, observaciones, acciones, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6)",
      values: values // Aplanar el array de arrays
    };
    await client.query(query);
    return {response:{status:200, message:"Ok"}};
  },
  ingresar_control_plagas_hallazgos: async (data, client) => {
    const responsable = data.data.responsable;

    for(const item of data.data.data){
      const values =  [responsable, item.elemento, item.cumple, item.observaciones, item.acciones, new Date()];

      const query = {
        text: "INSERT INTO control_plagas_hallazgos (responsable, elemento, cumple, observaciones, acciones, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6)",
        values: values // Aplanar el array de arrays
      };
      await client.query(query);
    }
    return {response:{status:200, message:"Ok"}};
  },
  ingresar_limpieza_postcosecha: async (data, client) => {
    console.log(data);
    const responsable = data.data.responsable;

    for(const item of data.data.data){
      const values =  [responsable, item.area, item.elemento, item.cumple, item.observaciones, new Date()];

      const query = {
        text: "INSERT INTO limpieza_postcosecha (responsable, area, elemento, cumple, observaciones, fecha_ingreso) VALUES ($1, $2, $3, $4, $5, $6)",
        values: values // Aplanar el array de arrays
      };
      await client.query(query);
    }
    return {response:{status:200, message:"Ok"}};
  },
};

module.exports.apiPOST = apiPOST;