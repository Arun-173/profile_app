
var express = require("express"),
    mongoose = require("mongoose"),
    morgan = require("morgan"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose =
        require("passport-local-mongoose"),
    User = require("./model/sign");

var app = express();

//mongodb connection using mongoose tool
mongoose.connect("mongodb://localhost:27017/user")
    .then(() => console.log("connected")).catch(err => console.log(err));

//setup view engine Or template engine to view output
app.set("view engine", "ejs");
app.set("views", "view")

//morgan middleware for showing url and statuscode
app.use(morgan("dev"));

//bodyparser handle's the req of client side body
app.use(bodyParser.urlencoded({ extended: true }));

//getting local files using static
app.use(express.static('style'));


//express-session,It helps in saving the data in the key-value form
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// Showing home page
app.get("/", (req, res) => {
    res.render("index");
});

// Showing profile page
app.get("/profile",isLoggedIn, (req, res) => {
    res.redirect("/profile/:username");
});

// View mongodb collections
app.get("/profile/:username", (req, res) => {
    let _name = req.params.username;
    User.find({_name}).then(result=>{res.render("profile",{result})})
    .catch(err=>console.log(err));
});

// Showing signup form
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Handling user signup
app.post("/signup", (req, res) => {
    User.register(new User({username:req.body.username,email:req.body.email}),
    req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("signup");
        }

        passport.authenticate("local")(
            req, res, () => {
                // res.render("profile");
                // User.find({username:req.query.username}).then(result=>{
                //     res.render("profile",{result});
                // }).catch(err=>console.log(err));
                res.redirect("/profile");
            });
    });
});

//Showing login form
app.get("/login", (req, res) => {
    res.render("login");
});

//Handling user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}), (req, res) => {
});

//Handling user logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

app.listen(3000);