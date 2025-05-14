const { Octokit } = require("@octokit/core");

exports.handler = async () => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: process.env.REPO_OWNER,
    repo: process.env.REPO_NAME,
    path: 'data.json',
  });

  const content = Buffer.from(response.data.content, 'base64').toString();
  return {
    statusCode: 200,
    body: content,
  };
};
