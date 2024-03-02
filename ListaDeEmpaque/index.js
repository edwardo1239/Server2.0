require("dotenv").config({ path: "../.env" });
const http = require("http");
const socketIO = require("socket.io");
const { obtenerIDs, guardarIDs } = require("./utils/variablesProceso");
const { responseListaEmpaque } = require("./public/response");
// let timerId = null;

const hostname = process.env.HOST_NAME;
const port = process.env.PORT_LISTA_EMPAQUE;

const server = http.createServer();

const io = socketIO(server, { maxHttpBufferSize: 5 * 1024 * 1024 });

io.on("connection", socket => {
  console.log("an user has connected");

  socket.on("disconnect", () => {
    console.log("an user has disconnected");
  });

  socket.on("listaDeEmpaque", async (data, callback) => {
    try {
      // clearTimeout(timerId); // limpia el temporizador existente

      // timerId = setTimeout(async () => {
      //   console.log("se manda una vez");
      //   // maneja la petición aquí
     
      // }, 100); // espera 300ms antes de procesar
      process.send({ fn: data.data.action, data: data.data, query: "proceso", client: "ListaDeEmpaque" });
      process.once("message", async msg => {
        if (msg.fn === data.data.action) {
          if (Object.prototype.hasOwnProperty.call(responseListaEmpaque, msg.fn)) {
            const response = await responseListaEmpaque[msg.fn](msg);

            if (data.data.action === "guardarItem") {
              response.dataIngreso = {};
              response.dataIngreso = data.data.data.item;

              io.emit("listaEmpaqueDB", response);
              process.send({
                data: response.data,
                dataIngreso: { ...response.dataIngreso, contenedor: data.data.data.contenedor },
                dataImpresion: msg.datosImprimir,
                type: "contenedores",
                imprimir: true,
              });
            } else {
              io.emit("listaEmpaqueDB", response);
              process.send({
                data: response.data,
                type: "contenedores",
              });
            }

            callback(response);
          }
        }
      });
    } catch (e) {
      //console.error(`socket celifrutListen ${e.name}:${e.message}`);
      return { status: 400 };
    }
  });
});

process.on("message", async msg => {
  if (
    msg.fn === "vaciarLote" ||
    msg.fn === "reprocesarDescarteUnPredio" ||
    msg.fn === "ReprocesarDescarteCelifrut" ||
    msg.fn === "procesarDesverdizado"
  ) {
    if (msg.status === 200) {
      io.emit("vaciarLote", msg.data);
      const ids = await obtenerIDs();
      ids["ENF-vaciando"] = msg.data.enf;
      ids.tipoFruta = msg.data.tipoFruta;
      ids.nombrePredio = msg.data.nombrePredio;
      ids.predioId = msg.data.predioId;
      await guardarIDs(ids);
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
