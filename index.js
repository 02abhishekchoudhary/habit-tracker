const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// DB config
const db = require("./config/mongoUrl").MongoURI;

// Connecting to mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.log(err));

// Template Engine EJS
app.use(expressLayouts);
app.use("/assets", express.static("./assets"));
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Connecting flash
app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Creatiing server
app.listen(5000, () => {
    console.log("Server started on port 5000");
  });

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));