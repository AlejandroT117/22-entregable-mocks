const yargs = require('./config/yargs')
const app = require("./index")

const PORT = yargs().port;

app.listen(PORT, () => console.log(`listening on: http://localhost:${PORT}\n`))