const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "Edwar",
  password: "calidadstopyse",
  database: "users"
});

client.connect(err => {
  if (err) {
    console.error("Error de conexión", err.stack);
  } else {
    console.log("Conectado a PostgreSQL");
  }
});

// client.query('select * FROM "usuarios"', (err, res) => {
//   if (err) {
//     console.error("Error al realizar la consulta", err.stack);
//   } else {
//     console.log(res.rows);
//   }
// });
  
