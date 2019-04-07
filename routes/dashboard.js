const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Notification = require('../schemas/NotificationModel');

router.get('/', (req, res) => {

    res.redirect('/dashboard/notifications');
});

router.get('/notifications', (req, res) => {

    Notification.find({}, (err, notifications) => {
        //console.log(users);
        res.render('dashboard-notifications', {
            user : req.user,
            notificationList: notifications  
        });
    });

});

router.get('/test', (req, res) => {
    res.send('Test');
})


router.get('/hello', (req, res) => {

    res.send('Hello');
})

module.exports = router;