const logIn = (data) => {
  return new Promise((resolve, reject) =>{
    try {
      process.send({ ...data, query: "personal" });
      process.on("message", (user) => {
        if(user.fn === data.fn){
          if (user.data === 401) {
            resolve([401, []]); 
          }
          else if (user.data[0].password === data.data.password) {
            resolve([200, user.data[0]]); 
    
          } else {
            resolve([402, []]);
          }
        }
      });
    } catch (e) {
      console.error(e.message);
      reject(e);
    }
  });
};

module.exports = {
  logIn,
};
