const { logger } = require("../../../error/config");
const yaml = require("js-yaml");
const fs = require("fs");


const isNewVersion = async (data) => {
  try{
    const fileContents = await getVersionDocument(); 
    let dataVersion = yaml.load(fileContents);
    if(data === dataVersion.version ){
      return false;
    } else {
      return true;
    }
    
  }catch(e){
    logger.error("isNewVersion", e);
  }
};
const getVersionDocument = async () => {
  try{
    let fileContents = fs.readFileSync(
      "C:/Users/USER-PC/Documents/Servidor/Servidor2.0/Files/celifrutAppDeskTop/latest.yml",
      "utf8",
    );
    return fileContents;
        
  }catch(e){
    logger.error("isNewVersion", e);
  }
};
const getCelifrutAppFile = async (data) => {
  try{
    console.log(data)
    let fileContents = fs.readFileSync(
      `C:/Users/USER-PC/Documents/Servidor/Servidor2.0/Files/celifrutAppDeskTop${data}`
    );
    return fileContents;
            
  }catch(e){
    logger.error("getCelifrutSetupBlockMap", e);
  }
};

module.exports = {
  isNewVersion,
  getVersionDocument,
  getCelifrutAppFile
};