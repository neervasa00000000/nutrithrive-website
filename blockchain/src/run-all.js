const { spawn } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

function run(label, script) {
  const child = spawn('node', [path.join('src', script)], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  child.on('exit', (code) => {
    if (code !== 0) console.error(`${label} exited with code ${code}`);
  });
  return child;
}

console.log('Starting crypto checkout (API + payment monitor)...\n');
const server = run('server', 'server.js');
const monitor = run('monitor', 'payment-monitor.js');

function shutdown() {
  server.kill();
  monitor.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
