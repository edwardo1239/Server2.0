const { exec } = require("child_process");
const { api } = require("./reducer");
const { connectPersonalDB, connectProcesoDB } = require("./configDB");
const { logger } = require("../../../error/config");


const startMongoDB = () => {
  return new Promise((resolve, reject) => {
    exec("mongod --port 27017", (error, stdout) => {
      if (error) {
        reject(`Error al iniciar MongoDB: ${error}`);
      } else {
        resolve(`Resultado de MongoDB: ${stdout}`);
      }
    });
  });
};

const init = async () => {
  try {
    await startMongoDB();
    connectPersonalDB();
    connectProcesoDB();
  } catch (error) {
    console.error(error);
    logger.error(error);
  }
};
init();

process.on("message", async (msg) => {
  try{
    await api[msg.fn](msg);
  } catch(e){
    logger.error("Error mongoDB init => ", e.message);
    console.error("Error", e.message);
    return {response:{status:504, message:e.message}};
  }
});

