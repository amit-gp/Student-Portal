module.exports = {
    ensureAuthenticated : function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash ('error_msg', 'Please log in first.');
        res.redirect('/users/login');
    },

    isAlreadyLoggedIn : function(req,res, next) {
        
        if (! req.isAuthenticated()) {
            return next();
        }

        req.flash('success_msg', 'You are already logged in, logout first.');
        res.redirect('/dashboard');
    }
};