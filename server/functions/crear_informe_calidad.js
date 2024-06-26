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
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const celdasCabecera = ["D7", "E7", "F7", "H7", "B8", "E9", "H9"];
  const dataCabecera = [
    new Date(lote.fechaIngreso).getDate(),
    meses[new Date(lote.fechaIngreso).getMonth()],
    new Date(lote.fechaIngreso).getFullYear(),
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
    lote.calidad.clasificacionCalidad.verdeManzana ? lote.calidad.clasificacionCalidad.verdeManzana : 0,
    lote.calidad.clasificacionCalidad.grillo + lote.calidad.clasificacionCalidad.piel + lote.calidad.clasificacionCalidad.fumagina +
    lote.calidad.clasificacionCalidad.mancha + lote.calidad.clasificacionCalidad.deshidratada + lote.calidad.clasificacionCalidad.escama +
    lote.calidad.clasificacionCalidad.otrasPlagas ? lote.calidad.clasificacionCalidad.otrasPlagas : 0,
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
    worksheet = await llenar_celda(worksheet, `E${i+31}`, descarteData[i]);
  }

  return worksheet;
};
const llenar_descarte_Naranja = async (worksheet, lote) => {
  const descarte = lote.descarteEncerado.descarteGeneral + lote.descarteLavado.descarteGeneral + lote.descarteEncerado.suelo;
  const data = [
    lote.calidad.clasificacionCalidad.acaro,
    lote.calidad.clasificacionCalidad.trips,
    lote.calidad.clasificacionCalidad.melanosis,
    lote.calidad.clasificacionCalidad.piel,
    lote.calidad.clasificacionCalidad.oleocelosis,
    lote.calidad.clasificacionCalidad.herbicida,
    lote.calidad.clasificacionCalidad.dannosMecanicos,
    lote.calidad.clasificacionCalidad.grillo,
    lote.calidad.clasificacionCalidad.escama,
    lote.calidad.clasificacionCalidad.frutaVerde,
    lote.calidad.clasificacionCalidad.frutaMadura,
    lote.calidad.clasificacionCalidad.division,
    lote.calidad.clasificacionCalidad.nutrientes,

    lote.calidad.clasificacionCalidad.alsinoe + lote.calidad.clasificacionCalidad.fumagina + lote.calidad.clasificacionCalidad.antracnosis + 
    lote.calidad.clasificacionCalidad.frutaRajada + lote.calidad.clasificacionCalidad.ombligona + lote.calidad.clasificacionCalidad.despezonada +
    lote.calidad.clasificacionCalidad.variegacion ? lote.calidad.clasificacionCalidad.variegacion : 0 + 
    lote.calidad.clasificacionCalidad.otrasPlagas ? lote.calidad.clasificacionCalidad.otrasPlagas : 0,
  ];
  for(let i=0; i<data.length; i++){
    worksheet = await llenar_celda(worksheet, `E${i+17}`, (data[i]* descarte)/100);
  }

  const descarteData = [    
    lote.descarteEncerado.extra,
    lote.descarteEncerado.pareja + lote.descarteLavado.pareja,
    lote.descarteEncerado.balin + lote.descarteLavado.balin,
    lote.frutaNacional + lote.directoNacional,
    lote.descarteEncerado.descompuesta + lote.descarteLavado.descompuesta + lote.descarteLavado.piel,
    lote.descarteLavado.hojas,
  ];

  for(let i=0; i<descarteData.length; i++){
    worksheet = await llenar_celda(worksheet, `E${i+32}`, descarteData[i]);
  }
  return worksheet;
};
const llenar_pruebas_plataforma = async (worksheet, lote) => {
  let celdas;
  if(lote.tipoFruta === "Limon"){
    celdas = ["B46", "D46", "F46", "H46"];
  } else {
    celdas = ["B48", "D48", "F48", "H48"];
  }
  const data = [
    lote.calidad.calidadInterna.brix,
    lote.calidad.calidadInterna.acidez,
    lote.calidad.calidadInterna.ratio,
    (lote.calidad.calidadInterna.zumo * 100) / lote.calidad.calidadInterna.peso
  ];
  for(let i=0; i<celdas.length; i++){
    worksheet = await llenar_celda(worksheet, celdas[i], data[i]);
  }
  return worksheet;
};
const llenar_observaciones = async (worksheet, lote) => {
  let celda ;
  if(lote.tipoFruta === "Limon"){
    celda = 47;
  } else {
    celda = 49;
  }
  const observaciones = {
    dannosMecanicos: "Se evidencia alto porcentaje de fruta con oleocelosis y daños mecánicos.",
    oleocelosis: "Se evidencia alto porcentaje de fruta con oleocelosis y daños mecánicos.",
    acaro: "Se evidencia alto porcentaje de fruta con daño por acaro(Mancha).",
    melanosis: "Se evidencia alta incidencia de fruta con melanosis.",
    balin:"Se evidencia un alto porcentaje de fruta con diámetro ecuatorial inferior al requerido (balin)",
    extra:"Se evidencia un alto porcentaje de fruta con diámetro ecuatorial superior al requerido.",
    pareja:"Se evidencia un alto porcentaje de fruta con diámetro ecuatorial inferior al requerido (Pareja)",
    frutaVerde: "Fruta con inicios de maduración color verde manzana (°3)",
    descompuesta: "Se reporta alto porcentaje de fruta descompuesta.",
    sombra: "Fruta con alto porcentaje de sombra, superior a los establecido en la FT.",
    alsinoe:"Se evidencia alta incidencia de fruta con Elsinoe.",
    trips:"Se evidencia alto porcentaje de fruta con daño por Trips (Mancha).",
    wood: "Se reporta presencia de wood pocket.",
    escama: "Se evidencia fruta con presencia de escama.",
    frutaMadura: "Fruta madura, coloración amarilla (°4-°5-°6)",
    division:"Se evidencia fruta con presencia de escama.",
    fumagina:"Se evidencia fruta con presencia de escama.",
    grillo:"Se evidencia fruta con presencia de escama.",
    herbicida:"Se evidencia fruta con presencia de escama.",
    piel:"Se evidencia fruta con presencia de escama.",
    nutrientes:"Se evidencia fruta con presencia de escama.",
    antracnosis:"Se evidencia fruta con presencia de escama.",
    frutaRajada:"Se evidencia fruta con presencia de escama.",
    ombligona:"Se evidencia fruta con presencia de escama.",
    despezonada:"Se evidencia fruta con presencia de escama.",
    hojas:"Exceso de hojas",
    suelo:"Se cayo mucha fruta"
  };
  const balin = lote.descarteLavado.balin + lote.descarteEncerado.balin;
  const extra = lote.descarteLavado.pareja + lote.descarteEncerado.pareja;
  const descompuesta = lote.descarteLavado.descompuesta + lote.descarteEncerado.descompuesta;
  let filteredObj = Object.fromEntries(
    Object.entries(lote.calidad.clasificacionCalidad._doc).filter(([key,]) => key !== "fecha" && key !== "descarteGenerl"));
  filteredObj = {...filteredObj,...lote.descarteLavado._doc,...lote.descarteEncerado._doc, balin:balin, extra:extra, descompuesta:descompuesta };
  const top3Keys = Object.entries(filteredObj)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 3)
    .map(([key,]) => key);
  for(let i=0; i<top3Keys.length; i++){
    worksheet = await llenar_y_sumar_celda(worksheet, `A${i + celda}`, observaciones[top3Keys[i]]);
  }
  return worksheet;
};
const agregar_fotos = async (workbook, worksheet, lote) => {
  const fotosPaths = lote.calidad.fotosCalidad._doc;
  const keys = Object.keys(fotosPaths);
  let i = 0;
  let n = 0;
  let j = 0;
  while(i < keys.length){
    const imageId = workbook.addImage({
      buffer: fs.readFileSync(fotosPaths[keys[i]]),
      extension: "png",
    });
    
    if(n%2 === 0){
      worksheet.addImage(imageId, `A${73 + (j * 11)}:E${82 + (j * 11)}`);
      worksheet = await llenar_celda(worksheet, `A${83 + (j * 11)}`, keys[i]);
    } else {
      worksheet.addImage(imageId, `F${73 + (j * 11)}:H${82 + (j  * 11)}`);
      worksheet = await llenar_celda(worksheet, `F${83 + (j * 11)}`, keys[i]);
      j++;
    }
    n++;
    i++;
  }
  return worksheet;
};
const llenar_precios = async (worksheet, precios, lote) => {
  worksheet = await llenar_celda(worksheet, "G13", precios.exportacion1);
  worksheet = await llenar_celda(worksheet, "G14", precios.exportacion15);
  let descarteStop;
  if(lote.tipoFruta === "Limon"){
    descarteStop = 33;

  } else {
    descarteStop = 36;
  }
  for(let i = 17; i<= descarteStop; i++){
    worksheet = await llenar_celda(worksheet, `G${i}`, precios.descarte);
  }

  if(lote.tipoFruta === "Limon"){
    worksheet = await llenar_celda(worksheet, "G36", precios.nacional);
  } else {
    worksheet = await llenar_celda(worksheet, "G33", precios.pareja);
    worksheet = await llenar_celda(worksheet, "G35", precios.nacional);
  }
  return worksheet;

};

module.exports = {
  llenar_cabecera,
  llenar_exportacion,
  llenar_descarte_Limon,
  llenar_pruebas_plataforma,
  llenar_observaciones,
  agregar_fotos,
  llenar_descarte_Naranja,
  llenar_celda,
  llenar_y_sumar_celda,
  llenar_precios
};