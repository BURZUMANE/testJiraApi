//  "1234tima.g@gmail.com:bOuhKUmKZopzvL90hPjd07EC",
// https://test-fast.atlassian.net
// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
const fetch = require("node-fetch");
const _ = require("lodash");
const initialObject = {
  BACKLOG: {
    Bug: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Task: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Epic: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Story: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
  },
  SFD: {
    Bug: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Task: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Epic: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Story: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
  },
  PROGRESS: {
    Bug: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Task: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Epic: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Story: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
  },
  DONE: {
    Bug: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Task: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Epic: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
    Story: {
      Highest: { jql: "", content: [] },
      High: { jql: "", content: [] },
      Medium: { jql: "", content: [] },
      Low: { jql: "", content: [] },
    },
  },
};

const getPriority = item => {
  return item.fields.priority.name;
};
const getTaskType = item => {
  return item.fields.issuetype.name;
};

const getStatus = statusName => {
  if (statusName === "Backlog") {
    return "BACKLOG";
  } else if (statusName === "Selected for Development") {
    return "SFD";
  } else if (statusName === "In Progress") {
    return "PROGRESS";
  } else {
    return "DONE";
  }
};
const makeSingleIssue = item => {
  return {
    id: item.id,
    name: item.fields.summary,
    created: item.fields.created,
    duedate: item.fields.duedate,
    priority: item.fields.priority.name,
  };
};
const getIssues = jql => {
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
      const issues = data.issues;
      const assignees = {};
      issues.map((item, idx) => {
        let displayName = "";
        if (!item.fields.assignee) {
          displayName = "unassigned";
        } else {
          displayName = item.fields.assignee.displayName.split(" ").join("");
        }
        if (!(displayName in assignees)) {
          assignees[displayName] = _.cloneDeep(initialObject);
          // assignees[displayName].accountId = item.fields.assignee.accountId;
        } else {
        }
        let accountId;
        if (!item.fields.assignee) {
          accountId = "EMPTY";
        } else {
          accountId = item.fields.assignee.accountId;
        }
        const singleIssue = makeSingleIssue(item)
          ? makeSingleIssue(item)
          : null;
        const statusName = item.fields.status.name;
        const resStatus = getStatus(statusName);
        const priority = getPriority(item);
        const taskType = getTaskType(item);
        const jqlStr = `issuetype%20%3D%20${taskType}%20AND%20assignee%20in%20(${accountId})%20AND%20status%20%3D%20${statusName}%20AND%20priority%20%3D%20${priority}`;
        assignees[displayName][resStatus][taskType][priority]["jql"] = jqlStr;
        assignees[displayName][resStatus][taskType][priority]["content"].push(
          singleIssue,
        );
      });

      return assignees;
    })
    .catch(err => console.error(err));
};

module.exports = getIssues;
