const fs = require("fs");

const llenar_celda = async (worksheet, cell, data) => {
  const cellFechaDiaIngreso = worksheet.getCell(cell);
  cellFechaDiaIngreso.value = data;
  return worksheet;
};
const llenar_y_sumar_celda = async (worksheet, cell, data) => {
  const celda = worksheet.getCell(cell);
  celda.value = celda + " " + data;
  celda.alignment = { wrapText: true };
  return worksheet;
};
const llenar_cabecera = async (worksheet, lote, contenedores) => {
  const celdasCabecera = ["D7", "E7", "F7", "H7", "B8", "E9", "H9"];
  const dataCabecera = [
    new Date(lote.fechaIngreso).getDate(),
    new Date(lote.fechaIngreso).getMonth() + 1,
    new Date(lote.fechaIngreso).getYear(),
    lote.predio.DEPARTAMENTO,
    lote.predio.PREDIO,
    lote.kilos,
    lote.enf,
  ];

  for(let i=0; i<celdasCabecera.length; i++){
    worksheet = await llenar_celda(worksheet, celdasCabecera[i], dataCabecera[i]);
  }

  const celdasCabecestaSumatoria = ["D8", "F8"];
  const dataCabeceraSumatoria =[lote.predio.ICA,lote.predio.GGN];
      
  for(let i=0; i<celdasCabecestaSumatoria.length; i++){
    worksheet = await llenar_y_sumar_celda(worksheet, celdasCabecestaSumatoria[i], dataCabeceraSumatoria[i]);
  }
   
  for (let i = 0; i<lote.contenedores.length; i++){
    const contenedor = contenedores.find(cont => cont._id.toString() === lote.contenedores[i]);
    worksheet = await llenar_y_sumar_celda(worksheet, "H8", contenedor.numeroContenedor);
  }
  return worksheet;

};
const llenar_exportacion = async (worksheet, lote) => {
  const celdas = ["E13", "E14", "E15"];
  const datos = [lote.calidad1, lote.calidad15, lote.calidad2];

  for(let i=0; i<celdas.length; i++){
    worksheet = await llenar_celda(worksheet, celdas[i], datos[i]);
  }
  return worksheet;
};
const llenar_descarte_Limon = async (worksheet, lote) => {
  const descarte = lote.descarteEncerado.descarteGeneral + lote.descarteLavado.descarteGeneral + lote.descarteEncerado.suelo;
  const data = [
    lote.calidad.clasificacionCalidad.oleocelosis,
    lote.calidad.clasificacionCalidad.dannosMecanicos,
    lote.calidad.clasificacionCalidad.herbicida,
    lote.calidad.clasificacionCalidad.acaro,
    lote.calidad.clasificacionCalidad.alsinoe,
    lote.calidad.clasificacionCalidad.wood,
    lote.calidad.clasificacionCalidad.frutaVerde,
    lote.calidad.clasificacionCalidad.melanosis,
    lote.calidad.clasificacionCalidad.sombra,
    lote.calidad.clasificacionCalidad.division,
    lote.calidad.clasificacionCalidad.trips,
    lote.calidad.clasificacionCalidad.grillo + lote.calidad.clasificacionCalidad.piel + lote.calidad.clasificacionCalidad.fumagina
        + lote.calidad.clasificacionCalidad.mancha + lote.calidad.clasificacionCalidad.deshidratada + lote.calidad.clasificacionCalidad.escama,
    lote.calidad.clasificacionCalidad.frutaMadura,
  ];
  for(let i=0; i<data.length; i++){
    worksheet = await llenar_celda(worksheet, `E${i+17}`, (data[i]* descarte)/100);
  }

  const descarteData = [    
    lote.descarteEncerado.extra,
    lote.descarteEncerado.balin + lote.descarteLavado.balin,
    lote.descarteEncerado.pareja + lote.descarteLavado.pareja,
    lote.descarteEncerado.descompuesta + lote.descarteLavado.descompuesta + lote.descarteLavado.piel,
    lote.descarteLavado.hojas,
    lote.frutaNacional + lote.directoNacional
  ];

  for(let i=0; i<descarteData.length; i++){
    worksheet = await llenar_celda(worksheet, `E${i+30}`, descarteData[i]);
  }

  return worksheet;
};
const llenar_pruebas_plataforma = async (worksheet, lote) => {
  const celdas = ["B45", "D45", "F45", "H45"];
  const data = [
    lote.calidad.calidadInterna.brix,
    lote.calidad.calidadInterna.acidez,
    lote.calidad.calidadInterna.ratio,
    lote.calidad.calidadInterna.zumo
  ];
  for(let i=0; i<celdas.length; i++){
    worksheet = await llenar_celda(worksheet, celdas[i], data[i]);
  }
  return worksheet;
};
const llenar_observaciones = async (worksheet, lote) => {
//   const descarte = lote.descarteEncerado.descarteGeneral + lote.descarteLavado.descarteGeneral + lote.descarteEncerado.suelo;
  const observaciones = {
    dannosMecanicos: "Se evidencia alto porcentaje de fruta con oleocelosis y daños mecánicos.",
    oleocelosis: "Se evidencia alto porcentaje de fruta con oleocelosis y daños mecánicos.",
    acaro: "Se evidencia alto porcentaje de fruta con daño por acaro(Mancha).",
    melanosis: "Se evidencia alta incidencia de fruta con melanosis.",
    balin:"Se evidencia un alto porcentaje de fruta con diámetro ecuatorial inferior al requerido",
    extra:"Se evidencia un alto porcentaje de fruta con diámetro ecuatorial superior al requerido.",
    frutaVerde: "Fruta con inicios de maduración color verde manzana (°3)",
    descompuesta: "Se reporta alto porcentaje de fruta descompuesta.",
    sombra: "Fruta con alto porcentaje de sombra, superior a los establecido en la FT.",
    alsinoe:"Se evidencia alta incidencia de fruta con Elsinoe.",
    trips:"Se evidencia alto porcentaje de fruta con daño por Trips (Mancha).",
    wood: "Se reporta presencia de wood pocket.",
    escama: "Se evidencia fruta con presencia de escama.",
    frutaMadura: "Fruta madura, coloración amarilla (°4-°5-°6)",
  };
  let filteredObj = Object.fromEntries(Object.entries(lote.calidad.clasificacionCalidad._doc).filter(([key,]) => key !== "fecha"));
  const top3Keys = Object.entries(filteredObj)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 3)
    .map(([key,]) => key);
  for(let i=0; i<top3Keys.length; i++){
    worksheet = await llenar_y_sumar_celda(worksheet, `A${i + 46}`, observaciones[top3Keys[i]]);
  }
  return worksheet;
};
const agregar_fotos = async (workbook, worksheet, lote) => {
  const fotosPaths = lote.calidad.fotosCalidad._doc;
  const keys = Object.keys(fotosPaths);
  let i = 0;
  let n = 0;
  while(i < keys.length){
    const imageId = workbook.addImage({
      buffer: fs.readFileSync(fotosPaths[keys[i]]),
      extension: "png",
    });
    
    if(n === 0){
      worksheet.addImage(imageId, `A${73 + (i * 10)}:E${82 + (i * 10)}`);
      worksheet = await llenar_celda(worksheet, `A${83 + (i * 10)}`, keys[i]);
    } else {
      worksheet.addImage(imageId, `F${73 + (i * 10)}:H${82 + (i * 10)}`);
      worksheet = await llenar_celda(worksheet, `F${83 + (i * 10)}`, keys[i]);
      n = 0;
    }
    n++;
    i++;
  }
  return worksheet;
};
module.exports = {
  llenar_cabecera,
  llenar_exportacion,
  llenar_descarte_Limon,
  llenar_pruebas_plataforma,
  llenar_observaciones,
  agregar_fotos
};