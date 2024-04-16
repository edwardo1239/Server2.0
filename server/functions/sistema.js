require("dotenv").config("../../.env");

const moment = require("moment");
const { logger } = require("../error/config");
const { iniciarRedisDB } = require("../../DB_redis/config/init");
const { Lotes } = require("../DB/mongoDB/schemas/lotes/schemaLotes");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { Contenedores } = require("../DB/mongoDB/schemas/contenedores/schemaContenedores");
const { default: mongoose } = require("mongoose");
const yaml = require("js-yaml");
const {
  llenar_cabecera,
  llenar_exportacion,
  llenar_descarte_Limon,
  llenar_pruebas_plataforma,
  llenar_observaciones,
  agregar_fotos,
  llenar_descarte_Naranja,
  llenar_precios,
} = require("./crear_informe_calidad");
const { Octokit } = require("octokit");
const { connectProcesoDB } = require("../DB/mongoDB/config/configDB");
const { precioFrutaProveedor } = require("../DB/mongoDB/schemas/lotes/schemaPrecioProveedor");

const reiniciar_valores_del_sistema = async () => {
  try {
    const cliente = await iniciarRedisDB();
    await cliente.set("kilosVaciadosHoy", 0);
    await cliente.set("kilosProcesadosHoy", 0);
    await cliente.set("inicioProceso", 0);
    await cliente.set("kilosProcesadosHora", 0);
    await cliente.set("horas", 0);
    await cliente.set("kilosExportacionHoy", 0);
    await cliente.set("kilosExportacionHora", 0);
  } catch (e) {
    logger.error(e);
  }
};

const valoresDelSistema_por_hora = async () => {
  try {
    const cliente = await iniciarRedisDB();

    const inicioProceso = await cliente.get("inicioProceso");
    if (Number(inicioProceso) !== 0) {
      const horaInicio = new Date(inicioProceso).getHours();
      const horaActual = new Date().getHours();
      let horas = await cliente.get("horas");
      const kilosProcesados = await cliente.get("kilosProcesadosHoy");
      const kilosExportacion = await cliente.get("kilosExportacionHoy");

      console.log(kilosExportacion);
      console.log(horas);

      horas += horaActual - horaInicio;
      let kilosProcesadosHora;
      let kilosExportacionHora;
      if (horas === 0) {
        kilosProcesadosHora = 0;
        kilosExportacionHora = 0;
      } else {
        kilosProcesadosHora = Number(kilosProcesados) / horas;
        kilosExportacionHora = Number(kilosExportacion) / horas;
      }
      if (isNaN(kilosProcesados) || isNaN(kilosExportacion)) {
        await cliente.set("kilosProcesadosHora", 0);
        await cliente.set("kilosExportacionHora", 0);
      }
      await cliente.set("kilosProcesadosHora", kilosProcesadosHora);
      await cliente.set("kilosExportacionHora", kilosExportacionHora);
    }
  } catch (e) {
    logger.error(e.message);
  }
};

