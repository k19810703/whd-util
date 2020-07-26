const moment = require('moment');
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
  param => `${moment(param.timestamp).format('YYYY-MM-DDTHH:mm:ss.SSS')} ${param.level}: ${param.message}`,
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

/**
 * 获取一个winston的日志实例
 * @module log
 */
module.exports.log = log;
