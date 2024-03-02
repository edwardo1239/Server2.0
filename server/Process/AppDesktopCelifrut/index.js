const http = require("http");
const socketIO = require("socket.io");
const { iniciarRedisDB } = require("../../../DB_redis/config/init");
const { apiUser } = require("./sections/user/reducer");
const { apiDesktop } = require("./sections/reduce");
require("dotenv").config({ path: "../../.env" });
const hostname = process.env.HOST_NAME;
const port = process.env.DESKTOP;

const server = http.createServer();
const io = socketIO(server, { maxHttpBufferSize: 5 * 1024 * 1024 });

const clientePromise = iniciarRedisDB();

io.on("connection", socket => {
  console.log("an user has connected");

  socket.on("user", async (data, callback) => {
    try {

      if (Object.prototype.hasOwnProperty.call(apiUser, data.data.action)) {
        const response = await apiUser[data.data.action]({ ...data.data, client: "Desktop", socketId: socket.id });
        if (response.action === "logIn" && response.status === 200) {
          const cliente = await clientePromise;
          await cliente.hSet(`${socket.id}`, {
            user: response.response.data[0].user,
            cargo: response.response.data[0].cargo,
            fecha: new Date().toDateString(),
          });
        }
        console.log(response);
        callback(response.response);
      } else {
        callback({ status: 501, message: "Function in socket User don't found" });
      }
    } catch (e) {
      callback({ status: 401, data: e });
    }
  });

  let ongoingRequests = {};
  socket.on("Desktop", async (data, callback) => {
    try {
      
      if (ongoingRequests[data.data.action]) {
        return;
      }
      // Marca la solicitud como en curso
      ongoingRequests[data.data.action] = true;
      if (Object.prototype.hasOwnProperty.call(apiDesktop, data.data.collection)) {
        const response = await apiDesktop[data.data.collection]({...data.data, client: "Desktop", socketId: socket.id,});
        //console.log(response);
        callback(response.response);
      } else {
        callback({ status: 501, message: "Function in socket Desktop don't found" });
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

  if(msg.fn === "descartesToDescktop"){ 
    io.emit("serverToDesktop", msg);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
