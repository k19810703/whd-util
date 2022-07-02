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

require('winston-daily-rotate-file');

const formatMessage = (indata) => {
  const type = typeof (indata);
  let result;
  if (type === 'string' || type === 'boolean') {
    result = indata;
  } else if (type === 'object') {
    result = JSON.stringify(indata, null, 2);
  }
  return result;
};

const myFormat = printf(
  (param) => `${moment(param.timestamp).format('YYYY-MM-DDTHH:mm:ss.SSS')} ${param.level}: ${formatMessage(param.message)}`,
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

if (process.env.nodelog) {
  log.add(new transports.DailyRotateFile({
    filename: `${process.env.nodelog}/nodejs-log-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '200m',
    maxFiles: '2d',
  }));
}

/**
 * 获取一个winston的日志实例
 * @module log
 */
module.exports.log = log;
