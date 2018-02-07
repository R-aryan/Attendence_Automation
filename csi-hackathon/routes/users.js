const express = require('express');
const jwt = require('jsonwebtoken');
var multer = require('multer');
var path = require('path');

const User = require('../model/User');
const secret = 'csihackathon';

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    let newFileName = '';
    User.findOne({ sapid: req.session.userInfo.sapid })
      .select('sapid uploadedFiles')
      .exec((err, user) => {
        if (err) throw err;

        if (!user) {
          console.log('object');
          cb(null, file.originalname);
        } else {
          newFileName = `User.${user.sapid}.${user.uploadedFiles.length +
            1}${path.extname(file.originalname)}`;
          user.uploadedFiles.push(newFileName);

          user.save(err => {
            if (err) {
              res.json({
                success: false,
                message: err,
              });
            } else {
              console.log({ success: true, message: 'Image uploaded' });
            }
          });
          cb(null, newFileName);
        }
      });
  },
});

var upload = multer({ storage: storage });

const router = express.Router();

router.post('/register', (req, res) => {
  const user = new User();
  user.sapid = req.body.sapid;
  user.password = req.body.password;
  user.email = req.body.email;
  user.attendanceCount = req.body.attendanceCount;
  user.name = req.body.name;
  if (
    req.body.sapid === null ||
    req.body.sapid === '' ||
    req.body.password === null ||
    req.body.password === '' ||
    req.body.email === null ||
    req.body.email === '' ||
    req.body.attendanceCount === null ||
    req.body.attendanceCount === '' ||
    req.body.name === null ||
    req.body.name === ''
  ) {
    res.json({
      success: false,
      message: 'Ensure that sapid & password are provided',
    });
  } else {
    user.save(err => {
      if (err) {
        res.json({
          success: false,
          message: err,
        });
      } else {
        console.log({ success: true, message: 'User Created' });
        res.redirect('/login');
      }
    });
  }
});

router.post('/login', (req, res) => {
  let validPassword;
  User.findOne({ sapid: req.body.sapid })
    .select('sapid name password')
    .exec((err, user) => {
      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Could not authenticate user' });
      } else {
        if (req.body.password) {
          validPassword = user.comparePassword(req.body.password);

          if (!validPassword) {
            res.json({
              success: false,
              message: 'Could not authenticate password',
            });
          } else {
            const token = jwt.sign({ sapid: user.sapid }, secret, {
              expiresIn: '5min',
            });

            console.log({
              success: true,
              message: 'User authenticated',
              token: token,
            });

            req.session.userInfo = { token: token, sapid: user.sapid };
            console.log(req.session);

            res.redirect('/');
          }
        } else {
          res.json({ success: false, message: 'No password provided' });
        }
      }
    });
});

router.post('/imageUpload', upload.single('imageupload'), (req, res) => {
  /* const user = new User();
  user.name = req.body.name;

  user.save(err => {
    if (err) {
      res.json({
        success: false,
        message: err,
      });
    } else {
      console.log({ success: true, message: 'User Created' });
      res.redirect('/login');
    }
  }); */
  res.send('File uploaded Successfully!!');
});

router.get('/getUserDetails', (req, res) => {
  User.findOne({ sapid: req.session.userInfo.sapid })
    .then(user => {
      console.log(user);
      res.render('display', { details: user });
    })
    .catch(err => {
      console.log(err);
    });
});

router.use((req, res, next) => {
  const token =
    req.body.token ||
    req.body.query ||
    req.headers['x-access-token'] ||
    req.session.userInfo.token;

  if (token) {
    //verify token
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'token invalid' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({ success: false, message: 'no token provided' });
  }
});

router.get('/getallusers', (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.send(err));
});

router.get('/:sapid', function(req, res, next) {
  res.send('respond wit');
});

module.exports = router;
