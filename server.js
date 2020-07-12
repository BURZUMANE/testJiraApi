const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const uuid = require("uuid");
const mysql = require("mysql");
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

app.use(express.json());
const connection = mysql.createConnection({
  host: "fries.ctn2zwlhlmzg.eu-central-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  database: "friesbase",
});

connection.connect(err => {
  if (err) throw err;
});

dotenv.config({ path: path.join(__dirname, ".env") });
// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors({ origin: "*", methods: ["GET"] }));

app.get("/api/issues/:jql", async (req, res) => {
  const date = new Date().toISOString();
  let queryString = "";
  try {
    const jql = req.params.jql;
    const issues = await getIssues(jql);
    if (issues) {
      queryString = `INSERT INTO tablet (name, status, date) VALUES ('get all', 'ok', '${date}')`;
      connection.query(queryString, (err, response, fields) => {
        if (err) throw err;

        console.log(response);
      });
    } else {
      queryString = `INSERT INTO tablet (name, status, date) VALUES ('get all', 'bad', '${date}')`;
      connection.query(queryString, (err, response, fields) => {
        if (err) throw err;

        console.log(response);
      });
    }
    return res.json(issues);
  } catch (err) {
    queryString = `INSERT INTO tablet (name, status, date) VALUES ('get all', 'bad', '${date}')`;
    connection.query(queryString, (err, response, fields) => {
      if (err) throw err;

      console.log(response);
    });
    console.log(err);
  }
});

app.get("/api/sepcified/:jql", async (req, res) => {
  const date = new Date().toISOString();
  try {
    const jql = req.params.jql;
    const issues = await byFilter(jql);
    if (issues) {
      queryString = `INSERT INTO tablet (name, status, date) VALUES ('get specified', 'ok', '${date}')`;
      connection.query(queryString, (err, response, fields) => {
        if (err) throw err;

        console.log(response);
      });
    } else {
      queryString = `INSERT INTO tablet (name, status, date) VALUES ('get specified', 'bad', '${date}')`;
      connection.query(queryString, (err, response, fields) => {
        if (err) throw err;

        console.log(response);
      });
    }
    const queryString = `INSERT INTO tablet (name, status, date) VALUES ('get issues by specified filter', 'ok', '${date}')`;
    connection.query(queryString, (err, response, fields) => {
      if (err) throw err;
    });
    return res.json(issues);
  } catch (err) {
    const queryString = `INSERT INTO tablet (name, status, date) VALUES ('get issues by specified filter', 'bad', '${date}')`;
    connection.query(queryString, (err, response, fields) => {
      if (err) throw err;
    });
    console.log(err);
  }
});

app.get("/api/activitylogg/", async (req, res) => {
  try {
    await connection.query(
      "SELECT * FROM friesbase.actions",
      ["actions"],
      (err, response, fields) => {
        if (err) throw err;

        console.log(response);
        return res.json(response);
      },
    );
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 4899;
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`),
);

// UPDATE `friesbase`.`actions` SET `id` = '2', `NAME` = 'dsadsa', `STATUS` = 'dsa', `DATE` = '' WHERE (`id` = '12312');
