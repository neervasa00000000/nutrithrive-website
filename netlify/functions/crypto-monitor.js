process.env.NETLIFY = 'true';

const { runMonitorTick } = require('../../blockchain/src/monitor-tick');

exports.handler = async () => {
  try {
    const result = await runMonitorTick();
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, ...result }),
    };
  } catch (err) {
    console.error('crypto-monitor:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};

exports.schedule = '*/5 * * * *';
