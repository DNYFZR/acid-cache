// Cache Database Class
import { Database } from "sqlite3";
import { Request, Response } from "express";

interface cacheEntry {
  id: number;
  name: string;
  email: string;
  timestamp:string;
}

export class CacheDB {
  cachePath:string;
  cacheTable:string;
  cache: Database;

  constructor(
    cachePath?:string, 
    cacheTable?:string,
    columnBuildStatements?:Array<string>, 
  ) {
    // Setup database
    this.cache = new Database(
      cachePath? cachePath : ":memory:", (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    // Setup table
    this.cacheTable = cacheTable? cacheTable : "cache";

    // Column mapping test
    if(columnBuildStatements){
      console.log(`Configuring cache with table (${this.cacheTable}) & 
        columns (${columnBuildStatements.join(", ")} )`);

      this.cache.run(`CREATE TABLE IF NOT EXISTS ${this.cacheTable} 
        ( ${columnBuildStatements.join(", ")} ) WITHOUT ROWID`
      );
    } else {
      console.log(`Configuring cache with table (${this.cacheTable}) as key-value store`);

      this.cache.run(`CREATE TABLE IF NOT EXISTS ${this.cacheTable}
        (key TEXT PRIMARY KEY, value JSON NOT NULL) WITHOUT ROWID`
      );
    }
  }

  listTables() {
    return new Promise((resolve, reject) => {
      this.cache.all(
        "SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'", 
        [], (err, rows) => {
          if(err){
            reject({message: 'Error listing tables', error: err.message });
          } else {
            resolve(rows);
          }
        });
    });
  }

  createTable(name:string) {
    this.cache.run(`
      CREATE TABLE IF NOT EXISTS ${name} (id INTEGER PRIMARY KEY)
    `);
  }

  addColumn(table:string, column:string, type:string) {
    this.cache.run(`
      ALTER TABLE ${table}
      ADD COLUMN ${column} ${type? type : "VARCHAR"};
    `);
  }

  getTable(table:string, columns?: string | string[], condition?:string) {
    let query = "";
    if(columns === undefined || null) {
      query = `SELECT * FROM ${table}`;
    }
    
    else if(Array.isArray(columns) && columns.every(item => typeof item === 'string')) {
      query = `SELECT ${columns.join(",")} FROM ${table}`;
    } 
    
    else if(typeof columns === "string"){
      query = `SELECT ${columns} FROM ${table}`;
    } 

    if (condition !== null || undefined) {
      query = query + " " + condition;
    }
    

    return new Promise((resolve, reject) => {
      this.cache.all(query, [], (err, rows) => {
          if(err){
            reject({message: 'Error getting table', error: err.message });
          } else {
            resolve(rows);
          }
        });
    });
  }

  dropTable(table:string) {
    return new Promise((resolve, reject) => {
      this.cache.all(`DROP TABLE IF EXISTS ${table}`, [], (err, rows) => {
        if(err){
          reject({message: 'Error dropping table', error: err.message });
        } else {
          resolve(rows);
        }
      });
    });
  }

  dropRow(res: Response, req:Request){
    this.cache.run(`DELETE FROM ${this.cacheTable} WHERE id = ?`, [req.params.id], function(err) {
      if (err) {
        throw err;
      }
      res.json({ message: `User ID ${req.params.id} deleted` });
    });
  }

  putUpdate(res:Response, req:Request) {
    const timestamp = new Date().toLocaleString();
    const { name, email } = req.body;

    this.cache.get(`SELECT * FROM ${this.cacheTable} WHERE id = ?`, [req.params.id], (err, row) => {
      if (err) {
        throw err;
      }
      if (row) {
        // Update if exists
        this.cache.run(
          `UPDATE ${this.cacheTable} SET name = ?, email = ?, date = ? WHERE id = ?`, 
          [name, email, timestamp, req.params.id], 
          function(err) {
            if (err) {
              throw err;
            }
            res.json({ message: "user updated", id: req.params.id, name, email, date: timestamp });
          });
      } else {
        res.json({message: "cannot update - user does not exist", id: req.params.id, email: email});
      }
    });
  }

  postUpdate(res:Response, req:Request) {
    const timestamp = new Date().toLocaleString();
    const { name, email } = req.body;
    
    this.cache.get(`SELECT * FROM ${this.cacheTable} WHERE email = ?`, [email], (err, row: cacheEntry) => {
      if (err) {
        throw err;
      }
      if (row) {
        res.json({message: "user already exists", id: row.id, email: email});
      } else {
       // Create if not in DB
        this.cache.run(
          `INSERT INTO ${this.cacheTable} (name, email, date) VALUES (?, ?, ?)`, 
          [name, email, timestamp], 
          function(err) {
          if (err) {
            throw err;
          } else {
            res.json({ message: "user created", id: this.lastID, name, email, date: timestamp });
          }
        });
      }
    });
  }

};
