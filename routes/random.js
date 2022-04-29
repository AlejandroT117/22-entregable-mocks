const { Router } = require("express");
const router = Router();
const {fork} = require('child_process')
const compression = require('compression')
/* logger */
const logger = require('../log')
const randomize = require("../utils/random")

/* api/randoms */
router.get("/", compression(), (req,res)=>{
  const {cant} = req.query;
  logger.log(`Cant for random ${cant}`)
  
  res.send(randomize(cant))

/*   const random = fork("./utils/random.js")

  random.send({
    message: 'start',
    cant: cant
  })

  random.on("message", (message)=>{
    logger.log(`Consola del proceso padre en random`)
    res.send(message)
  }) */
  
})
module.exports = router