const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const moment = require("moment");
const app = express();

const User = require("./models/User");

const authRoutes = require("./routes/auth");
const stallRoutes = require("./routes/stalls");
const commentRoutes = require("./routes/comments");

const urlDB = process.env.DATABASEURL || "mongodb://localhost:27017/GoodFruit";
mongoose.connect(urlDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Database connection");
});

app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = moment;

/* ========passport configuration========*/

app.use(
  expressSession({
    secret: "useless string",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// passport local mongoose
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ========================================*/

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(authRoutes);
app.use("/stalls", stallRoutes);
app.use("/stalls/:id/comments", commentRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});
