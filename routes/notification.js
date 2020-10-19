const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const { ensureAuthenticated, checkIfStaff } = require("../configs/auth");
const Notification = require("../schemas/NotificationModel");
router.get("/new", [ensureAuthenticated, checkIfStaff], function (req, res) {
  const options = ["College", req.user.department];
  res.render("notification/new", {
    user: req.user,
    page: "new-notification",
    options,
  });
});

router.post("/", [ensureAuthenticated, checkIfStaff], function (req, res) {
  const notification = new Notification(req.body);
  notification.author.id = req.user._id;
  notification.author.firstName = req.user.firstName;
  notification.author.lastName = req.user.lastName;
  notification.save();
  if (req.body.level === "College") {
    res.redirect("/dashboard/");
  } else {
    res.redirect("/dashboard/department-notifications");
  }
});

module.exports = router;
