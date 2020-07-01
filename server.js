const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const getIssues = require("./services/getIssues");
const byFilter = require("./services/byFilter");
const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" },
);

dotenv.config({ path: path.join(__dirname, ".env") });
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors({ origin: "*", methods: ["GET"] }));

app.get("/api/issues/:jql", async (req, res) => {
  const jql = req.params.jql;
  const issues = await getIssues(jql);
  return res.json(issues);
});

app.get("/api/sepcified/:jql", async (req, res) => {
  const jql = req.params.jql;
  const issues = await byFilter(jql);
  return res.json(issues);
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`),
);
