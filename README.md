<h1 align="center">Acid Cache 🧪</h1>

Key-value store :

- Developed with Typescript & SQLite
- Persist to storage or run in-memory
- Demo API server built in Express

### Setup

If the cache is configured with no parameters:

- An in-memory key-value store will be setup with a table named store

- The table has a key column (TEXT) and a value column (JSON)

Otherwise the following parameters can be set :

- If a cachePath is provided; the database will be stored there

- If a cacheTable is also provided; this will be used as the name

### Commands

#### Run Server

The server is configured to execute with npm run commands :

````bash
npm i
npm run start

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
