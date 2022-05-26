const productosModel = require("../models/products");
const calc = require("../utils/calc");
const CPUs = require("os").cpus().length;

/* logger */
const logger = require("../log");
module.exports = {
  getInfo: (req, res) => {
    const info = [
      { nombre: "Argumentos de entrada", data: process.argv },
      { nombre: "Nombre de plataforma", data: process.platform },
      { nombre: "Versión de Node.js", data: process.version },
      {
        nombre: "Memoria total",
        data: calc.bytesToMb(process.memoryUsage().rss),
      },
      { nombre: "Path de ejecución", data: process.execPath },
      { nombre: "Process id", data: process.pid },
      { nombre: "Carpeta del proyecto", data: process.cwd() },
      { nombre: "No. procesadores", data: CPUs },
    ];

    res.render("info", { info });
  },
  showUserInfo: async (req, res) => {
    const { firstname, lastname } = req.user;
    res.cookie("username", `${firstname} ${lastname}`);
    res.render("main", { username: `${firstname} ${lastname}` });
  },
  uniqueProduct: async (req, res) => {
    const { id } = req.params;

    const producto = await productosModel.getById(id);
    logger.log(producto);

    res.render("unique", {
      nombre: producto.nombre,
      precio: producto.precio,
      img: producto.img,
      descuento: producto.descuento,
    });
  },
  showLogin: (req, res) => {
    res.render("login");
  },
  showRegister: () => {
    res.render("register");
  },
  showCounter: (req, res) => {
    res.render("counter", { contador: req.session.contador });
  },
  showLogout: (req, res) => {
    req.logOut();
    res.redirect("/bye");
  },
  showBye: (req, res) => {
    res.render("bye", { username: req.cookies.username });
    res.clearCookie("username");
  },
};
