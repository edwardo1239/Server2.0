require("dotenv").config();
const { exec } = require("child_process");
const { connectPersonalDB, connectProcesoDB } = require("./configDB");
const { apiPersonal, apiProceso } = require("./reduce");

exec("mongod --port 27019 --dbpath ./DB/data", (error, stdout) => {
  if (error) {
    process.send(`Error al iniciar MongoDB: ${error}`);
    return;
  }
  process.send(`Resultado de MongoDB: ${stdout}`);
});

connectPersonalDB();
connectProcesoDB();

process.on("message", (msg) => {
  if (msg.query === "personal") {
    apiPersonal[msg.fn](msg)
      .then((data) => process.send(data))
      .catch((error) => process.send(error));
  } else if(msg.query === "proceso"){
    apiProceso[msg.fn](msg)  
      .then((data) => process.send(data))
      .catch((error) => process.send(error));
  }
});
