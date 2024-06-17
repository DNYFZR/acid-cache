<h1 align="center">AcidDB 🧪</h1>

<h3 align="center"> Active Control of Important Data </h3>

NoSQL caching tooling :

- Developed with Typescript & SQLite
- Demo API server built in Express
- Persist to storage or run in-memory

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
