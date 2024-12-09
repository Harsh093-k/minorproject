// const user = require("../models/User.js")
const User  = require('../models/User.js'); // Import User model
const passport = require('passport'); // Ensure Passport.js is set up correctly

module.exports.renderSignform = (req, res) => {
    res.render("users/signup.ejs");

};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Create a new user instance
        const newUser = new User({ email, username });
        console.log("New user created:", newUser);

        // Register the user
        const registeredUser = await User.register(newUser, password);
        console.log("Registered user:", registeredUser);

        // Automatically log in the user
        req.logIn(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wonderlust!");
            res.redirect("/listings");
        });
    } catch (error) {
        console.error("Error during signup:", error.message);
        req.flash("error", error.message); // Display error to user
        res.redirect("/signup");
    }
};


// module.exports.signup = async (req, res) => {
//     try {
//         let { username, email, password } = req.body;
//         const newuser = new user({ email, username });
//         console.log("New user created:", newuser);

//         // Register the user
//         const registereduser = await user.register(newuser, password);
//         console.log("Registered user:", registereduser);
//         req.logIn(registereduser, (err) => {
//             req.logOut((err) => {
//                 if (err) {
//                     next(err);
//                 }
//                 req.flash("success", "Welcome to the wonderlust");
//                 res.redirect("/listing");
//             });
//         });
//     } catch (e) {
//         console.log("Error during signup:", e.message);
//         req.flash("error", e.message);  // Corrected typo here
//         res.redirect("/signup");
//     };
// };

module.exports.renderLoginform = (req, res) => {
    res.render("users/login.ejs")
}; 

module.exports.loggedin = async (req, res) => {
    req.flash("Welcome to the wonderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.loggedout =  (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are successful logged out!");
        res.redirect("/listings");
    })
};
