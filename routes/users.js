var express = require('express');
var router = express.Router();

// To hash a password
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

// Token
var jwt = require('jsonwebtoken');

const Auth = require('./auth')
const User = require('../model/User')

router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) res.sand(err)
    res.json(users)
  })
})

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login' })
})

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Register' })
})

router.post('/register', (req, res, next) => {

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      var newUser = User({
        username: req.body.username,
        password: hash
      })
      newUser.save(function(err) {
        if (err) throw err;
        console.log('User created!');
        res.redirect('/users/login')
      });

    });
  });
  
})

router.post('/login', (req, res, next) => {
  if (!req.body.username || !req.body.password) req.json({ error: "Please enter your email and password" })
  User.findOne({ 
    username: req.body.username
  }, (err, user) => {
    if (err) res.json(err)
    if (!user) res.json({ error: "Incorrect email & password combination." })

    // Load hash from your password DB.
    bcrypt.compare(req.body.password, user.password, function(err, isAuth) {
      if (err) res.json({ error: err})
      req.session.user = user.username
      req.session.admin = true
      res.redirect('/users/profile')
    })
    
  })
})

router.get('/profile', Auth, (req, res) => {
  res.send('you can only see this after you\'ve logged in.' + req.session.user)
})


module.exports = router;
