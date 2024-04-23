const { apiLotes } = require("./lotes");

const api = {
  lotes: async (data, client) => {
    const response = await apiLotes[data.action](data, client);
    return{...data, response:response};
  }
};
  
module.exports.api = api;