const crear_informes_calidad = async data => {
  try {
    await connectProcesoDB();
    const lote = await Lotes.findById(data._id).populate("predio", "PREDIO ICA DEPARTAMENTO GGN");
    const contIds = lote.contenedores.map(item => new mongoose.Types.ObjectId(item));
    const contenedores = await Contenedores.find({ _id: contIds });

    const fechaLote = new Date(lote.fechaIngreso);
    const annoLote = fechaLote.getFullYear();
    const fechaLoteSemana = moment(lote.fechaIngreso);
    const semanaLote = fechaLoteSemana.week();
    const precios = await precioFrutaProveedor.find({ anno: annoLote, semana: semanaLote })
      .sort({fechaIngreso:-1});

    if (!(lote.calidad.fotosCalidad && lote.calidad.calidadInterna && lote.calidad.clasificacionCalidad)) {
      logger.error(`Error al crear el informe ${lote.enf}, falta un elemento de calidad`);
      return null;
    }
    const workbook = new ExcelJS.Workbook();
    let sheetName;
    if (lote.tipoFruta === "Limon") {
      await workbook.xlsx.readFile(
        "C:/Users/SISTEMA/Documents/Servidor/Server2.0/server/doc/informeCalidad/FORMATO INFORME LIMON TAHITI.xlsx",
      );
      sheetName = "Informe Limón ";
    } else {
      await workbook.xlsx.readFile(
        "C:/Users/SISTEMA/Documents/Servidor/Server2.0/server/doc/informeCalidad/FORMATO INFORME NARANJA.xlsx",
      );
    }
    let worksheet = workbook.getWorksheet(sheetName);
    //se llena la cabecera del informe
    worksheet = await llenar_cabecera(worksheet, lote, contenedores);
    //llenar exportacion
    worksheet = await llenar_exportacion(worksheet, lote);
    //llenar descarte
    if (lote.tipoFruta === "Limon") {
      worksheet = await llenar_descarte_Limon(worksheet, lote);
    } else {
      worksheet = await llenar_descarte_Naranja(worksheet, lote);
    }
    //se llena las pruebas de plataforma
    worksheet = await llenar_pruebas_plataforma(worksheet, lote);
    // se llenan las observaciones
    worksheet = await llenar_observaciones(worksheet, lote);
    //se agregan las fotos
    await agregar_fotos(workbook, worksheet, lote);

    if(precios.length > 0){
      worksheet = await llenar_precios(worksheet, precios[0], lote);
    }

    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;

    let ruta;
    if (lote.tipoFruta === "Limon") {
      ruta = "G:/Mi unidad/Informes_Calidad/Informes Limon";
    } else {
      ruta = "G:/Mi unidad/Informes_Calidad/Informes Naranja";
    }
    const rutaAño = path.join(ruta, String(año));
    const rutaMes = path.join(rutaAño, String(mes));
    if (!fs.existsSync(rutaAño)) {
      fs.mkdirSync(rutaAño, { recursive: true });
    }
    if (!fs.existsSync(rutaMes)) {
      fs.mkdirSync(rutaMes, { recursive: true });
    }
    //Se guarda el documento
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const fechaIngreso = new Date(lote.fechaIngreso);
    const diaIngreso = fechaIngreso.getDate();
    const mesIngreso = meses[fechaIngreso.getMonth()];
    const yearIngreso = fechaIngreso.getFullYear();
    await workbook.xlsx.writeFile(`${rutaMes}/${lote.enf} ${lote.predio.PREDIO} ${lote.kilos}kg ${diaIngreso} ${mesIngreso} ${yearIngreso}.xlsx`);

    setTimeout(async () => {
      try {
        const responseJSON = await fetch(`
        https://script.google.com/macros/s/AKfycbzn5M6Nl0jdIPcmJPnKYsQefbSl8JZaYPfM5sp6ZlpFrZ24I45rEHH1EX19x1v4V-cf/exec?nombre=${lote.enf} ${lote.predio.PREDIO} ${lote.kilos}kg ${diaIngreso} ${mesIngreso} ${yearIngreso}.xlsx&tipoFruta=${lote.tipoFruta}
        `);
        const response = await responseJSON.json();

        lote.urlInformeCalidad = response;
        await lote.save();
      } catch (e) {
        console.error(e);
      }
    }, 10000);
  } catch (e) {
    console.log(e.message);
    logger.error(e.message);
  }
};

const check_CelifrutDesktopApp_upload = async () => {
  try {
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const response = await octokit.request(
      "GET /repos/edwardo1239/AplicacionEscritorioCelifrutTypeScript/releases/latest",
      {
        owner: "edwardo1239",
        repo: "https://github.com/edwardo1239/AplicacionEscritorioCelifrutTypeScript",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    let fileContents = fs.readFileSync(
      "C:/Users/SISTEMA/Documents/Servidor/Server2.0/Files/celifrutAppDeskTop/latest.yml",
      "utf8",
    );
    let data = yaml.load(fileContents);

    if (data.version !== response.data.tag_name) {
      console.log("entra a bajar la aplicacion app desktop");
      for (const asset of response.data.assets) {
        const response2 = await octokit.request(`GET ${asset.browser_download_url}`, {
          owner: "edwardo1239",
          repo: "https://github.com/edwardo1239/AplicacionEscritorioCelifrutTypeScript",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const buffer = await Buffer.from(response2.data);
        fs.writeFileSync(
          path.join("C:/Users/SISTEMA/Documents/Servidor/Server2.0/Files/celifrutAppDeskTop/", asset.name),
          buffer,
        );
      }
    }

  } catch (e) {
    console.error(e.message);
  }
};


module.exports = {
  valoresDelSistema_por_hora,
  reiniciar_valores_del_sistema,
  crear_informes_calidad,
  check_CelifrutDesktopApp_upload,
};
