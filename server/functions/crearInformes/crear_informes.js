const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { llenar_celda, llenar_y_sumar_celda } = require("./funciones_auxiliares_manipular_excel");
const { logger } = require("../../error/config");
const { sendData } = require("../../Process/AppDesktopCelifrut/utils/sendData");


const crear_informe_lista_de_empaque = async (contenedor) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("C:/Users/SISTEMA/Documents/Servidor/Server2.0/server/doc/listaDeEmpaque/plantillaListaDeEmpaque.xlsx");
  let worksheet = workbook.getWorksheet("Lista de empaque");
  //Cliente llenar 
  await llenar_celda(worksheet, "A2", contenedor.infoContenedor.clienteInfo.CLIENTE);
  await llenar_y_sumar_celda(worksheet, "I2", contenedor.numeroContenedor);
  await llenar_celda(worksheet, "D3", contenedor.infoContenedor.tipoFruta);
  const fechaCont = " " + new Date(contenedor.infoContenedor.fechaCreacion).toDateString();
  await llenar_y_sumar_celda(worksheet, "H3", fechaCont);
  let cajasTotal = 0;
  const calibre = { 1: {}, 1.5: {} };

  for (const [index, pallet] of contenedor.pallets.entries()) {
    for (const item of pallet.EF1) {
      // array para la fila
      const rowInfo = [];
      cajasTotal += item.cajas;
      //se ingresa el pallet y el contenedor
      rowInfo.push(String((Number(index) + 1)) + String(contenedor.numeroContenedor));
      //se agrega la fecha en que se ingreso el item
      let fechaItem = new Date(item.fecha);
      rowInfo.push(fechaItem.getMonth() + 1 + "/" + fechaItem.getDate() + "/" + fechaItem.getFullYear());
      //Se añade el label
      const objLabels = await getLabel(item.tipoCaja, contenedor.infoContenedor.tipoFruta, item.calibre);
      let [label, variedad, producto, pesoCaja] = objLabels.label;
      rowInfo.push(label, variedad, producto, pesoCaja + "LB");
      //se añade calidad y calibre
      rowInfo.push(item.calidad);
      rowInfo.push(item.calibre);
      if (!Object.prototype.hasOwnProperty.call(calibre, item.calidad)) {
        calibre[item.calidad] = {};
      }
      if (!Object.prototype.hasOwnProperty.call(calibre[item.calidad], item.calibre)) {
        calibre[item.calidad][item.calibre] = { cantidad: 0, pallet: [] };
      }
      calibre[item.calidad][item.calibre].cantidad += item.cajas;
      calibre[item.calidad][item.calibre].pallet.push(index + 1);
      // se añade el numero de cajas
      rowInfo.push(item.cajas);
      //se añade el ICA
      rowInfo.push(item.lote.ICA);
      //se añade el GGN
      rowInfo.push(item.lote.GGN);
      //fecha de vencimiento ggn
      rowInfo.push(item.lote.VENCIMIENTO);

      //se añade la fila
      const row = worksheet.addRow(rowInfo);
      row.eachCell(cell => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  }

  //se guarda el total de las cajas
  let lastRow = worksheet.rowCount + 1;
  worksheet.mergeCells("A" + lastRow + ":H" + lastRow);
  worksheet.mergeCells("I" + lastRow + ":L" + lastRow);
  worksheet.getCell("A" + lastRow).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFC5E0B3" }
  };
  worksheet.getCell("I" + lastRow).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFC5E0B3" }
  };
  worksheet.getCell("A" + lastRow).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell("I" + lastRow).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  const cellTotalCajasLabel = worksheet.getCell("A" + lastRow);
  cellTotalCajasLabel.value = "Total";
  const cellTotalCajas = worksheet.getCell("I" + lastRow);
  cellTotalCajas.value = cajasTotal;


  //Se agrega el summary por calibre
  const totalCantidadCajas = Object.keys(calibre).reduce(
    (acu, calidad) => acu += Object.keys(calibre[calidad]).reduce(
      (acu2, item) => acu2 += calibre[calidad][item].cantidad, 0), 0);

  Object.keys(calibre).forEach(calidad => {

    //se crea el cuadro de SUMMARY CATEGORY Titulo
    lastRow = worksheet.rowCount + 2;
    worksheet.mergeCells("A" + lastRow + ":C" + lastRow);
    worksheet.getCell("A" + lastRow).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC5E0B3" }
    };
    worksheet.getCell("D" + lastRow).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC5E0B3" }
    };
    worksheet.getCell("A" + lastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("D" + lastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    const cellSummaryCategoryLabel = worksheet.getCell("A" + lastRow);
    cellSummaryCategoryLabel.value = "SUMMARY CATEGORY";
    const cellSummaryCategoryLabelCalidad = worksheet.getCell("D" + lastRow);
    cellSummaryCategoryLabelCalidad.value = calidad;

    //Tipo de datos
    lastRow = worksheet.rowCount + 2;
    const infoSummareHead = ["SIZE", "QTY", "N. PALLETS", "% PRECENTAGE"];
    const rowHeadSummary = worksheet.addRow(infoSummareHead);
    rowHeadSummary.eachCell(cell => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC5E0B3" }
      };
    });


    const totalCantidadCajasCalidad = Object.keys(calibre[calidad]).reduce((acu, item) => acu += calibre[calidad][item].cantidad, 0);
    let porcentageCalidad = 0;
    let palletsCalidad = 0;
    Object.keys(calibre[calidad]).map(item => {
      const itemRow = [];
      itemRow.push(item);
      itemRow.push(calibre[calidad][item].cantidad);
      const palletsSet = new Set(calibre[calidad][item].pallet);
      itemRow.push(palletsSet.size);
      palletsCalidad += palletsSet.size;
      const porcentage = (calibre[calidad][item].cantidad * 100) / totalCantidadCajas;
      porcentageCalidad += porcentage;
      itemRow.push(porcentage.toFixed(2) + "%");
      const row = worksheet.addRow(itemRow);
      row.eachCell(cell => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const totalSummarySize = [];
    totalSummarySize.push("TOTAL");
    totalSummarySize.push(totalCantidadCajasCalidad);
    totalSummarySize.push(palletsCalidad);
    totalSummarySize.push(porcentageCalidad.toFixed(2) + "%");
    const rowTotalSummarySize = worksheet.addRow(totalSummarySize);
    rowTotalSummarySize.eachCell(cell => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });


  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;
  const ruta = "G:/Mi unidad/BD/Contenedores/informes";
  const rutaAño = path.join(ruta, String(año));
  const rutaMes = path.join(rutaAño, String(mes));
  if (!fs.existsSync(rutaAño)) {
    fs.mkdirSync(rutaAño, { recursive: true });
  }
  if (!fs.existsSync(rutaMes)) {
    fs.mkdirSync(rutaMes, { recursive: true });
  }
  await workbook.xlsx.writeFile(
    `${rutaMes}/CONTENEDOR ${contenedor._id} ${contenedor.infoContenedor.nombreCliente}.xlsx`,
  );

  setTimeout(async () => {
    try {
      const responseJSON = await fetch(`
        https://script.google.com/macros/s/AKfycbyhuwWW7ohvBZkbrPPkkZwkcdIpH2iytdH4Q_NUCZIvMy-Atx2QIhQ6MAzvYWEsVDU_mw/exec?nombre=CONTENEDOR ${contenedor._id} ${contenedor.infoContenedor.nombreCliente}.xlsx
      `);
      const response = await responseJSON.json();
      console.log(response);
      const query = {
        data: {
          contenedor: {
            _id: contenedor._id,
            "infoContenedor.urlInforme": response
          }
        },
        collection: "contenedores",
        action: "putContenedor",
        query: "proceso",
        client: "Desktop",
        fn:"PUT"
      };
      await sendData(query);
      console.log("Archivo de Excel modificado y guardado exitosamente");
      return response;
    } catch (e) {
      console.error(e);
      logger.error(e.message);
    }
  }, 10000);

};

async function getLabel(caja, tipoFruta, calibre) {
  const variedades = {
    Limon: "TAHITI",
    Naranja: "Naranja",
  };

  const labels = {
    G: "Kraft Celifrut",
    B: "White Celifrut",
    default: "Celifrut",
  };

  const variedad = variedades[tipoFruta];

  const [tipoCaja, pesoCaja] = caja.split("-");
  const label = labels[tipoCaja] || labels["default"];

  const medida = pesoCaja == 4.5 ? "Kg" : "Lbs";
  const variedadProducto = tipoFruta == "Naranja" ? "Orange" : "Limes";

  return { label: [label, variedad, "COL-" + pesoCaja + medida + " " + variedadProducto + " " + calibre + "ct", pesoCaja] };



}


module.exports = {
  crear_informe_lista_de_empaque
};