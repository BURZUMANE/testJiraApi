const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const getIssues = require("./services/getIssues");
// console.log(getIssues().then(data => console.log(data)));
const app = express();
app.use(morgan("dev"));
app.use(cors({ origin: "*", methods: ["GET"] }));

app.get("/api/issues", async (req, res) => {
  const issues = await getIssues();
  return res.json(issues);
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`),
);
