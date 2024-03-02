const { putUser } = require("./putPersonal");

const apiPersonalPUT = {
  users: async(data) => {
    const response = await putUser(data);
    return response;
  },
};

module.exports.apiPersonalPUT = apiPersonalPUT;