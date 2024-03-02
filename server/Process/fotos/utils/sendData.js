let pending = {};

process.on("message", (msg) => {
  let resolve = pending[msg.id];
  if (resolve) {
    resolve(msg);
    delete pending[msg.id];
  }
});

const sendData = async (data) => {
  return new Promise((resolve, ) => {
    let id = generateUniqueId(); // Deberías implementar esta función para generar un ID único para cada mensaje
    data.id = id;
    pending[id] = resolve;
    process.send(data);
  });
};

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}



module.exports = {
  sendData
};