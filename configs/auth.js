const Notification = require("../schemas/NotificationModel");
const User = require("../schemas/UserModel");
const Comment = require("../schemas/CommentModel");
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "Please log in first.");
    res.redirect("/users/login");
  },

  isAlreadyLoggedIn: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "You are already logged in, logout first.");
    res.redirect("/dashboard");
  },
  checkCommentOwnership: function (req, res, next) {
    if (req.isAuthenticated()) {
      Notification.findById(req.params.id, function (err, foundNotification) {
        if (err) {
          req.flash(
            "error_msg",
            "There was some error. Please try again later"
          );
          res.redirect("/dashboard/notifications/" + req.params.id);
        } else {
          //find Comment
          Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
              req.flash(
                "error_msg",
                "There was some error. Please try again later"
              );
              res.redirect("/dashboard/notifications/" + req.params.id);
            } else {
              //check the author
              if (foundComment.author.id.equals(req.user._id)) {
                next();
              } else {
                req.flash("error_msg", "Access denied");
                res.redirect("/dashboard/notifications/" + req.params.id);
              }
            }
          });
        }
      });
    } else {
      req.flash("error_msg", "Please log in first.");
      res.redirect("/users/login");
    }
  },
  checkIfStaff: function (req, res, next) {
    if (req.user.isStaff) {
      return next();
    }
    req.flash("error_msg", "You do not have the required permission.");
    res.redirect("/dashboard");
  },
};
