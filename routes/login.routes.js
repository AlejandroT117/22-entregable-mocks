const { Router } = require("express");
const router = Router();

const passport = require("passport");
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

module.exports = router;
