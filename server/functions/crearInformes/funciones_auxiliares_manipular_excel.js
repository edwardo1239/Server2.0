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

module.exports = {
  llenar_celda,
  llenar_y_sumar_celda
};