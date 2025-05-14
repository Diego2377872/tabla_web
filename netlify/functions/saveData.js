const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const dataFile = path.resolve(__dirname, "data.json");
  const newItem = JSON.parse(event.body);

  try {
    let items = [];

    if (fs.existsSync(dataFile)) {
      const fileData = fs.readFileSync(dataFile, "utf8");
      items = JSON.parse(fileData);
    }

    items.push(newItem);

    fs.writeFileSync(dataFile, JSON.stringify(items, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Datos guardados correctamente" }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

