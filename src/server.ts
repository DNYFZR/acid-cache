// Cache Database Server
const express = require('express');
const bodyParser = require('body-parser');

import { Request, Response } from "express";
import { CacheDB } from "./cache";

// Cache Config
const cacheCols = [
  "id INTEGER PRIMARY KEY",
  "name TEXT NOT NULL",
  "email TEXT NOT NULL UNIQUE",
  "date TEXT"
];

const engine = new CacheDB("data/app.db", "cache", cacheCols);

// Express Server
const app = express();
app.use(bodyParser.json());

// API Root
app.get('/', (_, res: Response) => { res.json("This is the API root, please select an endpoint...") });

// List tables
app.get("/list-tables", (_, res: Response) => { engine.listTables().then((rows) => res.json(rows)) });

// Get a table by name
app.get('/:table', (req:Request, res: Response) => {
  // Create if required
  engine.createTable(req.params.table);

  // Get data
  engine.getTable(req.params.table
    ).catch((err) => res.status(500).json(err)
    ).then((rows) => res.status(200).json(rows)
  );
});

// Remove a table
app.delete('/drop/:table', (req:Request, res: Response) => {
  engine.dropTable(req.params.table
    ).catch((err) => res.status(500).json(err)
    ).then((rows) => res.status(200).json(rows)
  );
});

// Get user by ID
app.get('/users/:id', (req:Request, res: Response) => {
  engine.getTable(engine.cacheTable, "*", `WHERE id = ${req.params.id}`
    ).catch((err) => res.status(500).json(err)
    ).then((rows) => res.status(200).json(rows)
  );
});

// Create user
app.post('/users', (req: Request, res: Response) => { engine.postUpdate(res, req) });

// Update user
app.put('/users/:id', (req:Request, res: Response) => { engine.putUpdate(res, req) });

// Delete user
app.delete('/users/:id', (req: Request, res: Response) => { engine.dropRow(res, req) });

// Run Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
