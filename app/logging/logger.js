const winston = require('winston');
const {combine, timestamp, label, json}  = winston.format;
const os = require("os");
const hostName = os.hostname();
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(label({ label: hostName, message: true }), timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: process.env.LOG_FILEPATH,
    }),
  ],
});
const wistonLogger = {
    logger : logger,
  };

  module.exports = wistonLogger;