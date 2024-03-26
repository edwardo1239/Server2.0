const http = require("http");
const socketIO = require("socket.io");
const { apiFotosCalidad } = require("./reduce");

const hostname = process.env.HOST;
const port = process.env.FOTOS_PORT;

const server = http.createServer();
const io = socketIO(server, { maxHttpBufferSize: 5 * 1024 * 1024 });

io.on("connection", socket => {
  console.log("an user has connected");

  let ongoingRequests = {};
  socket.on("fotosCalidad", async (data, callback) => {
    try {
      if (ongoingRequests[data.data.action]) {
        return;
      }
      // Marca la solicitud como en curso
      ongoingRequests[data.data.action] = true;
      if (Object.prototype.hasOwnProperty.call(apiFotosCalidad, data.data.collection)) {
        const response = await apiFotosCalidad[data.data.collection]({...data.data, client: "fotos", socketId: socket.id,});
        //console.log("Descartes callback", response);
        callback(response.response);
      } else {
        callback({ status: 501, message: "Function don't found" });
      }
    } catch (e) {
      callback({ status: 502, data: e });
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
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
  