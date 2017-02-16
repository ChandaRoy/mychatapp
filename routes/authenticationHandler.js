var express = require('express'),
router = express.Router();

module.exports = function(passport){

  //sends successful login state back to angular
  router.get('/success', function(req, res){
    res.send({error:null});
  });

  //sends failure login state back to angular
  router.get('/failure', function(req, res){
    res.send({ error: "Invalid Email or Password"});
  });
  router.get('/regfailure', function(req, res){
    res.send({ error: "Email Id already exits"});
  });

  router.use('/login',function(req,res,next) {
    console.log("Request Body login.",req.body);
    next();
  });
  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'
  }));

  //sign up
  router.use('/register',function(req,res,next) {
    console.log("Request Body.",req.body);
    next();
  });
  router.post('/register', passport.authenticate('sign-up', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/regfailure'
  }));


  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/index.html');
  });

  return router;

}
