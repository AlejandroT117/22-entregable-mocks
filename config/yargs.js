const yargs = require("yargs/yargs")

module.exports =()=>{
  const args = yargs(process.argv.slice(2))
    .option('port',{
      alias: 'p',
      describe: 'server port',
      default: 8080,
      type: 'number'
    })
    .option('modo',{
      alias: 'm',
      describe: 'modo',
      default: 'FORK',
      type:'string',
      choices: ['FORK', 'CLUSTER']
    })
    .argv
  
  const { port, modo } = args

  return {port, modo}
}