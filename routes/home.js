const { Router } = require("express");
const router = Router();

const isLogged = require("../middlewares/logged");
const counter = require("../middlewares/counter");

const productos = require("../models/products");

/* GET DATA */

router.get("/",isLogged, counter, async (req, res) => {
  res.render("main", {username: req.cookies.username});
});

router.get("/unique/:id", isLogged, counter, async (req, res) => {
  const { id } = req.params;

  const producto = await productos.getById(id);
  console.log(producto);

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

router.post("/register", (req, res) => {

  res.cookie("username", req.body.nombre);
  req.session.user={
    name: req.body.nombre,
    email: req.body.email
  }

  res.redirect("/")
});

router.get("/counter", isLogged, counter, (req, res) => {
  res.render("counter", {contador: req.session.contador});
});

router.get("/logout", isLogged, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/?error=err");
    }

    res.redirect("/bye");
  });
});

router.get("/bye", (req, res) => {
  res.render("bye", {username: req.cookies.username});
  res.clearCookie("username");
});

module.exports = router;
