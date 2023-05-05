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

async function fetchPullsByLabel(repo, label) {
  const q = {
    repo: repo,
    is: 'pr',
    label: `"${label.replaceAll(/\s/g, '+')}"`,
  };

  const qString = Object.keys(q)
    .map((key) => `${key}:${q[key]}`)
    .join('+');

  const pulls = await httpRequest({
    path: '/search/issues',
    query: `q=${encodeURI(qString)}+is:open`,
  });

  return pulls.items;
}
async function fetchPullMergeCommit(pull) {
  const pullData = await httpRequest({
    path: (new URL(pull.pull_request.url)).pathname,
  });

  return pullData.head.sha;
}

export async function fetchPulls(repo, label) {
  return [
    {
      "title": "fix: video back button area",
      "sha": "9558ecc936d6ac1be40e3a3827729118aab06a2e",
      "comments": "No conflicts, can be merged",
      "pullNumber": 1029
    },
    {
      "title": "Jury moderation",
      "sha": "f669a7097efde49d9f4d0e2b14c4388da6d442fa",
      "comments": "No conflicts, can be merged",
      "pullNumber": 1027
    },
    {
      "title": "fix: livestream player, chat encryption",
      "sha": "b15bfaf97a588d2d4ad0d06980c23622705bae30",
      "conflictLevel": 1,
      "concurrency": [
        {
          "title": "feat: mobile app update ui",
          "sha": "22e87306ec80fe29892f2a09cbdffb998b06ac05"
        }
      ],
      "comments": "Resolve conflicts between branches",
      "pullNumber": 1032
    },
    {
      "title": "feat: mobile app update ui",
      "sha": "22e87306ec80fe29892f2a09cbdffb998b06ac05",
      "conflictLevel": 1,
      "concurrency": [
        {
          "title": "fix: livestream player, chat encryption",
          "sha": "b15bfaf97a588d2d4ad0d06980c23622705bae30"
        }
      ],
      "comments": "Resolve conflicts between branches",
      "pullNumber": 1030
    },
    {
      "title": "fix: loc left-footer; howtobuy & leftpanel styles",
      "sha": "2ace254fcf62be63f1a75b70b48ffe6acb826442",
      "conflictLevel": 1,
      "concurrency": [
        {
          "title": "feat: clear local storage",
          "sha": "ebeb802c837082391860c254aa2606687e49ac07"
        }
      ],
      "comments": "Resolve conflicts between branches",
      "pullNumber": 1031
    },
    {
      "title": "feat: clear local storage",
      "sha": "ebeb802c837082391860c254aa2606687e49ac07",
      "conflictLevel": 1,
      "concurrency": [
        {
          "title": "fix: loc left-footer; howtobuy & leftpanel styles",
          "sha": "2ace254fcf62be63f1a75b70b48ffe6acb826442"
        }
      ],
      "comments": "Resolve conflicts between branches",
      "pullNumber": 1028
    }
  ];

  const labeledPulls = await fetchPullsByLabel(repo, label);

  const mergeCommits = [];

  for (let i = 0; i < labeledPulls.length; i++) {
    mergeCommits.push({
      pullNumber: labeledPulls[i].number,
      title: labeledPulls[i].title,
      sha: await fetchPullMergeCommit(labeledPulls[i]),
    });
  }

  return mergeCommits;
}
