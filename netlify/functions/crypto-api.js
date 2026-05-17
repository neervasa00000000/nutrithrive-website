process.env.NETLIFY = 'true';

const serverless = require('serverless-http');
const app = require('../../blockchain/src/app');

module.exports.handler = serverless(app);
