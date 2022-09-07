import https from 'https';

// query, path, authToken
function httpRequest(params) {
  const options = {
    method: 'GET',
    hostname: 'api.github.com',
    path: `${params.path}?${params.query}`,
    port: 443,
    headers: {
      'User-Agent': 'Conflictor Utility',
      'Accept': 'application/vnd.github+json',
    },
  };

  if (params.authToken) {
    options.headers['Authorization'] = params.authToken;
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk.toString();
      });

      res.on('end', (data) => {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function fetchPullsByLabel(label) {
  const q = {
    repo: 'pocketnetteam/pocketnet.gui',
    label,
  };

  const qString = Object.keys(q)
    .map((key) => `${key}:${q[key]}`)
    .join('+');

  const pulls = await httpRequest({
    path: '/search/issues',
    query: `q=${qString}`,
  });

  return pulls.items;
}
async function fetchPullMergeCommit(pull) {
  const pullData = await httpRequest({
    path: (new URL(pull.pull_request.url)).pathname,
  });

  return pullData.head.sha;
}

export async function fetchPulls() {
  const labeledPulls = await fetchPullsByLabel('deploy.dev');

  const mergeCommits = [];

  for (let i = 0; i < labeledPulls.length - 1; i++) {
    mergeCommits.push({
      pullNumber: labeledPulls[i].number,
      title: labeledPulls[i].title,
      sha: await fetchPullMergeCommit(labeledPulls[i]),
    });
  }

  return mergeCommits;
}
