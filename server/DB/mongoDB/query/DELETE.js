const { apiPersonalDelete } = require("./DELETE/personal/reduce");
const { apiProcesoDelete } = require("./DELETE/proceso/reduce");

const apiDELETE = {
  proceso: async(data) => {
    const response = await apiProcesoDelete[data.collection](data);
    process.send(response);
  },
  personal: async(data) => {
    const response = await apiPersonalDelete[data.collection](data);
    process.send(response);
  },
};

module.exports.apiDELETE = apiDELETE;