// Load environment variables from .env file
require("dotenv").config("./.env");
// Import necessary modules
const { fork, exec } = require("child_process");
const EventEmitter = require("events");
const cron = require("node-cron");
const { valoresDelSistema_por_hora, reiniciar_valores_del_sistema, check_CelifrutDesktopApp_upload } = require("./server/functions/sistema");
// Declare variables for different tasks
let CelifrutApp; 
let Descartes; 
let ListaDeEmpaque; 
let mongoBD;
let Fotos;
let postgresDB;


exec("start wsl redis-server ", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error ejecutando el comando: ${error}`);
    return;
  }
  console.log(`Resultado: ${stdout}`);
  console.error(`Errores: ${stderr}`);
});



// Create a new instance of EventEmitter for inter-process communication
const emitter = new EventEmitter();

CelifrutApp = fork("./server/Process/AppDesktopCelifrut/index.js");
Descartes = fork("./server/Process/Descartes/index.js");
ListaDeEmpaque = fork("./server/Process/listaDeEmpaque/index.js");
Fotos = fork("./server/Process/fotos/index.js");
mongoBD = fork("./server/DB/mongoDB/config/Init.js");
postgresDB = fork("./server/DB/postgresDB/init.js");
let formulariosApp = fork("./server/Process/formulariosCalidad/index.js");
const recordsDB = fork("./server/DB/recordsDB/init.js");
// Similar event handlers as above
CelifrutApp.on("message", msg => {
  emitter.emit("request", msg);
});
Descartes.on("message", msg =>{
  emitter.emit("request", msg);
});
ListaDeEmpaque.on("message", msg =>{
  emitter.emit("request", msg);
});
Fotos.on("message", msg =>{
  emitter.emit("request", msg);
});
mongoBD.on("message", msg => {
  emitter.emit("response", msg);
});
postgresDB.on("message", msg => {
  emitter.emit("response", msg);
});
recordsDB.on("message", msg => {
  emitter.emit("response", msg);
});
formulariosApp.on("message", msg => {
  emitter.emit("request", msg);
});


// #region Request
emitter.on("request", msg => {
  if(msg.DB === "mongoDB"){
    if(msg.fn === "GET" || msg.fn === "POST" || msg.fn === "PUT" || msg.fn === "DELETE"){
      mongoBD.send(msg);
    } else if(msg.fn === "cambio-cliente") {
      CelifrutApp.send(msg);
    }
  }

  else if(msg.DB === "postgresDB"){
    if(msg.fn === "PUT" || msg.fn === "GET" || msg.fn === "POST" || msg.fn === "DELETE"){
      postgresDB.send(msg);
    } else if(msg.fn === "cambio-usuario" ||
              msg.fn === "cambio-operario") {
      CelifrutApp.send(msg);
    } 
  } 

  else if (msg.DB === "recordDB"){
    recordsDB.send(msg);
  }
  
  
  else {
    if(msg.fn === "GET" || msg.fn === "POST" || msg.fn === "PUT" || msg.fn === "DELETE"){
      mongoBD.send(msg);
    } 
    else if(msg.fn === "vaciado"){
      Descartes.send(msg);
      ListaDeEmpaque.send(msg);
      CelifrutApp.send(msg);
    } 
    else if(msg.fn === "listaEmpaqueToDescktop"){
      CelifrutApp.send(msg);
      ListaDeEmpaque.send(msg);
    }
    else if (msg.fn === "listaEmpaqueToDescktopSinPallet" || msg.fn === "procesoContendor"){
      ListaDeEmpaque.send(msg);
    }
    else if(msg.fn === "ingresoLote" || msg.fn === "procesarLote" || msg.fn === "OrdenVaciado" || msg.fn === "descartesToDescktop"){
      CelifrutApp.send(msg);
    }
    else if(msg.fn === "Login"){
      postgresDB.send(msg);
    }
    else if(msg.fn === "cambio-proveedor"){
      CelifrutApp.send(msg);
    }
  }
});

// #region response
emitter.on("response", msg => {
  if(msg.client === "Desktop"){
    CelifrutApp.send(msg);
  } else if (msg.client === "Descartes"){
    Descartes.send(msg);
  } else if (msg.client === "listaDeEmpaque"){
    ListaDeEmpaque.send(msg);
  } else if (msg.client === "fotos"){
    Fotos.send(msg);
  } else if (msg.client === "formulariosWebApp"){
    formulariosApp.send(msg);
  }
});


// #region Functions

//reiniciar valores del sistema
cron.schedule("0 6 * * *", async () => {
  await reiniciar_valores_del_sistema();
});

//se obtienen los valores del sistema de cada hora
cron.schedule("*/1 * * * *", async () => {
  await valoresDelSistema_por_hora();
});

//checkear actualizaciones de electron
cron.schedule("10 16 * * *", async () => {
  await check_CelifrutDesktopApp_upload();
});


//reiniciar el pc 
cron.schedule("10 5 * * *", async () => {
  exec("shutdown -r", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error}`);
      return;
    }
    console.log(`Salida del comando: ${stdout}`);
    console.error(`Errores del comando: ${stderr}`);
  });
});
