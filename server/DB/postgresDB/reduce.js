const { apiDELETE } = require("./query/DELETE/DELETE");
const { apiGET } = require("./query/GET/GET");
const { apiPOST } = require("./query/POST/POST");
const { apiPut } = require("./query/PUT/PUT");

const api = {
  Login: async (data, client) => {
    const { user, password } = data.data;
    const query = 'SELECT * FROM "usuarios" WHERE usuario = $1';
    const values = [user];

    return new Promise((resolve, reject) => {
      client.query(query, values, async (err, res) => {
        if (err) {
          reject(new Error("Error al realizar la consulta", err.message));
        } else {
          if(!res.rows || res.rows.length === 0){
            resolve({...data, response:{status:401, message:"Error usuario no encontrado"}});
            return;
          }
          if(res.rows[0].contrasenna === password){
            // se obtienen los permisos
            const permisosQuery = 'SELECT nombre FROM "permisos" WHERE permiso_id = ANY($1)';
            const permisosValues = [res.rows[0].permisos_id];
            const permisosObj = await client.query(permisosQuery, permisosValues);
            const permisos = permisosObj.rows.map(permiso => permiso.nombre);
            //Obtiene el cargo
            const cargoQuery = 'SELECT * FROM "cargos" WHERE cargo_id = $1';
            const cargoValue = [res.rows[0].cargo_id];
            const cargo = await client.query(cargoQuery, cargoValue);
            resolve({...data, response:{status:200, message:"Ok", data:{user:user, cargo:cargo.rows[0].nombre, permisos:permisos}}});
            return;
          } else {
            resolve({...data, response:{status:402, message:"Error contraseña incorrecta"}});
            return;
          }
        }
      });
    });
  },
  PUT: async (data, client) => {
    const response = await apiPut[data.action](data, client);
    return{...data, response:response};
  },
  GET: async (data, client) => {
    const response = await apiGET[data.action](data, client);
    return {...data, response:response};
  },
  POST: async (data, client) => {
    const response = await apiPOST[data.action](data, client);
    return {...data, response:response};
  },
  DELETE: async (data, client) => {
    const response = await apiDELETE[data.action](data, client);
    return {...data, response:response};
  },
};

module.exports.api = api;