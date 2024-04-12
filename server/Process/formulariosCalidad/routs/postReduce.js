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

  } else if (req.url === "/ingresar-higiene-personal"){
    const data = JSON.parse(body);
    const request = {
      data: data,
      DB: "postgresDB",
      action: "ingresar_higiene_personal",
      fn:"POST",
      client: "formulariosWebApp", 
    };
    const response = await sendData(request);
    return response;
    
  } else if (req.url === "/ingresar-control-plagas-control"){
    const data = JSON.parse(body);
    const request = {
      data:data,
      DB: "postgresDB",
      action: "ingresar_control_plagas_control",
      fn:"POST",
      client: "formulariosWebApp", 
    };
    const response = await sendData(request);
    return response;
  } else if (req.url === "/ingresar-control-plagas-cebo"){
    const data = JSON.parse(body);
    const request = {
      data:data,
      DB: "postgresDB",
      action: "ingresar_control_plagas_cebo",
      fn:"POST",
      client: "formulariosWebApp", 
    };
    const response = await sendData(request);
    return response;
  } else if (req.url === "/ingresar-control-plagas-hallazgos"){
    const data = JSON.parse(body);
    const request = {
      data:data,
      DB: "postgresDB",
      action: "ingresar_control_plagas_hallazgos",
      fn:"POST",
      client: "formulariosWebApp", 
    };
    const response = await sendData(request);
    return response;
  }
};

module.exports.postReduce = postReduce;