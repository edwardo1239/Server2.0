const { sendData } = require("../utils/sendData");

const postReduce = async (req, body) => {
  if (req.url === "/signIn") {
    const data = JSON.parse(body);
    const request = {
      data: data,
      collection: "users",
      action: "signIn",
      query: "personal",
      fn:"Login",
      client: "Desktop", 
    };
    const response = await sendData(request);
    return response;
  }
};

module.exports.postReduce = postReduce;