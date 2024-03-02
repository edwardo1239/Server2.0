require("dotenv").config();
const { exec } = require("child_process");
const { connectPersonalDB, connectProcesoDB } = require("./configDB");
const { apiPersonal, apiProceso } = require("./reduce");
const { iniciarRedisDB } = require("../../DB_redis/config/init");

exec("mongod --port 27019 --dbpath ./DB/data", (error, stdout) => {
  if (error) {

    process.send(`Error al iniciar MongoDB: ${error}`);
    return;
  }
  process.send(`Resultado de MongoDB: ${stdout}`);
});

connectPersonalDB();
connectProcesoDB();

process.on("message", async (msg) => {
  try{
    const cliente  = await iniciarRedisDB();
    let userSession;
    if(msg.socket){
      userSession = await cliente.hGetAll(`${msg.socket}`);
      msg = {...msg, userSession: userSession};
    }
    if (msg.query === "personal") {
      const data = await apiPersonal[msg.fn](msg);
      process.send(data);
        
    } else if(msg.query === "proceso"){
      const data = await apiProceso[msg.fn](msg);
      process.send(data);
    }
  } catch(e){
    console.error("Error mongoDB init => ", e.message);
  }
});
