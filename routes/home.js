const { Router } = require("express");
const router = Router();
const compression = require('compression')

const isLogged = require("../middlewares/logged");
const counter = require("../middlewares/counter");

const productos = require("../models/products");
const passport = require("passport");
const calc = require('../utils/calc');
const CPUs = require('os').cpus().length;
/* logger */
const logger = require('../log')

/* info route */
router.get("/info", isLogged, compression(), (req, res) => {
  const info = [
    { nombre: "Argumentos de entrada", data: process.argv },
    { nombre: "Nombre de plataforma", data: process.platform },
    { nombre: "Versión de Node.js", data: process.version },
    { nombre: "Memoria total", data: calc.bytesToMb(process.memoryUsage().rss) },
    { nombre: "Path de ejecución", data: process.execPath },
    { nombre: "Process id", data: process.pid },
    { nombre: "Carpeta del proyecto", data: process.cwd() },
    { nombre: "No. procesadores", data: CPUs },
  ];

  res.render("info", {info})
});


/* GET DATA */

router.get("/", isLogged, counter, compression(), async (req, res) => {
  const { firstname, lastname } = req.user;
  res.cookie("username", `${firstname} ${lastname}`);
  res.render("main", { username: `${firstname} ${lastname}` });
});

router.get("/unique/:id", isLogged, counter, async (req, res) => {
  const { id } = req.params;

  const producto = await productos.getById(id);
  logger.log(producto);

  res.render("unique", {
    nombre: producto.nombre,
    precio: producto.precio,
    img: producto.img,
    descuento: producto.descuento,
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/",
    failureRedirect: "/register",
    failureFlash: true,
  })
);

router.get("/counter", isLogged, counter, (req, res) => {
  res.render("counter", { contador: req.session.contador });
});

router.get("/logout", isLogged, (req, res) => {
  req.logOut();
  res.redirect("/bye");
});

router.get("/bye", (req, res) => {
  res.render("bye", { username: req.cookies.username });
  res.clearCookie("username");
});

module.exports = router;
