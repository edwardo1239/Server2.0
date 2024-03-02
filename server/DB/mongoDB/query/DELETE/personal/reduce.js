const { deleteUser } = require("./deletePersonal");

const apiPersonalDelete = {
  users: async(data) => {
    const response = await deleteUser(data);
    return response;
  },
};

module.exports.apiPersonalDelete = apiPersonalDelete;