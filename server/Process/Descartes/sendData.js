const sendData = async (data) => {
  return new Promise((resolve, ) => {
    process.send(data);
    process.once("message", msg => {
      resolve(msg);
    });
  });
};
    
  
module.exports = {
  sendData
};