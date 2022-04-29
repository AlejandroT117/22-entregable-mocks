const winston = require("winston");
const { combine, printf, timestamp, colorize } = winston.format;

const myFormat = winston.format.combine(
  colorize({ all: true }),
  winston.format.timestamp({
    format: "MM-DD-YYYY HH:mm:ss",
  }),
  printf((info) => 
    `[${info.timestamp}] [${info.level}] ${info.message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: "MM-DD-YYYY HH:mm:ss",
  }),
  printf((info) => 
    `${info.timestamp}- ${info.level}: ${info.message}`
  )
)

winston.addColors({
  info: "bold blue", // fontStyle color
  warn: "italic yellow",
  error: "bold red",
  debug: "green",
});

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(),
  transports: [
    new winston.transports.Console({
      level: "verbose",
      format: combine(myFormat),
    }),
    new winston.transports.File({
      filename: "./logs/warns.log",
      level: "warn",
      format: combine(fileFormat)
    }),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
      format: combine(fileFormat)
    }),
  ],
});

module.exports = logger;
