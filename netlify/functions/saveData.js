const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método no permitido",
    };
  }

  try {
    const data = JSON.parse(event.body);
    const filePath = path.join(__dirname, "../../data/registros.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return {
      statusCode: 200,
      body: JSON.stringify({ mensaje: "Guardado con éxito" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al guardar los datos", detalle: error.message }),
    };
  }
};
