const { getReduce } = require("./get");
const { postReduce } = require("./post");

const reduceMethod = async (req, res) => {
  if (req.method === "GET") {
    const [action, value] = req.url.split("=");
    const [response, head ] = await getReduce(action, value);
    res.writeHead(200, head);
    res.end(response);
  }
  else if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const response = await postReduce(req, body);
      res.writeHead(200, { "Content-Type": "application/json" }); // Cambiado a application/json para enviar un objeto JSON
      res.end(JSON.stringify(response.response));
    });
  }
};

module.exports.reduceMethod = reduceMethod;