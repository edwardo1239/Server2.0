require("dotenv").config({ path: "../.env" });

const { api } = require("./public/reduce");
const { obtenerIDs, guardarIDs } = require("./utils/variablesProceso");
const http = require("http");
const socketIO = require("socket.io");

try {
  const hostname = process.env.HOST_NAME;
  const port = process.env.PORT_APP_DESCARTES;

  const server = http.createServer();

  const io = socketIO(server, { maxHttpBufferSize: 5 * 1024 * 1024 });

  io.on("connection", socket => {
    console.log("an user has connected");

    socket.on("disconnect", () => {
      process.send("an user has disconnected");
    });

    socket.on("descartes", async (data, callback) => {
      try {
        const response = await api[data.data.action]({ fn: data.data.action, data: data.data });

        callback(response);
      } catch (e) {
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
      if (msg.status !== 403) {
        io.emit("vaciarLote", msg.data);
        const ids = await obtenerIDs();
        ids["ENF-vaciando"] = msg.data.enf;
        ids.tipoFruta = msg.data.tipoFruta;
        ids.nombrePredio = msg.data.nombrePredio;
        await guardarIDs(ids);
      }
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

process.on("unhandledRejection", reason => {
  console.error("Promesa rechazada sin manejo:", reason);
  // Haz algo para manejar el error...
});
