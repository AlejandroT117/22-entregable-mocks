
const cluster = require("cluster")
const CPUs = require("os").cpus().length
/* Yargs */
const yargs = require('./config/yargs')
const app = require("./index")

const PORT = yargs().port;
const MODO = yargs().modo;

if(MODO==='CLUSTER'){
  if (cluster.isPrimary) {
    for (let i = 0; i < CPUs; i++) {
      setTimeout(() => cluster.fork(), 1500 * i)
    }
  
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died!!!`)
    })
  
    console.log("soy el proceso primario", process.pid)
  } else {
    app.listen(PORT, () => console.log(`Process ${process.pid} listening on: http://localhost:${PORT}\n`))
  }
}else{
  app.listen(PORT, () => console.log(`Process ${process.pid} listening on: http://localhost:${PORT}\n`))
}