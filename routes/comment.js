const express = require('express');
const router = express.Router({
    mergeParams: true
});
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Notification = require('../schemas/NotificationModel');
const User = require('../schemas/UserModel');
const Comment = require('../schemas/CommentModel');
const {
    ensureAuthenticated,
    checkCommentOwnership
} = require('../configs/auth');

router.get("/new", ensureAuthenticated, function (req, res) {
    Notification.findById(req.params.id, function (err, foundNotification) {
        if (err) {
            console.log(err)
        } else {
            res.render("comment/new", {
                notification: foundNotification
            })
        }
    })
})

router.post("/", ensureAuthenticated, function (req, res) {
    Notification.findById(req.params.id, function (err, notification) {
        if (err) {
            console.log(err)
            //req.flash("error", "Something went wrong")
            res.redirect("/dashboard/notifications/" + req.params.id)
        } else {

            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err)
                } else {


                    comment.author.id = req.user._id;
                    comment.author.firstName = req.user.firstname;
                    comment.author.lastName = req.user.lastname;

                    comment.save();

                    notification.comments.push(comment);
                    notification.save();
                    // req.flash("success", "Comment added successfully")
                    res.redirect("/dashboard/notifications/" + req.params.id)
                }
            });


        }
    });
})
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
    Notification.findById(req.params.id, function (err, foundNotification) {
        if (err) {

            console.log(err)
        } else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                res.render("comment/edit", {
                    notification: foundNotification,
                    comment: foundComment
                })
            })

        }
    })
})

router.put("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            // req.flash("error", "Something went wrong")
            res.redirect("/dashboard/notifications/" + req.params.id)
        } else {
            // req.flash("success", "Comment updated successfully")
            res.redirect("/dashboard/notifications/" + req.params.id)
        }
    })
})

router.delete("/:comment_id", checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            // req.flash("error", "Something went wrong")
            // console.log('failed to delete comment')
            res.redirect("/dashboard/notifications/" + req.params.id)
        } else {
            // req.flash("success", "Comment deleted.")
            res.redirect("/dashboard/notifications/" + req.params.id)
        }
    })
})
module.exports = router;