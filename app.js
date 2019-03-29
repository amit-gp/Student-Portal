const express = require('express');
const app = express();
const path = require('path');
const PORT = process.argv[2];
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
// const expressLayouts = require('express-ejs-layouts');
const expressSession = require('express-session');
const flash = require('connect-flash');
const cookieParser = require ('cookie-parser');
const passport = require('passport');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const session_secret = process.argv[3];

require('./configs/passport-config')(passport);

if (session_secret === undefined) {
    console.log (`ERROR: Session secret has not been not specified.\nUsage: npm run [CONFIG],[session-secret]
    `);
    process.exit();
}

if (PORT === undefined) {
    console.log (`ERROR: PORT has not been not specified.\nUsage: npm run [CONFIG],[session-secret]
    `);
    process.exit();
}

const mongooseOptions = {
    useNewUrlParser : true
}

mongoose.connect('mongodb://localhost:27017/studentportal', mongooseOptions, (err) => {

    if (err) {
        console.log ('Error connecting to the MongoDB database... terminating now.');
        process.exit();
    }
    console.log ('Connected to MongoDB successfully.');
});

// EJS
//app.use (expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set ('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use (expressSession({

    secret: session_secret,
    saveUninitialized: true,
    resave: true
}))

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use ('/', indexRoutes);
app.use ('/users', userRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  

app.listen(PORT, console.log(`Server started on port ${PORT}`));