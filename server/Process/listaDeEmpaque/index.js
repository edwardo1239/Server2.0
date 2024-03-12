const http = require("http");
const socketIO = require("socket.io");
const { apiListaEmpaque } = require("./reduce");

const hostname = "192.168.0.172";
const port = 3004;

const server = http.createServer();
const io = socketIO(server, { maxHttpBufferSize: 5 * 1024 * 1024 });

io.on("connection", socket => {
  console.log("an user has connected");

  let ongoingRequests = {};
  socket.on("listaEmpaque", async (data, callback) => {
    try {
      if (ongoingRequests[data.data.action]) {
        return;
      }
      // Marca la solicitud como en curso
      ongoingRequests[data.data.action] = true;
      if (Object.prototype.hasOwnProperty.call(apiListaEmpaque, data.data.collection)) {

        const response = await apiListaEmpaque[data.data.collection]({...data.data, client: "listaDeEmpaque", socketId: socket.id,});
        //console.log("lista de empaque callback", response);
        callback(response.response);
      } else {
        callback({ status: 501, message: "Function don't found" });
      }
    } catch (e) {
      callback({ status: 502, data: e.message });
    } finally {
      // Una vez que la solicitud se ha completado, elimina la marca
      delete ongoingRequests[data.data.action];
    }
  });

  socket.on("disconnect", () => {
    process.send("an user has disconnected");
  });
    
});

process.on("message", msg => {
  if(msg.fn === "vaciado"){
    io.emit("vaciarLote", msg.data);
  } else if(msg.fn === "listaEmpaqueToDescktop") {
    io.emit("listaEmpaque", msg);
  } else if (msg.fn === "listaEmpaqueToDescktopSinPallet"){
    io.emit("cajasSinPallet", msg);
  } else if (msg.fn === "procesoContenedor"){
    io.emit("newData", msg);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
  