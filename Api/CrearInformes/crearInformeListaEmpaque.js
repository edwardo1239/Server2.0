require("dotenv").config({ path: "../../.env" });
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { connectProcesoDB } = require("../../DB/config/configDB");
const { Lotes } = require("../../DB/Schemas/lotes/schemaLotes");
const { Proveedores } = require("../../DB/Schemas/proveedores/schemaProveedores");

process.on("message", async contenedor => {
  const db = await connectProcesoDB();

  try {
    const proveedores = await Proveedores.find();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("./Files/listaDeEmpaque/plantillaListaDeEmpaque.xlsx");
    const worksheet = workbook.getWorksheet("Lista de empaque");

    //Cliente
    const cellCliente = worksheet.getCell("A2");
    cellCliente.value = contenedor.infoContenedor.nombreCliente;
    const cellContainerNumber = worksheet.getCell("I2");
    cellContainerNumber.value = cellContainerNumber + " " + contenedor._id;
    const cellTipoFruta = worksheet.getCell("D3");
    cellTipoFruta.value = contenedor.infoContenedor.tipoFruta;
    const cellFechaInicio = worksheet.getCell("H3");
    cellFechaInicio.value = cellFechaInicio + " " + new Date(contenedor.infoContenedor.fechaCreacion).toDateString();
    let cajasTotal = 0;
    const calibre = {1:{}, 1.5:{}};

    for (const pallet of Object.keys(contenedor.pallets)) {

      cajasTotal += contenedor.pallets[pallet].cajasTotal;
      for (const item of contenedor.pallets[pallet].EF1) {
        // array para la fila
        const rowInfo = [];
        //se ingresa el pallet y el contenedor
        rowInfo.push(pallet + contenedor._id);
        //se agrega la fecha en que se ingreso el item
        let fechaItem = new Date(item.fecha);
        rowInfo.push(fechaItem.getMonth() + 1 + "/" + fechaItem.getDate() + "/" + fechaItem.getFullYear());
        //Se añade el label
        const objLabels = await getLabel(item.tipoCaja, item.id, item.calibre);
        const lote = objLabels.lote;
        let [label, variedad, producto, pesoCaja] = objLabels.label;
        rowInfo.push(label, variedad, producto, pesoCaja + "LB");
        //se añade calidad y calibre
        rowInfo.push(item.calidad);
        rowInfo.push(item.calibre);
        if(!Object.prototype.hasOwnProperty.call(calibre, item.calidad)){
          calibre[item.calidad] = {};
        }
        if(!Object.prototype.hasOwnProperty.call(calibre[item.calidad], item.calibre)){
          calibre[item.calidad][item.calibre] = {cantidad: 0, pallet: []};
        }
        calibre[item.calidad][item.calibre].cantidad += item.cajas;
        calibre[item.calidad][item.calibre].pallet.push(pallet);
        // se añade el numero de cajas
        rowInfo.push(item.cajas);
        //se añade el ICA
        const proveedor = proveedores.find(proveedor => proveedor.PREDIO === lote.nombrePredio);
        rowInfo.push(proveedor.ICA);
        //se añade el GGN
        rowInfo.push(proveedor.GGN);
        //fecha de vencimiento ggn
        rowInfo.push(proveedor["FECHA VENCIMIENTO GGN"]);

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
    worksheet.mergeCells("A"+lastRow+":H"+lastRow);
    worksheet.mergeCells("I"+lastRow+":L"+lastRow);
    worksheet.getCell("A"+lastRow).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC5E0B3" }
    };
    worksheet.getCell("I"+lastRow).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC5E0B3" }
    };
    worksheet.getCell("A"+lastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell("I"+lastRow).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    const cellTotalCajasLabel = worksheet.getCell("A"+lastRow);
    cellTotalCajasLabel.value = "Total";
    const cellTotalCajas = worksheet.getCell("I"+lastRow);
    cellTotalCajas.value = cajasTotal;

    //Se agrega el summary por calibre
    const totalCantidadCajas = Object.keys(calibre).reduce(
      (acu, calidad) => acu += Object.keys( calibre[calidad]).reduce(
        (acu2, item) => acu2 += calibre[calidad][item].cantidad, 0), 0);

    Object.keys(calibre).forEach(calidad => {

      //se crea el cuadro de SUMMARY CATEGORY Titulo
      lastRow = worksheet.rowCount + 2;
      worksheet.mergeCells("A"+lastRow+":C"+lastRow);
      worksheet.getCell("A"+lastRow).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC5E0B3" }
      };
      worksheet.getCell("D"+lastRow).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC5E0B3" }
      };
      worksheet.getCell("A"+lastRow).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      worksheet.getCell("D"+lastRow).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      const cellSummaryCategoryLabel = worksheet.getCell("A"+lastRow);
      cellSummaryCategoryLabel.value = "SUMMARY CATEGORY";
      const cellSummaryCategoryLabelCalidad = worksheet.getCell("D"+lastRow);
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
        cell.fill = {      type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC5E0B3" }};
      });

      
      const totalCantidadCajasCalidad = Object.keys(calibre[calidad]).reduce((acu, item) => acu +=  calibre[calidad][item].cantidad, 0);
      let porcentageCalidad = 0;
      let palletsCalidad = 0;
      Object.keys(calibre[calidad]).map(item => {
        const itemRow = [];
        itemRow.push(item);
        itemRow.push(calibre[calidad][item].cantidad);
        const palletsSet = new Set(calibre[calidad][item].pallet);
        itemRow.push(palletsSet.size);
        palletsCalidad += palletsSet.size;
        const porcentage = (calibre[calidad][item].cantidad * 100 ) / totalCantidadCajas;
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
    //Se guarda el documento
    await workbook.xlsx.writeFile(
      `${rutaMes}/CONTENEDOR ${contenedor._id} ${contenedor.infoContenedor.nombreCliente}.xlsx`,
    );
    setTimeout(async () => {
      try {
        const responseJSON = await fetch(`
          https://script.google.com/macros/s/AKfycbyhuwWW7ohvBZkbrPPkkZwkcdIpH2iytdH4Q_NUCZIvMy-Atx2QIhQ6MAzvYWEsVDU_mw/exec?nombre=CONTENEDOR ${contenedor._id} ${contenedor.infoContenedor.nombreCliente}.xlsx
        `);
        const response = await responseJSON.json();
        console.log("Archivo de Excel modificado y guardado exitosamente");
        process.send(response);
      } catch (e) {
        console.error(e);
      } finally {
        await db.close();
      }
    }, 10000);

  } catch (e) {
    console.error(e);
  } finally {
    await db.close();
  }
});

async function getLabel(caja, enf, calibre) {
  const variedades = {
    Limon: "TAHITI",
    Naranja: "Naranja",
  };

  const labels = {
    G: "Kraft Celifrut",
    B: "White Celifrut",
    default: "Celifrut",
  };
  
  const lote = await Lotes.findById(enf, "tipoFruta nombrePredio");
  const variedad = variedades[lote.tipoFruta];

  const [tipoCaja, pesoCaja] = caja.split("-");
  const label = labels[tipoCaja] || labels["default"];

  const medida = pesoCaja == 4.5 ? "Kg" : "Lbs";
  const variedadProducto = lote.tipoFruta == "Naranja" ? "Orange" : "Limes";

  return {lote: lote, label:[label, variedad, "COL-" + pesoCaja + medida + " " + variedadProducto + " " + calibre + "ct", pesoCaja]};
  


}
