const express = require("express");
const router = express.Router();
const User = require("../models/User.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js"); 
const { renderLoginform, loggedout, loggedin, signup, renderSignform } = require("../Controller/user.js");

router.get("/signup",renderSignform );

router.post("/signup", signup);

router.get("/login", renderLoginform);

router.post("/login" , saveRedirectUrl , passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), loggedin);
 
router.get("/loggedout", loggedout)


module.exports = router;