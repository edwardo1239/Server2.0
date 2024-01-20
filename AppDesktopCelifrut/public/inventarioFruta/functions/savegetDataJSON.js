const pathIDs = "./AppDesktopCelifrut/data/ids.json";
const fs = require("fs");


const obtenerIDs = async () => {
  try {
    if (!fs.existsSync(pathIDs)) {
      fs.writeFileSync(pathIDs, JSON.stringify({}));
    }
    const idsJSON = fs.readFileSync(pathIDs);
    const ids = JSON.parse(idsJSON);
    return ids;
  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
  }
};
const guardarIDs = async (newIDs) => {
  if (!fs.existsSync(pathIDs)) {
    fs.writeFileSync(pathIDs, JSON.stringify({}));
  }
  let idsJSON = JSON.stringify(newIDs);
  fs.writeFileSync(pathIDs, idsJSON);
};
module.exports = {
  obtenerIDs,
  guardarIDs
};