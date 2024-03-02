const { sendData } = require("../utils/sendData");
const fs = require("fs");


const apiLotes = {
  getLotes: async data => {
    const response = await sendData({ ...data, fn: "GET" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },
  putLote: async data => {
    const loteInfo = data.data;
    const fotosPath = "G:/Mi unidad/fotos_frutas/";
    const base64Data = loteInfo.foto.replace(/^data:image\/\w+;base64,/, "");
    const fotoPath = fotosPath + loteInfo._id + "_" + loteInfo.fotoName + ".png";

    fs.writeFileSync(fotoPath, base64Data, { encoding: "base64" }, err => {
      if (err) {
        console.error(err);
      }
    });
    data.data = {
      lote:{
        _id:data.data._id
      }
    };

    data.data.lote[`calidad.fotosCalidad.${loteInfo.fotoName}`] = fotoPath;

    const response = await sendData({ ...data, fn: "PUT" });
    return { ...response, satatus: response.response.status, message: response.response.message };
  },

};

module.exports.apiLotes = apiLotes;