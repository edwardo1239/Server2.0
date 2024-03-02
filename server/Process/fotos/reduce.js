const { apiLotes } = require("./lotes/reducer");

const apiFotosCalidad = {
  lotes: async (data) => {
    if(Object.prototype.hasOwnProperty.call(apiLotes, data.action)){
      const response = await apiLotes[data.action](data);
      return response;
    }
    else {
      return({status:501, message:"Function don't found on apiLotes"});
    }
  },
};

module.exports.apiFotosCalidad = apiFotosCalidad;