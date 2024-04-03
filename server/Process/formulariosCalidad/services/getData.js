const { sendData } = require("../utils/sendData");

const getOperarios = async () => {
  const response = await sendData(
    {action:"getOperarios", fn:"GET", DB: "postgresDB", client:"formulariosWebApp"});
  return response;
};

module.exports = {
  getOperarios
};