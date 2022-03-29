const util = require("util")

module.exports = {
  print: (obj) => console.log(util.inspect(obj, true, 12, true))
}