const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  const dataFile = path.resolve(__dirname, "data.json");

  try {
    let items = [];

    if (fs.existsSync(dataFile)) {
      const fileData = fs.readFileSync(dataFile, "utf8");
      items = JSON.parse(fileData);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
