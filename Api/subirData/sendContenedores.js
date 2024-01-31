require("dotenv").config({ path: "../../.env" });

const { Contenedores } = require("../../DB/Schemas/contenedores/schemaContenedores");
const { recordContenedores } = require("../../DB/Schemas/contenedores/schemaRecordContenedores");
const { connectProcesoDB } = require("../../DB/config/configDB");


(async function sendLotes() {
  try {
    console.log("Se subio los datos al drive");

    let fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    let fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);
    const db = await connectProcesoDB();

    const historialContenedores = await recordContenedores.find({ fecha: { $gte: fechaInicio, $lt: fechaFin } }, "documento -_id");
    const numeroContenedor = historialContenedores.map(item => item.documento);
    const numeroContenedorSet = new Set(numeroContenedor);
    const contenedorId = [...numeroContenedorSet];

    const lotes = await Contenedores.find({ _id: contenedorId });

    const url = process.env.URL_API_DRIVE_CONTENEDORES;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        action: "guardarMatriz",
        data: lotes,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    await db.close();
    console.log(data);
  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
  } 
})();
