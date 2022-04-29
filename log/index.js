//winston
const logger = require('./winston')


module.exports = {
  log: (msg, level = 'info') => logger.info(msg),
  warn: (msg) => logger.warn(msg),
  error: (msg, e) => logger.error(msg, e),
  info: (msg) => logger.info(msg)
}