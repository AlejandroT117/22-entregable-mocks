
/* logger */
const logger = require('../log')

module.exports=(req,res, next)=>{
  logger.log(`Route: ${req.url} - Method: ${req.method}`)

  next()
}