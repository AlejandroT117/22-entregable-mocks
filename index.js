const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
/* logger */
const logger = require("./log");
/* Dotenv */
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");
const {
  HOSTNAME,
  SCHEMA,
  DATABASE,
  USER,
  PASSWORD,
  OPTIONS,
} = require("./config");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const { normalize, schema } = require("normalizr");
const printInfo = require("./middlewares/printInfo");

//passport
const passport = require("passport");
const flash = require("express-flash");
const initializePassport = require("./passport/local");

const productos = require("./models/products");
const mensajes = require("./models/messages");

//Routes set
const homeRouter = require("./routes/home");
const loginRouter = require("./routes/login.routes");
const fakerRouter = require("./routes/faker");
const randomRouter = require("./routes/random");

//Handlebars set
const { engine } = require("express-handlebars");

(async () => {
  try {
    await mongoose.connect(
      `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`
    );
    logger.log(
      `URL Mongo: ${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`
    );

    app.engine(
      "handlebars",
      engine({
        layoutDir: path.join(__dirname, "views/layouts"),
        defaultLayout: "index",
      })
    );
    app.set("view engine", "handlebars");

    /* express */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static(path.join(__dirname, "/public")));
    app.use(cookieParser("secret"));
    app.use(
      session({
        store: MongoStore.create({
          mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`,
          ttl: 10 * 60, //10 minutos para expiración
          autoRemove: "native",
        }),

        secret: "secreto",
        resave: true,
        saveUninitialized: true,
      })
    );

    //passport initialize
    initializePassport(passport);
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    /* Router al home */
    app.use("/", printInfo, homeRouter);
    app.use("/", printInfo, loginRouter);
    app.use("/api/productos-test", fakerRouter);
    app.use("/api/randoms", randomRouter);

    /* unexistant */
    /* app.get('*', (req, res) => {
      logger.warn('La ruta no existe')
      res.redirect('/')
    }) */

    //socket io
    io.on("connection", (socket) => {
      logger.log(`An user is connected by socket: ${socket.id}`);

      /* Obtiene todos los productos de la db SQL y los emite */
      productos.getAll().then((all_p) => {
        for (const p of Object.entries(all_p)) {
          socket.emit("producto", {
            nombre: p[1].nombre,
            precio: p[1].precio,
            img: p[1].img,
          });
        }
      });

      /* Responde a la adición de un nuevo producto */
      socket.on("new_product", (product) => {
        productos.save({ ...product });
        socket.emit("producto", { ...product });
        socket.broadcast.emit("producto", { ...product });
      });

      /* Schemas para Normalizr para mensajes*/
      const author = new schema.Entity("authors", {}, { idAttribute: "email" });
      const post = new schema.Entity(
        "posts",
        {
          author: author,
        },
        { idAttribute: "_id" }
      );

      const blogSchema = new schema.Entity("blogs", {
        posts: [post],
      });

      /* Obtiene todos los mensajes de sqlite3 y los emite */
      mensajes.getAll().then((all_mens) => {
        let blog = { id: 1, posts: [] };
        for (const m of Object.entries(all_mens)) {
          socket.emit("mensaje", {
            email: m[1].author.email,
            avatar: m[1].author.avatar,
            fecha: m[1].fecha,
            mensaje: m[1].mensaje,
          });

          /* Datos para normalizar */
          const post = {
            author: m[1].author,
            _id: m[1]._id,
            mensaje: m[1].mensaje,
            fecha: m[1].fecha,
          };
          blog.posts.push(post);
        }

        /* Normalización */
        if (all_mens.length) {
          const normalizedData = normalize(blog, blogSchema);
          const lengths = {
            denormalized: JSON.stringify(all_mens).length,
            normalized: JSON.stringify(normalizedData.entities.posts).length,
          };
          socket.emit("normalizeMsgs", normalizedData);
          socket.emit("calculation", lengths);
        }
      });

      /* Responde a la adición de un nuevo mensaje */
      socket.on("new_message", (message) => {
        mensajes.save({ ...message });
        socket.emit("mensaje", {
          email: message.author.email,
          avatar: message.author.avatar,
          fecha: message.fecha,
          mensaje: message.mensaje,
        });
        socket.broadcast.emit("mensaje", { ...message });
      });
    });

    //manejo de errores
    app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).send("Error en middleware");
    });

    /* server.listen(PORT, () =>
      console.log(`Escuchando en: http://localhost:${PORT}`)
    ); */
  } catch (e) {
    logger.error(`Error en conexión: ${e}`);
  }
})();
module.exports = server;
