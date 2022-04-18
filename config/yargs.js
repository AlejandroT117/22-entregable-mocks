const yargs = require("yargs/yargs")

module.exports =()=>{
  const args = yargs(process.argv.slice(2))
    .option('port',{
      alias: 'p',
      describe: 'server port',
      default: 8080,
      type:'string'
    })
    .argv
  
  const { port } = args

  return {port}
}