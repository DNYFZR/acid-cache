// Backend API Server
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require("sqlite3");

const app = express();
app.use(bodyParser.json());

const db_path = "data/app.db";
const db_table = "users";

const db = new sqlite3.Database(db_path.length > 0 ? db_path : ":memory:", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create table
db.run(`CREATE TABLE IF NOT EXISTS ${db_table} (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  date TEXT 
)`);

// API Root
app.get('/', (_, res) => {
  res.json("This is the API root, please select an endpoint...") ;
});

// List tables
app.get("/list-tables", (_, res) => {
  db.all("SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'", [], (err, rows) => {
    if(err){
      res.status(500).json({ message: 'Error listing tables', error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get a table by name
app.get('/:table', (req, res) => {
  // Create if required
  db.run(`CREATE TABLE IF NOT EXISTS ${req.params.table} (
    id INTEGER PRIMARY KEY
  )`);
  
  // Get data
  db.all(`SELECT * FROM ${req.params.table}`, [], (err, rows) => {
    if (err){
      res.status(500).json({ message: `Error getting table : ${req.params.table}`, error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Remove a table
app.delete('/drop/:table', (req, res) => {
  db.run(`DROP TABLE IF EXISTS ${req.params.table};`, [], function(err) {
    if (err) {
      res.status(500).json({ message: `Error dropping table : ${req.params.table}`, error: err.message });
    }
    res.status(200);
    res.json({ message: `Table ${req.params.table} deleted` });
  });
});


// Get user by ID
app.get('/users/:id', (req, res) => {
  db.get(`SELECT * FROM ${db_table} WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      throw err;
    }
    res.json(row);
  });
});

// Create user
app.post('/users', (req, res) => {
  const timestamp = new Date().toLocaleString();
  const { name, email } = req.body;
  // Check if user exists by unique email
  db.get(`SELECT * FROM ${db_table} WHERE email = ?`, [email], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      // Update if exists
      db.run(`UPDATE ${db_table} SET name = ?, email = ?, date = ? WHERE id = ?`, [name, email, timestamp, row.id], function(err) {
        if (err) {
          throw err;
        }
        res.json({ id: row.id, name, email, date: timestamp });
      });
    } else {
      db.run(`INSERT INTO ${db_table} (name, email, date) VALUES (?, ?, ?)`, [name, email, timestamp], function(err) {
        if (err) {
          throw err;
        } else {
          res.json({ id: this.lastID, name, email, date: timestamp });
        }
      });
    }
  });
});;

// Update user
app.put('/users/:id', (req, res) => {
  const timestamp = new Date().toLocaleString();
  const { name, email } = req.body;

  db.get(`SELECT * FROM ${db_table} WHERE email = ?`, [email], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      // Update if exists
      db.run(`UPDATE ${db_table} SET name = ?, email = ?, date = ? WHERE id = ?`, [name, email, timestamp, req.params.id], function(err) {
        if (err) {
          throw err;
        }
        res.json({ id: req.params.id, name, email, date: timestamp });
      });
    } else {
      db.run(`INSERT INTO ${db_table} (id, name, email, date) VALUES (?, ?, ?, ?)`, [req.params.id, name, email, timestamp], function(err) {
        if (err) {
          throw err;
        } else {
          res.json({ id: req.params.id, name, email, date: timestamp });
        }
      });
    }
  });
});

// Delete user
app.delete('/users/:id', (req, res) => {
  db.run(`DELETE FROM ${db_table} WHERE id = ?`, [req.params.id], function(err) {
    if (err) {
      throw err;
    }
    res.json({ message: `User ID ${req.params.id} deleted` });
  });
});

// Run Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});