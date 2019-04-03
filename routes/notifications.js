const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Notification = require('../schemas/NotificationModel');

router.get('/test', (req, res) => {

    res.render('dashboard', {
        name : 'req.user.name'
    });
})

module.exports = router;