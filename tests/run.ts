const { spawn } = require('child_process');

spawn("node", ["tests/run.ts"]);
spawn('python', ['-m', 'tests.get']);
spawn('python', ['-m', 'tests.post']);
spawn('python', ['-m', 'tests.put']);