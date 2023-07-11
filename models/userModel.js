const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { stringify } = require('querystring');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same....',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/* This is for password modification and encryption .... 
Currently not using because of importing modified and encypted password... in user.json.document*/

userScheme.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //   Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //   Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userScheme.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userScheme.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userScheme.methods.correctPassword = async function (
  canditatePassword,
  userPassword
) {
  return await bcrypt.compare(canditatePassword, userPassword);
};

userScheme.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);

    return JWTTimestamp < changedTimestamp;
  }

  //   False means not changed
  return false;
};

userScheme.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashCode = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetToken = hashCode;

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userScheme);
module.exports = User;
