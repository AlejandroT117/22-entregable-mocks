module.exports={  
  HOSTNAME: "cluster0.yi6w4.mongodb.net",
  SCHEMA: "mongodb+srv",
  USER: "coderhouse",
  PASSWORD: process.env.MONGO_PWD,
  DATABASE: "ecommerce",
  OPTIONS: "retryWrites=true&w=majority"
}