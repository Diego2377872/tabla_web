const { Octokit } = require("@octokit/core");

exports.handler = async (event) => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;
  const path = "data.json";

  const { data: fileData } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner,
    repo,
    path,
  });

  const existingData = JSON.parse(Buffer.from(fileData.content, "base64").toString());
  const nuevoRegistro = JSON.parse(event.body);
  existingData.push(nuevoRegistro);

  const updatedContent = Buffer.from(JSON.stringify(existingData, null, 2)).toString("base64");

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner,
    repo,
    path,
    message: "Actualizar data.json",
    content: updatedContent,
    sha: fileData.sha,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
