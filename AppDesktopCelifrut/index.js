const { responseCalidad } = require("./public/calidad/response");
const { responseContenedores } = require("./public/contenedores/response");
const { responseProceso } = require("./public/inventarioFruta/response");
const { responseUser } = require("./public/users/response");
let timerId = null;
try {
  require("dotenv").config({ path: "../.env" });
  const http = require("http");
  const socketIO = require("socket.io");

  const hostname = process.env.HOST_NAME;
  const port = process.env.PORT_APP_CELIFRUT;

  const server = http.createServer();

  const io = socketIO(server, { maxHttpBufferSize: 5 * 1024 * 1024 });

  io.on("connection", socket => {
    console.log("an user has connected");

    socket.on("disconnect", () => {
      process.send("an user has disconnected");
    });
    //login
    socket.on("user", async (data, callback) => {
      process.send({ fn: data.data.action, data:data.data, query: data.data.query, client:"Celifrut" });
      process.once("message", async msg => {
        if(Object.prototype.hasOwnProperty.call(responseUser, msg.fn)){
          const response = await responseUser[msg.fn](msg);
          callback(response);
        }

      });
      
    });
    //inventario
    socket.on("proceso", async (data, callback) => {
      try {
        clearTimeout(timerId); // limpia el temporizador existente
        timerId = setTimeout(async () => {
          // maneja la petición aquí
          process.send({ fn: data.data.action, data: data.data, query:"proceso", client:"Celifrut" });
          process.once("message", async msg => {

            if(msg.fn === "ingresarDescarteLavado" || msg.fn === "ingresarDescarteEncerado"){
              return 0;
            }
            if(Object.prototype.hasOwnProperty.call(responseProceso, msg.fn)){
              const response = await responseProceso[msg.fn](msg);
              callback(response);
            }
 
          });

          //callback(response);
        }, 300); // espera 300ms antes de procesar
      } catch (e) {
        //console.error(`socket celifrutListen ${e.name}:${e.message}`);
        return { status: 400 };
      }
    });

    socket.on("contenedoresService", async (data, callback) => {
      try {
        clearTimeout(timerId); // limpia el temporizador existente

        timerId = setTimeout(async () => {
          // maneja la petición aquí
          process.send({ fn: data.data.action, data: data.data, query: "proceso", client:"Celifrut" });
          process.once("message", async msg => {
            if(Object.prototype.hasOwnProperty.call(responseContenedores, msg.fn)){
              const response = await responseContenedores[msg.fn](msg);
              callback(response);
            }
          });
        }, 50); // espera 300ms antes de procesar
      } catch (e) {
        //console.error(`socket celifrutListen ${e.name}:${e.message}`);
        return { status: 400 };
      }
    });

    socket.on("calidad", async (data, callback) => {
      try {
        clearTimeout(timerId); // limpia el temporizador existente

        timerId = setTimeout(async () => {
          // maneja la petición aquí
          process.send({ fn: data.data.action, data: data.data, query: data.data.query, client:"Celifrut" });
          process.once("message", async msg => {
            if(Object.prototype.hasOwnProperty.call(responseCalidad, msg.fn)){
              const response = await responseCalidad[msg.fn](msg);

              callback(response);
            }
          });
          
        }, 300); // espera 300ms antes de procesar
      } catch (e) {
        return { status: 400 };
      }
    });

  });

  //eventos
  process.on("message", async (msg) => {
    if(msg.fn === "ingresarDescarteLavado" || msg.fn === "ingresarDescarteEncerado"){
      io.emit("descartesInfo", {status:200});
    }
    else if(msg.type === "contenedores"){
      io.emit("listaEmpaqueInfo", {...msg, status:200});
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });

} catch (e) {
  console.error(`Se ha capturado un error: ${e}`);
}

process.on("uncaughtException", error => {
  console.error(`Excepción no capturada: ${error}`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Promesa rechazada sin manejo:", reason);
  // Haz algo para manejar el error...
});
