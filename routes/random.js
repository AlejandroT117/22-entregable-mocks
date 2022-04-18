const { Router } = require("express");
const router = Router();
const {fork} = require('child_process')

/* api/randoms */
router.get("/", (req,res)=>{
  const {cant} = req.query;

  const random = fork("./utils/random.js")

  random.send({
    message: 'start',
    cant: cant
  })

  random.on("message", (message)=>{
    console.log(`Consola del proceso padre`)
    res.send(message)
  })
  
})
module.exports = router