const { Octokit } = require("@octokit/core");

exports.handler = async function () {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;

  const octokit = new Octokit({ auth: token });

  try {
    const file = await octokit.request("GET /repos/{owner}/{repo}/contents/data.json", {
      owner,
      repo,
      path: "data.json",
    });

    const content = Buffer.from(file.data.content, "base64").toString("utf8");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: content,
    };
  } catch (error) {
    if (error.status === 404) {
      console.warn("Archivo no encontrado, devolviendo lista vacía.");
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: "[]", // Lista vacía si el archivo no existe
      };
    }

    console.error("Error al obtener datos:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
