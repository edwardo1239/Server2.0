require("dotenv").config({ path: "../../.env" });
const { Lotes } = require("../../DB/Schemas/lotes/schemaLotes");
const { connectProcesoDB } = require("../../DB/config/configDB");

(async function crearInformesCalidad() {
  try {
    console.log("Se creo un informe");

    await connectProcesoDB();

    const lotes = await Lotes.find({
      $and: [
        { informeEnviado: false },
        { exportacion: { $exists: true } },
        { "calidad.calidadInterna": { $exists: true } },
        { "calidad.clasificacionCalidad": { $exists: true } },
        { "calidad.fotosCalidad": { $exists: true } }
      ]
    });
    

    const url = process.env.URL_API_DRIVE_INFORMES_CALIDAD;

    for (const lote of lotes) {
 
      if (lote.deshidratacion <= 8) {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            action: "crearInforme",
            data: lote,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        const data = await response.json();
        if (data.status === 200) {
          lote.urlInformeCalidad = await data.data;
          lote.informeEnviado = true;
          await lote.save();
        }
        else{
          console.log("server 401 response", data);
        }
      }
    }
  } catch (e) {
    console.error(`error :${e.name}: ${e.message}`);
  }
})();
