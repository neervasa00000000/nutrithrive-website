const config = require('./config');
const { runMonitorTick } = require('./monitor-tick');

async function tick() {
  try {
    await runMonitorTick();
  } catch (err) {
    console.error('Monitor tick error:', err);
  }
}

async function main() {
  console.log(`Payment monitor started (interval ${config.monitorIntervalMs}ms)`);
  await tick();
  setInterval(tick, config.monitorIntervalMs);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
