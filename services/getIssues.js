//  "1234tima.g@gmail.com:bOuhKUmKZopzvL90hPjd07EC",
// https://test-fast.atlassian.net
// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
const express = require("express");
const fetch = require("node-fetch");
const initialObj = {
  BACKLOG: { Medium: [], Low: [], Lowest: [], High: [], Highest: [] },
  SFD: { Medium: [], Low: [], Lowest: [], High: [], Highest: [] },
  PROGRESS: { Medium: [], Low: [], Lowest: [], High: [], Highest: [] },
  DONE: { Medium: [], Low: [], Lowest: [], High: [], Highest: [] },
};

const getPriority = item => {
  return item.fields.priority.name;
};

const getStatus = statusName => {
  if (statusName === "Backlog") {
    return "BACKLOG";
  } else if (statusName === "Selected for Development") {
    return "SFD";
  } else if (statusName === "In Progress") {
    return PROGRESS;
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
  };
};
const getIssues = () => {
  return fetch(
    "https://test-fast.atlassian.net/rest/api/3/search?jql=issuetype+in+standardIssueTypes()+ORDER+BY+created+DESC",
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(
          "1234tima.g@gmail.com:bOuhKUmKZopzvL90hPjd07EC",
        ).toString("base64")}`,
        Accept: "application/json",
      },
    },
  )
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
          console.log(item.fields.assignee.displayName);
          displayName = item.fields.assignee.displayName;
        }
        if (!assignees.displayName) {
          assignees[displayName] = initialObj;
        }

        const singleIssue = makeSingleIssue(item);
        const statusName = item.fields.status.name;
        const resStatus = getStatus(statusName);
        const priority = getPriority(item);
          console.log(statusName)
          console.log(priority)
          console.log(singleIssue);
          console.log(idx);
        // assignees[displayName][resStatus][priority].push(singleIssue);
        // console.log(assignees);
      });

      return assignees;
    })
    .catch(err => console.error(err));
};
module.exports = getIssues;
