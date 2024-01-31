require("dotenv").config();
const { fork, exec } = require("child_process");
const EventEmitter = require("events");
const cron = require("node-cron");


const CelifrutApp = fork("./AppDesktopCelifrut/index.js");
const Descartes = fork("./Descartes/index.js");
const ListaDeEmpaque = fork("./ListaDeEmpaque/index.js");
const mongoBD = fork("./DB/config/Init.js");

// Crear una nueva instancia de EventEmitter
const emitter = new EventEmitter();

CelifrutApp.on("message", msg => {
  if (msg.query) {
    emitter.emit("query", msg);
  }
});

Descartes.on("message", msg => {
  if (msg.query) {
    emitter.emit("query", msg);
  }
});

ListaDeEmpaque.on("message", msg => {
  if (msg.query === "proceso") {
    emitter.emit("query", msg);
  }
  if(msg.type === "contenedores"){
    emitter.emit("contenedores", msg);
  }
});

//respuesta de la base de datos
mongoBD.on("message", msg => {
  if (msg.client === "Celifrut") {
    CelifrutApp.send(msg);
  } else if (msg.client === "ListaDeEmpaque") {
    ListaDeEmpaque.send(msg);
  }
  emitter.emit(msg.event, msg);
  if (msg.fn === "vaciarLote" || msg.fn === "reprocesarDescarteUnPredio" || msg.fn === "ReprocesarDescarteCelifrut" || msg.fn === "procesarDesverdizado") {
    emitter.emit("vaciarLote", msg);
  }
});

// evento que recibe peticiones para querys de la base de datos
emitter.on("query", msg => {
  mongoBD.send(msg);
});

//Evento que recibe los datos de la base de datos a
emitter.on("queryResponse", data => {
  if (data.server.includes("Celifrut")) {
    CelifrutApp.send(data);
  }
  if (data.server.includes("Descartes")) {
    Descartes.send(data);
  }
  if (data.server.includes("listaDeEmpaque")) {
    ListaDeEmpaque.send(data);
  }
});

//Evento de vaciar un predio
emitter.on("vaciarLote", msg => {
  Descartes.send(msg);
  ListaDeEmpaque.send(msg);
});

//evento actualizacion en lista de empaque
emitter.on("contenedores", msg => {
  CelifrutApp.send({...msg, fn:"obtenerDataContenedor"});
});

//obtiene los datos de higiene
cron.schedule("25 21 * * *", () => {
  const child = exec("node " + [__dirname + "/Api/formatos/fetchHigiene.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});

//obtiene los datos de control de plagas
cron.schedule("12 21 * * *", () => {
  const child = exec("node " + [__dirname + "/Api/formatos/fetchControlDePlagas.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});

//obtiene los datos de limpieza y desinfeccion de planta
cron.schedule("39 21 * * *", () => {
  const child = exec("node " + [__dirname + "/Api/formatos/fetchLimpiezaDesinfeccionPlanta.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});

//obtiene los datos de limpieza y desinfeccion de planta mensual
cron.schedule("36 11 1 * *", () => {
  const child = exec("node " + [__dirname + "/Api/formatos/fetchLimpiezaMensual.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});

//obtiene los datos de volante de calidad
cron.schedule("36 21 * * *", () => {
  const child = exec("node " + [__dirname + "/Api/formatos/fetchVolanteCalidad.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});

//obtiene los datos de formatos camiones
cron.schedule("50 20 * * *", () => {
  const child = exec("node " + [__dirname + "/Api/formatos/fetchFormatosCamionesLlegada.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});

//crear informes
cron.schedule("4 21 * * *", () => {
  const child = exec("node " + [__dirname + "/Api/CrearInformes/crearInformesCalidad.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});

//subir los datos de lotes a el drive de google
cron.schedule("00 21 * * *", () => {
  const child = exec("node " + [__dirname + "/Api/subirData/sendLotesInfo.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});

//subir los datos de Contenedore a el drive de google
cron.schedule("39 20 * * *", () => {
  const child = exec("node " + [__dirname + "/Api/subirData/sendContenedores.js"]);

  child.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
  });
});