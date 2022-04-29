/* logger */
const logger = require('../log')

const random = (cant) => {
  if(!cant){
    cant= 100000000
  }
  let numbers = {};

  for (let i = 0; i < cant; i++) {
    let number = Math.floor(Math.random() * (cant - 1)) + 1;
    numbers[number] = (numbers[number] || 0) + 1;
  }

  return numbers;
};

module.exports= random

process.on("message", (obj) => {
  logger.log(`Consola del proceso hijo ${obj.message}`);
  if (obj.message === "start") {
    console.time("time")
    const numeros = random(obj.cant);
    process.send(numeros);
    console.timeEnd("time")
    process.exit();
  }
});
