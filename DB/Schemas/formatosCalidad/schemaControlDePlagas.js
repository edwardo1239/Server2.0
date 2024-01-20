const mongoose = require("mongoose");

const conn = mongoose.createConnection(process.env.MONGO_URL_PERSONAL);


const areaSchema = new mongoose.Schema({
  area_control_puertas: Boolean,
  area_control_ventanas_observaciones: String,
  area_control_accion_rejillas_observaciones: String,
  area_control_accion_areasLimpias_observaciones: String,
  area_control_areasLimpias_observaciones: String,
  area_control_espacios_observaciones: String,
  area_control_accion_ventanas_observaciones: String,
  area_control_puertas_observaciones: String,
  area_control_estado_observaciones: String,
  area_control_mallas: Boolean,
  area_control_accion_contenedores_observaciones: String,
  responsable: String,
  fecha: { type: Date, default: Date.now },

  // Propiedades del área de cebo
  area_cebo_accion_consumo_observaciones: String,
  area_cebo_consumo_observaciones: String,
  area_cebo_consumo: Boolean,

  // Propiedades del área de hallazgos
  area_hallazgos_accion_huellas_observaciones: String,
  area_hallazgos_accion_manchas_observaciones: String,
  area_hallazgos_insectos: Boolean,
  area_hallazgos_insectos_observaciones: String,
  area_hallazgos_accion_olores_observaciones: String,
  area_hallazgos_accion_cucarachas_observaciones: String,
  area_hallazgos_olores_observaciones: String,
  area_hallazgos_hormigas: Boolean,
  area_hallazgos_accion_madrigueras_observaciones: String,
  area_hallazgos_accion_excremento_observaciones: String,
  area_hallazgos_otras: Boolean,
  area_hallazgos_cucarachas: Boolean,
  area_hallazgos_accion_otras_observaciones: String,
  area_hallazgos_huellas_observaciones: String,
  area_hallazgos_sonidos: Boolean,
  area_hallazgos_manchas: Boolean,
  area_hallazgos_madrigueras_observaciones: String,
  area_hallazgos_hormigas_observaciones: String,
  area_hallazgos_madrigueras: Boolean,
  area_hallazgos_accion_sonidos_observaciones: String,
  area_hallazgos_manchas_observaciones: String,
  area_hallazgos_pelos: Boolean,
  area_hallazgos_roedores: Boolean,
  area_hallazgos_excremento_observaciones: String,
  area_hallazgos_accion_hormigas_observaciones: String,
  area_hallazgos_olores: Boolean,
  area_hallazgos_excremento: Boolean,
  area_hallazgos_accion_insectos_observaciones: String,
  area_hallazgos_pelos_observaciones: String,
  area_hallazgos_accion_pelos_observaciones: String,
  area_hallazgos_accion_roedores_observaciones: String,
  area_hallazgos_roedores_observaciones: String,
  area_hallazgos_cucarachas_observaciones: String,
  area_hallazgos_sonidos_observaciones: String,
});

const ControlDePlagas = conn.model("ControlDePlagas", areaSchema);

module.exports.ControlDePlagas = ControlDePlagas;
