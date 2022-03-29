const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const PORT = process.env.PORT || 8080;

const mongoose = require("mongoose");
const { HOSTNAME, SCHEMA, DATABASE, DBPORT, OPTIONS } = require("./config");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const productos = require("./models/products");
const mensajes = require("./models/messages");

//Routes set
const homeRouter = require("./routes/home");
const fakerRouter = require("./routes/faker");

//Handlebars set
const { engine } = require("express-handlebars");

(async () => {
  try {
    await mongoose.connect(
      `${SCHEMA}://${HOSTNAME}:${DBPORT}/${DATABASE}?${OPTIONS}`
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

    /* Router al home */
    app.use("/", homeRouter);
    app.use("/api/productos-test", fakerRouter);

    //socket io
    io.on("connection", (socket) => {
      console.log(`An user is connected: ${socket.id}`);

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

      /* Normalizr */
      

      /* Obtiene todos los mensajes de sqlite3 y los emite */
      mensajes.getAll().then((all_mens) => {
        for (const m of Object.entries(all_mens)) {
          socket.emit("mensaje", {
            email: m[1].author.email,
            avatar: m[1].author.avatar,
            fecha: m[1].fecha,
            mensaje: m[1].mensaje,
          });
        }
      });

      /* Responde a la adición de un nuevo mensaje */
      socket.on("new_message", (message) => {
        mensajes.save({ ...message });
        socket.emit("mensaje", { ...message });
        socket.broadcast.emit("mensaje", { ...message });
      });
    });

    //manejo de errores
    app.use((err, req, res, next) => {
      console.log(err.stack);
      res.status(500).send("Error en middleware");
    });

    server.listen(PORT, () =>
      console.log(`Escuchando en: http://localhost:${PORT}`)
    );
  } catch (e) {
    console.log(`Error en conexión: ${e}`);
  }
})();
