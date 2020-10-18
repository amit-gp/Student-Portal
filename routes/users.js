const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../schemas/UserModel");
const { isAlreadyLoggedIn } = require("../configs/auth");

router.get("/login", isAlreadyLoggedIn, (req, res) => {
  res.render("login");
});

router.get("/register", isAlreadyLoggedIn, (req, res) => {
  console.log(req.body);
  res.render("register");
});

router.get("/reset-password", (req, res) => {
  console.log(req.body);
  res.render("reset-password");
});

router.post("/reset-password", (req, res) => {
  const { email, password, password2 } = req.body;
  console.log(req.body);
  let errors = [];
  if (!email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("reset-password", {
      errors,
      password,
      email,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        errors.push({ msg: "User does not exist" });
        res.render("reset-password", {
          errors,
          email,
        });
      } else {
        user.password = password;
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then((user) => {
                // Flash registerd.
                req.flash(
                  "success_msg",
                  "Your account is activated. Please login to continue."
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.post("/register", async (req, res) => {
  const { id, email, code } = req.body;
  let errors = [];

  if (!email || !id || !code) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      id,
      email,
      code,
    });
  } else {
    const user = await User.findOne({ userId: id });
    if (user) {
      if (user.isActivated) {
        req.flash(
          "error_msg",
          "Your account is already activated. Login to continue"
        );
        res.redirect("/users/login");
        return;
      }
      if (email === user.email) {
        if (code === user.password) {
          user.isActivated = true;
          await user.save();
          req.flash(
            "success_msg",
            "Your account is activated. Please set your password to continue"
          );
          res.redirect("/users/reset-password");
          return;
        } else {
          errors.push({ msg: "Your activation code is incorrect" });
        }
      } else {
        errors.push({
          msg: "Email does not match your account. Please verify your email.",
        });
      }
    } else {
      errors.push({
        msg: "Your ID isn't registered. Please contact the administrator.",
      });
    }
    res.render("register", {
      errors,
      id,
      email,
      code,
    });
  }
});

router.post("/login", async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    if (!user.isActivated) {
      req.flash(
        "error_msg",
        "Your account isn't activated. Please activate to continue."
      );
      res.redirect("/users/register");
      return;
    }
  }
  try {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out successfully");
  res.redirect("/users/login");
});

module.exports = router;
