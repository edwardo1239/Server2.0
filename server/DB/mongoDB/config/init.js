
const { exec } = require("child_process");

const { api } = require("./reducer");
const { connectPersonalDB, connectProcesoDB } = require("./configDB");



exec("mongod --port 27017 --dbpath ./serverless/DB/data", (error, stdout) => {
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
    await api[msg.fn](msg);
  } catch(e){
    console.error("Error mongoDB init => ", e.message);
  }
});

