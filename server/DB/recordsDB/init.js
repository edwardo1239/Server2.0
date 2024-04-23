const { Client } = require("pg");
const { logger } = require("../../error/config");
const { api } = require("./reduce");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "Edwar",
  password: "calidadstopyse",
  database: "records"
});

client.connect(err => {
  if (err) {
    console.error("Error de conexión", err.stack);
  } else {
    console.log("Conectado a PostgreSQL");
  }
});
  
process.on("message", async (msg) => {
  try{
    const response = await api[msg.fn](msg, client);
    process.send(response);
  } catch(e){
    logger.error("Error postgresDB init => ", e.message);
    console.error("Error", e.message);
    return {response:{status:504, message:e.message}};
  }
});

// Manejar el evento de error en otro lugar de tu aplicación
process.on("errorOccured", (error) => {
  // Aquí podrías enviar una respuesta al cliente u otra acción relacionada con el manejo de errores.
  console.error("Error occurred:", error.message);
});
