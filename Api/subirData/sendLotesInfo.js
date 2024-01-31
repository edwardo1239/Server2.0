require("dotenv").config({ path: "../../.env" });

const { Lotes } = require("../../DB/Schemas/lotes/schemaLotes");
const { recordLotes } = require("../../DB/Schemas/lotes/schemaRecordLotes");
const { connectProcesoDB } = require("../../DB/config/configDB");


(async function sendLotes() {
  try {
    console.log("Se subio los datos al drive");

    let fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    let fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);
    const db = await connectProcesoDB();

    const historialLotes = await recordLotes.find({ fecha: { $gte: fechaInicio, $lt: fechaFin } }, "documento -_id");
    const enfs = historialLotes.map(item => item.documento._id);
    const enfSet = new Set(enfs);
    const enf = [...enfSet];

    const lotes = await Lotes.find({ _id: enf });

    const url = process.env.URL_API_DRIVE_LOTES;

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
