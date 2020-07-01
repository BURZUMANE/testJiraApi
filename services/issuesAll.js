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
const setPriority = (assigneeName, assignees, item, status, singleIssue) => {
  if (typeof assigneeName === "object") {
    assigneeName = assigneeName[0];
  }
  const priorityName = item.fields.priority.name;
  if (priorityName === "Highest") {
    assignees[assigneeName][status][priorityName].push(singleIssue);
  } else if (priorityName === "High") {
    assignees[assigneeName][status][priorityName].push(singleIssue);
  } else if (priorityName === "Medium") {
    assignees[assigneeName][status][priorityName].push(singleIssue);
  } else if (priorityName === "Low") {
    assignees[assigneeName][status][priorityName].push(singleIssue);
    // console.log(assignees.unassigned[status]["Low"]);
  } else {
    assignees.unassigned.Lowest.push(singleIssue);
  }
};
const makeSingleIssue = item => {
  return {
    id: item.fields.issuetype.id,
    desc: item.fields.issuetype.description,
    name: item.fields.issuetype.name,
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
    .then(text => {
      const issues = text.issues;
      const assignees = {};
      issues.map(item => {
        if (!item.fields.assignee) {
          if (!assignees.unassigned) {
            assignees.unassigned = initialObj;
          } else {
            // assignees.unassigned = { ...assignees.unassigned };
          }
          const singleIssue = makeSingleIssue(item);
          const statusName = item.fields.status.name;
          if (statusName === "Backlog") {
            setPriority("unassigned", assignees, item, "BACKLOG", singleIssue);
          } else if (statusName === "Selected for Development") {
            setPriority("unassigned", assignees, item, "SFD", singleIssue);
          } else if (statusName === "In Progress") {
            setPriority("unassigned", assignees, item, "PROGRESS", singleIssue);
          } else {
            setPriority("unassigned", assignees, item, "DONE", singleIssue);
          }
        }
      });
      return assignees;
    })
    .catch(err => console.error(err));
};
module.exports = getIssues;
