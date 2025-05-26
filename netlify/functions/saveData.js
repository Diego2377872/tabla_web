const { Octokit } = require("@octokit/core");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método no permitido",
    };
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;
  const path = "data.json";

  const octokit = new Octokit({ auth: token });

  try {
    // Nuevo dato desde el formulario
    const nuevoRegistro = JSON.parse(event.body);

    // Obtenemos el archivo actual (si existe)
    let registros = [];
    let sha;

    try {
      const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path,
      });

      const content = Buffer.from(response.data.content, "base64").toString("utf-8");
      registros = JSON.parse(content);
      sha = response.data.sha;

    } catch (error) {
      if (error.status !== 404) throw error;
      // Si el archivo no existe, empezamos con un array vacío
      registros = [];
    }

    // Agregamos el nuevo registro al array
    registros.push(nuevoRegistro);

    const newContent = Buffer.from(JSON.stringify(registros, null, 2)).toString("base64");
    const commitMessage = "Agregar nuevo registro desde formulario web";

    // Guardamos el nuevo contenido en GitHub
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path,
      message: commitMessage,
      content: newContent,
      sha,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ mensaje: "Guardado correctamente" }),
    };
  } catch (error) {
    console.error("Error al guardar datos:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
