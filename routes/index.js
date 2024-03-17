var express = require('express');
const userModel = require("./users")
const passport = require('passport');
var router = express.Router();
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
var userdata

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
// profile route 
router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render('profile');
});
// register route
router.post('/register', function (req, res) {
  userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });
  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');

      });
    }
    )
}
)

// login route
router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function (req, res) { });

// logout route
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}



module.exports = router;
