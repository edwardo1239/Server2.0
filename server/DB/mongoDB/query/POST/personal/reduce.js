const { addUser } = require("./postPersonal");

const apiPersonalPOST = {
  users: async(data) => {
    const response = await addUser(data);
    return response;
  },
};

module.exports.apiPersonalPOST = apiPersonalPOST;
