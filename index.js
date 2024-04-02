// Load environment variables from .env file
require("dotenv").config("./.env");
// Import necessary modules
const { fork } = require("child_process");
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


// Create a new instance of EventEmitter for inter-process communication
const emitter = new EventEmitter();
// Check if the script is run in development mode
// if (process.argv[2] === "production"){
//   console.log(process.argv[2]);
// Similar to the above, but with different paths for the child processes
CelifrutApp = fork("./server/Process/AppDesktopCelifrut/index.js");
Descartes = fork("./server/Process/Descartes/index.js");
ListaDeEmpaque = fork("./server/Process/listaDeEmpaque/index.js");
Fotos = fork("./server/Process/fotos/index.js");
mongoBD = fork("./server/DB/mongoDB/config/Init.js");
postgresDB = fork("./server/DB/postgresDB/init.js");
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
  
emitter.on("request", msg => {
  if(msg.DB === "postgresDB"){
    if(msg.fn === "PUT" || msg.fn === "GET" || msg.fn === "POST"){
      postgresDB.send(msg);
    }

  } else {
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
  }
});

emitter.on("response", msg => {
  if(msg.client === "Desktop"){
    CelifrutApp.send(msg);
  } else if (msg.client === "Descartes"){
    Descartes.send(msg);
  } else if (msg.client === "listaDeEmpaque"){
    ListaDeEmpaque.send(msg);
  } else if (msg.client === "fotos"){
    Fotos.send(msg);
  }
});

//reiniciar valores del sistema
cron.schedule("0 8 * * *", async () => {
  await reiniciar_valores_del_sistema();
});

//se obtienen los valores del sistema de cada hora
cron.schedule("*/1 * * * *", async () => {
  await valoresDelSistema_por_hora();
});


//checkear actualizaciones de electron
cron.schedule("1 12 * * *", async () => {
  await check_CelifrutDesktopApp_upload();
});


// }
// If the script is not run in development or production mode
// else {
//   CelifrutApp = fork("./AppDesktopCelifrut/index.js");
//   Descartes = fork("./Descartes/index.js");
//   ListaDeEmpaque = fork("./ListaDeEmpaque/index.js");
//   mongoBD = fork("./DB/config/Init.js");
  

//   CelifrutApp.on("message", msg => {
//     if (msg.query) {
//       emitter.emit("query", msg);
//     }
//   });

//   Descartes.on("message", msg => {
//     if (msg.query) {
//       emitter.emit("query", msg);
//     }
//   });

//   ListaDeEmpaque.on("message", msg => {
//     if (msg.query === "proceso") {
//       emitter.emit("query", msg);
//     }
//     if(msg.type === "contenedores"){
//       emitter.emit("contenedores", msg);
//     }
//   });

//   //respuesta de la base de datos
//   mongoBD.on("message", msg => {
//     if (msg.client === "Celifrut") {
//       CelifrutApp.send(msg);
//     } else if (msg.client === "ListaDeEmpaque") {
//       ListaDeEmpaque.send(msg);
//     }
//     emitter.emit(msg.event, msg);
//     if (msg.fn === "vaciarLote" || msg.fn === "reprocesarDescarteUnPredio" || msg.fn === "ReprocesarDescarteCelifrut" || msg.fn === "procesarDesverdizado") {
//       emitter.emit("vaciarLote", msg);
//     }
//   });

//   // evento que recibe peticiones para querys de la base de datos
//   emitter.on("query", msg => {
//     mongoBD.send(msg);
//   });

//   //Evento que recibe los datos de la base de datos a
//   emitter.on("queryResponse", data => {
//     if (data.server.includes("Celifrut")) {
//       CelifrutApp.send(data);
//     }
//     if (data.server.includes("Descartes")) {
//       Descartes.send(data);
//     }
//     if (data.server.includes("listaDeEmpaque")) {
//       ListaDeEmpaque.send(data);
//     }
//   });

//   //Evento de vaciar un predio
//   emitter.on("vaciarLote", msg => {
//     Descartes.send(msg);
//     ListaDeEmpaque.send(msg);
//   });

//   //evento actualizacion en lista de empaque
//   emitter.on("contenedores", msg => {
//     CelifrutApp.send({...msg, fn:"obtenerDataContenedor"});
//   });

//   //obtiene los datos de higiene
//   cron.schedule("25 21 * * *", () => {
//     const child = exec("node " + [__dirname + "/Api/formatos/fetchHigiene.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

//   //obtiene los datos de control de plagas
//   cron.schedule("12 21 * * *", () => {
//     const child = exec("node " + [__dirname + "/Api/formatos/fetchControlDePlagas.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

//   //obtiene los datos de limpieza y desinfeccion de planta
//   cron.schedule("39 21 * * *", () => {
//     const child = exec("node " + [__dirname + "/Api/formatos/fetchLimpiezaDesinfeccionPlanta.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

//   //obtiene los datos de limpieza y desinfeccion de planta mensual
//   cron.schedule("36 11 1 * *", () => {
//     const child = exec("node " + [__dirname + "/Api/formatos/fetchLimpiezaMensual.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

//   //obtiene los datos de volante de calidad
//   cron.schedule("36 21 * * *", () => {
//     const child = exec("node " + [__dirname + "/Api/formatos/fetchVolanteCalidad.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

//   //obtiene los datos de formatos camiones
//   cron.schedule("50 20 * * *", () => {
//     const child = exec("node " + [__dirname + "/Api/formatos/fetchFormatosCamionesLlegada.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

//   //crear informes
//   cron.schedule("23 20 * * *", () => {
//     const child = exec("node " + [__dirname + "/Api/CrearInformes/crearInformesCalidad.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

//   //subir los datos de lotes a el drive de google
//   cron.schedule("00 21 * * *", () => {
//     const child = exec("node " + [__dirname + "/Api/subirData/sendLotesInfo.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

//   //subir los datos de Contenedore a el drive de google
//   cron.schedule("39 20 * * *", () => {
//     const child = exec("node " + [__dirname + "/Api/subirData/sendContenedores.js"]);

//     child.stderr.on("data", data => {
//       console.error(`stderr: ${data}`);
//     });
//   });

// }