const { sendData } = require("../utils/sendData");

const postReduce = async(req, body) => {
  if ( req.url === "/ingresar-volante-calidad") {
    const data = JSON.parse(body);
    const request = {
      data: data,
      DB: "postgresDB",
      action: "ingresar_volante_calidad",
      fn:"POST",
      client: "formulariosWebApp", 
    };
    const response = await sendData(request);
    return response;

  }
};

module.exports.postReduce = postReduce;