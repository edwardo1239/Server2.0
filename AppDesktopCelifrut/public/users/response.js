const responseUser = {
  logIn: async data => {
    if (data.data === 401) {
      return { status: 401, data:{}};
    } else if (data.data === 402) {
      return { status: 402, data:{}};
    }
    return { status: 200, data: data.data };
  },
  obtenerPermisosUsuario: async data => {
    return { status: 200, data: data.data };
  },
  crearUsuario: async () => {
    return { status: 200 };
  },
};

module.exports = {
  responseUser,
};
