const { sendData } = require("../../utils/sendData");

const apiCalidad = {
  getVolanteCalidad: async (data) => {
    const response = await sendData({...data, fn:"GET", DB:"postgresDB"});
    return response;
  }
};

module.exports.apiCalidad = apiCalidad;