const { apiDELETE } = require("../query/DELETE");
const { apiGET } = require("../query/GET");
const { apiPOST } = require("../query/POST");
const { apiPUT } = require("../query/PUT");

const api = {
  GET: async (data) => {
    await apiGET[data.query](data);
  },
  POST:  async (data) => {
    await apiPOST[data.query](data);
  },
  PUT: async (data) => {
    await apiPUT[data.query](data);
  },
  DELETE: async (data) => {
    await apiDELETE[data.query](data);
  }
};

module.exports.api = api;