const fs = require("fs");
const path = require("path");

const rendimiento = (lote) => {
  //const kilosVaciados = lote.kilosVaciados;
  const descarteLavado = lote.descarteLavado;
  const descarteLavadoTotal = Object.keys(descarteLavado._doc).reduce((acu, item) => acu += descarteLavado._doc[item], 0);  
  const descarteEncerado = lote.descarteEncerado;
  const descarteEnceradoToral = Object.keys(descarteEncerado._doc).reduce((acu, item) => acu += descarteEncerado._doc[item], 0);
  
  let exportacionTotal = 0;
  if(Object.prototype.hasOwnProperty.call(lote, "exportacion")){
    const exportacion = lote.exportacion;
    const sum = Object.keys(exportacion._doc).reduce((acu1, contenedor) => 
      acu1+= Object.keys(exportacion._doc[contenedor]).reduce((acu2, calidad) => 
        acu2 += exportacion._doc[contenedor][calidad],
      0),
    0);
    exportacionTotal = sum;
  }  

  const total = descarteEnceradoToral + descarteLavadoTotal + exportacionTotal;
  const rendimiento = (exportacionTotal * 100) / total;

  return rendimiento;
};
const deshidratacion = (lote) => {
  const kilos = lote.kilos;
  const descarteLavado = lote.descarteLavado;
  const descarteLavadoTotal = Object.keys(descarteLavado._doc).reduce((acu, item) => acu += descarteLavado._doc[item], 0);
  const descarteEncerado = lote.descarteEncerado;
  const descarteEnceradoToral = Object.keys(descarteEncerado._doc).reduce((acu, item) => acu += descarteEncerado._doc[item], 0);
  let exportacionTotal = 0;
  if(lote.exportacion){
    const exportacion = lote.exportacion;
    const sum = Object.keys(exportacion._doc).reduce((acu1, contenedor) => 
      acu1+= Object.keys(exportacion._doc[contenedor]).reduce((acu2, calidad) => 
        acu2 += exportacion._doc[contenedor][calidad],
      0),
    0);
    exportacionTotal = sum;
  }
  const total = descarteLavadoTotal + 
    descarteEnceradoToral + 
    exportacionTotal + 
    lote.directoNacional + 
    lote.frutaNacional;
  const deshidratacion = 100 - ((total * 100) / kilos);
  return deshidratacion;
};
async function saveFiles(files, dir, name) {
  try {
    // Verifica si el directorio existe, si no, lo crea
    await fs.promises.access(dir).catch(() => fs.promises.mkdir(dir, { recursive: true }));
    const paths = [];
    // Guarda todos los archivos de manera asíncrona
    await Promise.all(
      files.map((file, index) => {
        const filePath = path.join(dir, name + index + ".pdf");
        paths.push(filePath);
        const buffer = Buffer.from(file.data);
        return fs.promises.writeFile(filePath, buffer);
      }),
    );
    return paths;
    
  } catch (error) {
    console.error("Hubo un error al guardar los archivos:", error);
  }
}

module.exports = {
  rendimiento,
  deshidratacion,
  saveFiles
};