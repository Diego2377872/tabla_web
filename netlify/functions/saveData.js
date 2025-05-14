const { Octokit } = require("@octokit/core");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;

  const octokit = new Octokit({ auth: token });

  try {
    const newData = JSON.parse(event.body);

    const file = await octokit.request("GET /repos/{owner}/{repo}/contents/data.json", {
      owner,
      repo,
      path: "data.json",
    });

    const sha = file.data.sha;
    const content = Buffer.from(file.data.content, "base64").toString();
    const jsonData = JSON.parse(content);

    jsonData.push(newData);

    const updatedContent = Buffer.from(JSON.stringify(jsonData, null, 2)).toString("base64");

    await octokit.request("PUT /repos/{owner}/{repo}/contents/data.json", {
      owner,
      repo,
      path: "data.json",
      message: "Actualización desde formulario web",
      content: updatedContent,
      sha,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Guardado con éxito" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
