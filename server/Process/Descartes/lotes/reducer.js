const { default: mongoose } = require("mongoose");
const { sendData } = require("../sendData");
const { apiVariablesProceso } = require("../../../variablesDeProceso/reduce");

const apiLotes = {
  putLotes: async (data) => {
    try {
      const response = await sendData({...data, fn:"PUT"});
      
      if(response.response.status === 200){
        const addKilosProceso = await apiVariablesProceso.ingresoDescarte(data);
        if(addKilosProceso.status === 200) {
          process.send({fn:"descartesToDescktop", response:response, status:200});
        }else {
          return {status: 401, message: "Hubo un error al sumar los kilos del proceso."};
        }
      } 
      return {...response, status:response.response.status, message:response.response.message};
    } catch (error) {
      console.error(error);
      // Puedes decidir qué hacer en caso de error, por ejemplo, devolver un mensaje de error:
      return {status: "error", message: "Hubo un error al enviar los datos."};
    }
  },
  getLotes: async (data) => {
    const id = new mongoose.Types.ObjectId(data.data.query._id);
    data.data.query._id = id;
    const response = await sendData({...data, fn:"GET"});
    return {...response, satatus:response.response.status, message:response.response.message};
  },

};

module.exports.apiLotes = apiLotes;