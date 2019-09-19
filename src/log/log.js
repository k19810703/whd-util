const {
  createLogger,
  format,
  transports,
} = require('winston');

const {
  combine,
  timestamp,
  printf,
} = format;

const myFormat = printf(
  param => `${param.timestamp} ${param.level}: ${param.message}`,
);
// const logtransport = process.env.LogTransport === 'console' ?
// new transports.Console() : new transports.File({ filename: process.env.LogTransport });
const log = createLogger({
  level: process.env.LogLevel || 'info',
  format: combine(
    // label({ label: 'node-api-template' }),
    timestamp(),
    myFormat,
  ),
  transports: [
    // logtransport,
    new transports.Console(),
  ],
});

module.exports.log = log;
