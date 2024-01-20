const pesoTipoCaja = tipoCaja => {
  switch (tipoCaja) {
  case "G-37":
  case "B-37":
    return 16.1;
  case "G-4.5":
    return 4.5;
  case "B-30":
  case "G-30":
    return 13.5;
  
  case "B-40":
  case "G-40":
    return 18;
  case "Rojo":
  case "Verde":
  case "Zumex":
  case "Granel":
    return 40;
  }
};

module.exports = {pesoTipoCaja};