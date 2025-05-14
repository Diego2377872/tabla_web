const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    const filePath = path.join(__dirname, "../../data/registros.json");

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf-8");
    }

    const contenido = fs.readFileSync(filePath, "utf-8");
    const datos = JSON.parse(contenido);

    return {
      statusCode: 200,
      body: JSON.stringify(datos),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al leer los datos", detalle: error.message }),
    };
  }
};
