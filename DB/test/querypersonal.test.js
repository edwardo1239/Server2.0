const { User } = require("../Schemas/users/schemaUser");
const { obetenerUsers } = require("../queries/querypersonal");
const { jest, describe, it, expect } = require("@jest/globals");


jest.mock("../queries/querypersonal", () => ({
  find: jest.fn(),
}));

describe("Prueba para obtener usuarios", () =>{
  it("Deberia retornar 401 si no encuentra un usuario", async () => {
    User.find.mockResolverValue([]);

    const data = {
      data:{
        user: "usuarioNoExistente",
      }
    };
    // Llama a la función con los datos de prueba
    const resultado = await obetenerUsers(data);

    // Verifica que los datos del usuario se hayan agregado a data.data
    expect(resultado.data).toBe("admin");
  });
});