<h1 align="center"> Acid Cache </h1>

<h3 align="center"> Assert Control over Important Data </h3>

<p align="center">SQL & NoSQL caching tools built with Typescript, Express & SQLite</p>

### Usage

If the cache is configured with no parameters, an in-memory key-value store will be setup with a table named cache : 

- As a key-value store, the table has a key column (TEXT) and a value column (JSON)

Otherwise the following parameters can be set :

- If a cachePath is provided; the database will be stored there

- If a cacheTable is also provided; this will be used as the name

- If a columnBuildStatement is also provided; a relational table with that configuration will be setup

  - This is an array of SQLite column definition statements e.g. ["key TEXT PRIMARY KEY", "value JSON NOT NULL"]

  - It should contain a primary key column first as the SQLite DB is configured without ROWID to keep cache size lower

If a column is required after the cache table is configured; the addColumn method can be called with a table name and column name, and optionally a type, with the column being set to VARCHAR if no type is provided

A server build has also been provided as a demonstration of how the cache could operate as a caching API.

### Commands

#### Run Server

The server is configured to run with the npm start command :

````bash
npm i
npm start

````

#### Server Test Commands

Initial testing for the cache API server demo has been developed in Python using the requests package :

````ps1
python -m pip install requests

python -m tests.get
python -m tests.post
python -m tests.put
python -m tests.delete

````
