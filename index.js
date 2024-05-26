const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aravindh003_",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to mysql: " + err.stack);
    return;
  }
  console.log("Connected to MySQL");

  connection.query("CREATE DATABASE IF NOT EXISTS records", (err, result) => {
    if (err) {
      console.error("Error creating database: " + err.stack);
      return;
    }
    console.log("Database created");
  });

  connection.query("USE records", (err, result) => {
    if (err) {
      console.error("Error selecting database: " + err.stack);
      return;
    }
    console.log("Database selected");

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS records_table(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            age INT NOT NULL
        )
  `;
    connection.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating table: " + err.stack);
        return;
      }
      console.log("Table created");
    });
  });
});

app.post("/create-record", (req, res) => {
  const { name, age } = req.body;
  connection.query(
    "INSERT INTO records_table SET ?",
    { name, age },
    (err, result) => {
      if (err) {
        console.error("Error creating record: ", err.stack);
        res.status(500).send("Error creating record");
        return;
      }
      res.send(result);
    }
  );
});

app.get("/records", (req, res) => {
  connection.query("SELECT * FROM records_table", (err, rows) => {
    if (err) {
      console.error("Error retrieving records: ", err.stack);
      res.status(500).send("Error retrieving records");
      return;
    }
    res.send(rows);
  });
});

app.get("/records/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM records_table WHERE id = ?",
    id,
    (err, row) => {
      if (err) {
        console.error("Error retrieving record: ", err.stack);
        res.status(500).send("Error retrieving record");
      }
      res.send(row);
    }
  );
});

app.put("/update-record/:id", (req, res) => {
  const id = req.params.id;
  const { name, age } = req.body;

  connection.query(
    `UPDATE records_table SET name='${name}',age=${age} WHERE id =${id}`,
    (err, result) => {
      if (err) {
        console.error("Error updating record: ", err.stack);
        res.status(500).send("Error updating record");
      }
      res.send("Record updated successfully");
    }
  );
});

app.delete("/delete-record/:id", (req, res) => {
  const id = req.params.id;

  connection.query(
    `DELETE FROM records_table WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.error("Error deleting record: ", err.stack);
        res.status(500).send("Error deleting record");
      }
      res.send("Record deleted successfully");
    }
  );
});

app.listen(port, () => {
  console.log(`Server started and listening to ${port}`);
});
