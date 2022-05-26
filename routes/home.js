const { Router } = require("express");
const router = Router;
const compression = require("compression");

const isLogged = require("../middlewares/logged");
const counter = require("../middlewares/counter");

/* controller */
const homeController = require("../controllers/home.controllers");

router.get("/info", isLogged, compression, homeController.getInfo);
router.get("/", isLogged, counter, compression, homeController.showUserInfo);
router.get("/unique/:id", isLogged, counter, homeController.uniqueProduct);
router.get("/login", homeController.showLogin);
router.get("/register", (req, res) => homeController.showRegister);
router.get("/counter", isLogged, counter, homeController.showCounter);
router.get("/logout", isLogged, homeController.showLogout);
router.get("/bye", homeController.showBye);

module.exports = router;
