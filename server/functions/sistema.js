const { logger } = require("../error/config");
const { iniciarRedisDB } = require("../../DB_redis/config/init");
const { connectProcesoDB } = require("../../DB/config/configDB");
const { Lotes } = require("../DB/mongoDB/schemas/lotes/schemaLotes");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { Contenedores } = require("../DB/mongoDB/schemas/contenedores/schemaContenedores");
const { default: mongoose } = require("mongoose");
const { llenar_cabecera, llenar_exportacion, llenar_descarte_Limon, llenar_pruebas_plataforma, llenar_observaciones, agregar_fotos } = require("./crear_informe_calidad");

const reiniciar_valores_del_sistema = async () => {
  try{
    const cliente = await iniciarRedisDB();
    await cliente.set("kilosVaciadosHoy", 0);
    await cliente.set("kilosProcesadosHoy", 0);
    await cliente.set("inicioProceso", 0);
    await cliente.set("kilosProcesadosHora", 0);
    await cliente.set("horas", 0);
    await cliente.set("kilosExportacionHoy", 0);
    await cliente.set("kilosExportacionHora", 0);
  } catch(e){
    logger.error(e);
  }
};

const valoresDelSistema_por_hora = async () =>{
  try{
    const cliente = await iniciarRedisDB();
    
    const inicioProceso = await cliente.get("inicioProceso");
    if(Number(inicioProceso) !== 0){
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
      if(horas === 0){
        kilosProcesadosHora = 0;
        kilosExportacionHora = 0;
      } 
      else {
        kilosProcesadosHora = Number(kilosProcesados) / horas;
        kilosExportacionHora = Number(kilosExportacion) / horas;
      }
      if (isNaN(kilosProcesados) || isNaN(kilosExportacion)){
        await cliente.set("kilosProcesadosHora", 0);
        await cliente.set("kilosExportacionHora", 0);
      }
      await cliente.set("kilosProcesadosHora", kilosProcesadosHora);
      await cliente.set("kilosExportacionHora", kilosExportacionHora);
    
    }
  } catch(e){
    logger.error(e.message);
  }
};
  
const crear_informes_calidad = async (data) => {
  try{
    await connectProcesoDB();
    const lote = await Lotes.findById(data._id).populate("predio", "PREDIO ICA DEPARTAMENTO GGN");
    const contIds = lote.contenedores.map(item => new mongoose.Types.ObjectId(item));
    const contenedores = await Contenedores.find({_id:contIds});

    if(!(lote.calidad.fotosCalidad && lote.calidad.calidadInterna && lote.calidad.clasificacionCalidad)){
      logger.error(`Error al crear el informe ${lote.enf}, falta un elemento de calidad`);
      return null;
    }
    const workbook = new ExcelJS.Workbook();
    let sheetName;
    if(lote.tipoFruta === "Limon"){
      await workbook.xlsx.readFile("C:/Users/USER-PC/Documents/Servidor/Servidor2.0/server/doc/informeCalidad/FORMATO INFORME LIMON TAHITI.xlsx");
      sheetName = "Informe Limón ";
    }
    let  worksheet = workbook.getWorksheet(sheetName);
    //se llena la cabecera del informe
    worksheet = await llenar_cabecera(worksheet, lote, contenedores);
    //llenar exportacion
    worksheet = await llenar_exportacion(worksheet, lote);
    //llenar descarte
    if(lote.tipoFruta === "Limon"){
      worksheet = await llenar_descarte_Limon(worksheet, lote);
    }
    //se llena las pruebas de plataforma
    worksheet = await llenar_pruebas_plataforma(worksheet, lote);
    // se llenan las observaciones
    worksheet = await llenar_observaciones(worksheet, lote);
    //se agregan las fotos
    await agregar_fotos(workbook, worksheet, lote);


    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    let ruta;
    if(lote.tipoFruta === "Limon"){
      ruta =  "G:/Mi unidad/Informes_Calidad/Informes Limon";
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
    await workbook.xlsx.writeFile(
      `${rutaMes}/${lote.enf} ${lote.predio.PREDIO} ${lote.tipoFruta}.xlsx`,
    );

  } catch(e){
    console.log(e);
    logger.error(e.message);
  }
};



module.exports ={
  valoresDelSistema_por_hora,
  reiniciar_valores_del_sistema,
  crear_informes_calidad
};