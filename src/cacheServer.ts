// Cache Database Server
const express = require('express');
const bodyParser = require('body-parser');

import { Request, Response } from "express";
import { AcidCache } from "./cache";

// Cache Config
const cache = new AcidCache("store", "data/cache.db");

// Express Server
const app = express();
app.use(bodyParser.json());

// API Root
app.get('/', (_, res: Response) => { res.json("This is the API root, please select an endpoint...") });

// List tables
app.get("/list-tables", (_, res: Response) => { 
  cache.list(
    ).catch((err) => res.status(500).json(err)
    ).then((rows) => res.status(200).json(rows)); 
});

// Get a table by name
app.get('/:table', (req:Request, res: Response) => {
  
  // Create if required & then get
  cache.new(req.params.table
    ).catch((err) => res.status(500).json(err)
    ).then(() => cache.table(req.params.table
      ).catch((err) => res.status(500).json(err)
      ).then((rows) => res.status(200).json(rows))
    );
});

// Remove a table
app.delete('/drop/:table', (req:Request, res: Response) => {
  cache.drop(req.params.table
    ).catch((err) => res.status(500).json(err)
    ).then((rows) => res.status(200).json(rows)
  );
});

// Get entry by key
app.get('/:table/:key', (req:Request, res: Response) => {
  cache.get(req.params.table, req.params.key
    ).catch((err) => res.status(500).json(err)
    ).then((rows) => res.status(200).json(rows)
  );
});

// Create entry
app.post('/:table', (req: Request, res: Response) => {
  const { key, value } = req.body;

  cache.post(req.params.table, key, value 
    ).catch((err) => res.status(500).json(err)
    ).then((message) => res.status(200).json(message)) 
});

// Update entry
app.put('/:table', (req:Request, res: Response) => { 
  const { key, value } = req.body;
  
  cache.update(req.params.table, key, value
    ).catch((err) => res.status(500).json(err)
    ).then((message) => res.status(200).json(message));
});

// Delete entry
app.delete('/:table', (req: Request, res:Response) => { 
  const { key } = req.body;

  cache.delete(req.params.table, key 
    ).catch((err) => res.status(500).json(err)
    ).then((rows) => res.status(200).json(rows)); 
});

// Run Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server: running \nPort : ${port}`);
});
