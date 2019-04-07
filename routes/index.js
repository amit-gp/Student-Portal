const express = require('express');
const router = express.Router();
const {ensureAuthenticated, isAlreadyLoggedIn} = require('../configs/auth');

router.get('/',isAlreadyLoggedIn, (req, res) => {
    res.render('welcome');
});

// router.get('/dashboard', (req,res) => {
//     res.render('dashboard', {
//         name : req.user.name
//     });
// })

module.exports = router;