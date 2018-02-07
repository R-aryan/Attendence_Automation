const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
  sapid: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  uploadedFiles: {
    type: Array,
    default: [],
  },
  att: {
    type: Number,
    default: 0,
  },
});

//encrption of password using bcrypt-nodejs
/* UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next();
    user.password = hash;
    next();
  });
}); */

UserSchema.methods.comparePassword = function(password) {
  return password === this.password;
};

module.exports = mongoose.model('User', UserSchema);
