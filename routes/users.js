const express = require('express');
const router = express.Router();

// Importing User model
const User = require("../models/User");

// Route for login page
router.get("/login", (req, res) => res.render("login"));

// Route for register page
router.get("/register", (req, res) => res.render("register"));

// Register API
router.post("/register", (req, res) => {
  const { name, email } = req.body;

  // Checking for errors
  let errors = [];

  if (!name || !email) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
    });
  } else {
    // Validation successfull
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // User already exists
        errors.push({ msg: "Email ID alreaddy exists" });
        res.render("register", {
          errors,
          name,
          email,
        });
      } else {
        // Creating user
        const newUser = new User({
          name,
          email,
        });

        // Saving user
        newUser
          .save()
          .then((user) => {
            req.flash(
              "success_msg",
              "Registration Successfull. Now user can login"
            );
            res.redirect("/users/login");
          })
          .catch((err) => console.log(err));
      }
    });
  }
});

// Login API
router.post("/login", (req, res) => {
  const { name, email } = req.body;
  // checking user in db
  User.findOne({
    email: email,
  }).then((user) => {
    if (!user) {
      let errors = [];
      errors.push({ msg: "Email is not registered" });
      res.render("login", {
        errors,
        name,
        email,
      });
    }
    // Redirecting to dashboard
    else {
      res.redirect(`/dashboard?user=${user.email}`);
    }
  });
});

// Logout API
router.get("/logout", (req, res) => {
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
