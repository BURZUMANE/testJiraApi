const fetch = require("node-fetch");

const byFilter = jql => {
  return fetch(`https://test-fast.atlassian.net/rest/api/3/search?jql=${jql}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.KEY).toString("base64")}`,
      Accept: "application/json",
    },
  })
    .then(response => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      // console.log(data.issues);
      const issues = data.issues.map(item => {
        // console.log(item.fields.project.avatarUrls);
        const { key } = item;
        const { summary, created, resolution } = item.fields;
        const priority = item.fields.priority.iconUrl;
        return { summary, key, created, resolution, priority };
      });
      return issues;
    })
    .catch(err => console.error(err));
};

module.exports = byFilter;
