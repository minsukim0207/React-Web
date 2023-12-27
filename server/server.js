const express = require("express");
const oracledb = require("oracledb");
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());

const dbConfig = {
  user: "KHCAFE",
  password: "KHCAFE",
  connectString: "localhost:1521/XE",
};

app.use(express.json());

async function runQuery(sql, binds = [], options = {}) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(sql, binds, options);

    return result.rows.map((row) => ({
      ID: row[0],
      TASK: row[1],
    }));
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
}

app.get("/", (request, response) => {
  response.send("");
});

app.get("/movie", (request, response) => {
  response.send("");
});
app.get("/game", (request, response) => {
  response.send("");
});
app.get("/todos", (request, response) => {
  response.send("");
});
app.get("/blog", (request, response) => {
  response.send("");
});
