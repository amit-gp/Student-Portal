const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Notification = require("../schemas/NotificationModel");
const User = require("../schemas/UserModel");

router.get("/", (req, res) => {
  res.redirect("/dashboard/notifications");
});

router.get("/college-notifications", (req, res) => {
  res.redirect("/dashboard/notifications");
});

router.get("/notifications", (req, res) => {
  Notification.find(
    {
      level: "college",
    },
    (err, notifications) => {
      //console.log(users);
      res.render("college-notifications", {
        user: req.user,
        notificationList: notifications,
        page: "college-notifications",
      });
    }
  );
});

router.get("/results", (req, res) => {
  res.render("results", { user: req.user, page: "results" });
});

router.get("/about-us", (req, res) => {
  res.render("about-us", { user: req.user, page: "about-us" });
});

router.get("/department-notifications", (req, res) => {
  Notification.find(
    {
      level: "department",
    },
    (err, notifications) => {
      //console.log(users);
      res.render("department-notifications", {
        user: req.user,
        notificationList: notifications,
        page: "department-notifications",
      });
    }
  );
});

router.get("/user-details", (req, res) => {
  const email = req.user.email;
  User.findOne(
    {
      email: email,
    },
    (err, user) => {
      //console.log(user);
      res.render("user-details", {
        user: user,
        page: "user-details",
      });
    }
  );
});

router.get("/test", (req, res) => {
  res.send("Test");
});

router.get("/hello", (req, res) => {
  res.send("Hello");
});

router.get("/notifications/:id", function (req, res) {
  Notification.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundNotification) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        console.log(foundNotification);
        res.render("show", {
          notification: foundNotification,
        });
      }
    });
});

module.exports = router;
