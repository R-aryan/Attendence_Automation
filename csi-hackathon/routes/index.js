var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('login');
// });

// router.use((req, res, next) => {
//   const token =
//     req.body.token ||
//     req.body.query ||
//     req.headers['x-access-token'] ||
//     req.session.userInfo.token;

//   if (token) {
//     //verify token
//     jwt.verify(token, secret, (err, decoded) => {
//       if (err) {
//         res.json({ success: false, message: 'token invalid' });
//       } else {
//         req.decoded = decoded;
//         next();
//       }
//     });
//   } else {
//     res.json({ success: false, message: 'no token provided' });
//   }
// });

router.get('/', function(req, res, next) {
  User.findOne({ sapid: req.session.userInfo.sapid })
  .then(user => {
    console.log(user);
    res.render('display', { details: user });
  })
  .catch(err => {
    console.log(err);
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});
router.get('/upload', (req, res) => {
  res.render('uploadImage');
});

module.exports = router;
