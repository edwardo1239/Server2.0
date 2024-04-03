const http = require("http");
const { logger } = require("../../error/config");
const { reduceMethod } = require("./methods/reduce");

const hostname = process.env.HOST;
const port = process.env.FORMULARIOS_CALIDAD;

const server = http.createServer(async (req, res) => {
  try{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    await reduceMethod(req, res);
  } catch(e){
    console.error(e.message);
    logger.error(e.message);
  }
});

server.listen(port, hostname, () =>{
  console.log(`Server running at http://${hostname}:${port}/`);
});