require("dotenv").config();
console.log(process.env.SECRET);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");

const listingRouter = require("./routers/listings.js");
const reviewRouter = require("./routers/reviews.js");
const userRouter= require("./routers/user.js");

const app = express();

const dburl=process.env.ATLASDB_URL;
// Database connection


main()
.then(()=>{
    console.log("connected to DB");
})
.catch((error)=>{
console.log(error);
});

async function main() {
    await mongoose.connect(dburl);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : dburl, 
    crypto: {
        secret:process.env.SECRET,
    },
    tourchAfter:24*3600,
});

store.on('error',()=>{
    console.log("error in mongo session store",error);
})
// Session and Flash
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,  
        httpOnly: true
    },
};


// Routes



app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Global flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});

app.get("/demouser",async(req, res) => {
    let fakeUser= new User({
       email: "student@gmail.com",
       username: "harsh",
    });

    let registeruser = await User.register(fakeUser, "helloworld");
    res.send(registeruser);
})

app.use("/", listingRouter);
app.use("/:id/reviews", reviewRouter);
app.use("/user",userRouter)

// Error handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Server
app.listen(8080, () => {
    console.log("Server started on port 8080.");
});
