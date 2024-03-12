const http = require("http");
const socketIO = require("socket.io");
const { iniciarRedisDB } = require("../../../DB_redis/config/init");
const { apiUser } = require("./sections/user/reducer");
const { apiDesktop } = require("./sections/reduce");
const codeError = require("../../error/codeErrors.json");

// Load environment variables from .env file
require("dotenv").config({ path: "../../.env" });
// Define hostname and port from environment variables
const hostname = process.env.HOST_NAME;
const port = process.env.DESKTOP;
// Create a new HTTP server
const server = http.createServer();
// Create a new Socket.IO server
const io = socketIO(server, 
  { maxHttpBufferSize: 5 * 1024 * 1024,
    cors: {
      origin: "*", // Reemplaza esto con tu dominio
      credentials: true
    }  
  });
// Initialize Redis database
const clientePromise = iniciarRedisDB();
// Handle new connections
io.on("connection", socket => {
  console.log("an user has connected");
  // Handle 'user' events
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
        callback({ status: codeError.STATUS_USER_NOT_FOUND.code, message: codeError.STATUS_DESKTOP_NOT_FOUND.message });
      }
    } catch (e) {
      callback({ status: codeError.STATUS_SERVER_ERROR.code, data:`${codeError.STATUS_SERVER_ERROR.message} user ${e}` });
    }
  });
  // Handle 'Desktop' events
  let ongoingRequests = {};
  socket.on("Desktop", async (data, callback) => {
    try {
      // If the request is already ongoing, return
      if (ongoingRequests[data.data.action]) {
        return;
      }
      // Mark the request as ongoing
      ongoingRequests[data.data.action] = true;
      // Check if the collection exists in the apiDesktop object
      if (Object.prototype.hasOwnProperty.call(apiDesktop, data.data.collection)) {
        // Execute the collection and get the response
        const response = await apiDesktop[data.data.collection]({...data.data, client: "Desktop", socketId: socket.id,});
        //console.log(response.response);
        callback(response.response);
      } else {
        callback({ status: codeError.STATUS_DESKTOP_NOT_FOUND.code, message: codeError.STATUS_DESKTOP_NOT_FOUND.message });
      }
    } catch (e) {
      callback({ status: codeError.STATUS_SERVER_ERROR.code, message:`${codeError.STATUS_SERVER_ERROR.message} desktop => ${e.message}` });
    } finally {
      // Once the request is completed, remove the ongoing mark
      delete ongoingRequests[data.data.action];
    }
  });
  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconect");
    process.send("an user has disconnected");
  });
});
// Handle messages from parent process
process.on("message", msg => {
  if(msg.fn === "descartesToDescktop" || msg.fn === "vaciado" || msg.fn === "ingresoLote" || msg.fn === "procesoLote" ){ 
    io.emit("serverToDesktop", msg);
  } 
});
// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
