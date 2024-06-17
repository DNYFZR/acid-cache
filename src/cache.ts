// Cache Database Class
import { Database } from "sqlite3";

interface cacheEntry {
  key: string;
  value: JSON;
}

export class AcidCache {
  cachePath:string;
  cacheTable:string;
  cache: Database;

  constructor(cacheTable?:string, cachePath?:string) {
    // Setup database
    this.cache = new Database(cachePath? cachePath : ":memory:", (err:Error) => {
      if (err) {
        console.error(err.message);
      }
    });

    // Setup table
    this.cacheTable = cacheTable? cacheTable : "store";
    console.log(`Cache table : ${this.cacheTable}`);
    
    this.cache.run(`CREATE TABLE IF NOT EXISTS ${this.cacheTable}
      (key TEXT PRIMARY KEY, value JSON NOT NULL) WITHOUT ROWID`
    );
  }

  // Cache Table Ops
  async list(): Promise<JSON> {
    return new Promise((resolve, reject) => {
      this.cache.all("SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'", [], (err: Error, rows:JSON) => {
        if(err){
          reject({message: 'Cache error', error: err.message });

        } else {
          resolve(rows);
        }
      });
    });
  }

  async new(table:string): Promise<JSON> {
    return new Promise((resolve, reject) => {
      this.cache.run(`CREATE TABLE IF NOT EXISTS ${table}(key TEXT PRIMARY KEY, value JSON NOT NULL) WITHOUT ROWID`, [], (err:Error, rows:JSON) => {
        if(err){
          reject({message: `Error creating ${table} table`, error: err.message });
        } else {
          resolve(rows);
        }
      });
    });
  }

  async table(table:string, condition?:string): Promise<JSON> {
    let query = `SELECT key, value FROM ${table}`;
      
    if (condition !== null || undefined) {
      query = query + " " + condition;
    }
    
    return new Promise((resolve, reject) => {
      this.cache.all(query, [], (err: Error, rows: JSON) => {
          if(err){
            reject({message: `Error getting table : ${table}`, error: err.message });
          } else {
            resolve(rows);
          }
        });
    });
  }

  async drop(table:string): Promise<JSON> {
    return new Promise((resolve, reject) => {
      this.cache.all(`DROP TABLE IF EXISTS ${table}`, [], (err: Error, rows:JSON) => {
        if(err){
          reject({message: `Error dropping table : ${table}`, error: err.message });
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Cache Entry Ops
  async get(table:string, key:string): Promise<JSON> {
    return new Promise((resolve, reject) => {
      this.cache.all(`SELECT value FROM ${table} WHERE key = ?`, [key], (err: Error, rows: JSON) => {
          if(err){
            reject({message: `Error getting table : ${table}`, error: err.message });
          } else {
            resolve(rows);
          }
        });
    });
  }

  async update(table:string, key:string, value: JSON): Promise<JSON> {
    const timestamp = new Date().toLocaleString();

    return new Promise((resolve, reject) => {
      this.cache.get(`SELECT * FROM ${table} WHERE key = ?`, [key], (err:Error, row:cacheEntry) => {
        if (err) {
          reject({message: `Cache Error`, error: err.message});
        }

        if (row) {// Update if exists
          this.cache.run(`UPDATE ${table} SET value = ? WHERE key = ?`, [value, key], function(err: Error) {
              if (err) {
                reject({message: `Cache update error`, error: err.message});
              }
              resolve(JSON.parse(JSON.stringify({ message: "Entry updated", table: table, key: key, value: value, date: timestamp })));
            });
        } else {
          resolve(JSON.parse(JSON.stringify({message: `key (${key}) does not exist in cache table (${table})`})));
        } 
      });  
    });
  }

  async post(table:string, key:string, value:JSON): Promise<JSON> {
    const timestamp = new Date().toLocaleString();

    return new Promise((resolve, reject) => {
      this.cache.get(`SELECT * FROM ${table} WHERE key = ?`, [key], (err:Error, row:cacheEntry) => {
        if (err) { // database error
          reject({message: `Cache error`, error: err.message});
        }

        if (row) { // alredy exists
          resolve(JSON.parse(JSON.stringify({message: `key (${key}) already exists in table (${table})`})));
        
        } else {// add to cache
          this.cache.run(
            `INSERT INTO ${table} (key, value) VALUES (?, ?)`, [key, value], function(err: Error) {
              if (err) { // database error
                resolve(JSON.parse(JSON.stringify({message: `Key (${key}) already exists in cache (${table})`})));
              } else {
                resolve(JSON.parse(JSON.stringify({ message: "Entry created", table: table, key: key, value: value, date: timestamp })));
              }
            });
        } 
      });  
    });
  }

  async delete(table:string, key:string): Promise<cacheEntry> {
    return new Promise((resolve, reject) => {
      this.cache.run(`DELETE FROM ${table} WHERE key = ${key}`, [], (err: Error, rows:cacheEntry) => {
        if(err){
          reject({message: `Error dropping key (${key}) table (${table})`, error: err.message });
        } else {
          resolve(rows);
        }
      });
    });
  }

};

