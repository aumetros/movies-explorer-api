/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable object-shorthand */

const mongoose = require('mongoose');

const { emailReg } = require();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function(v) {
        return emailReg.test(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
