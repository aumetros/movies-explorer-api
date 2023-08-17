const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_JWT } = require('../utils/config');

const {
  invalidUserDataMsg,
  existEmailMsg,
  invalidLoginData,
  userNotFoundMsg,
} = require('../utils/constants');

const {
  BadRequestError,
  AuthorizationError,
  NotFoundError,
  ExistEmailError,
} = require('../utils/errors');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email, password: hash, name,
      }))
      .then((user) => res.status(201).send(user.toJSON()))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError(invalidUserDataMsg));
        } else if (err.code === 11000) {
          next(new ExistEmailError(existEmailMsg));
        } else {
          next(err);
        }
      });
  }
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError(invalidLoginData);
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT,
              { expiresIn: '7d' },
            );
            res
              .cookie('jwt', token, {
                maxAge: 604800000,
                httpOnly: true,
                sameSite: true,
              })
              .send(user.toJSON());
          } else {
            next(new AuthorizationError(invalidLoginData));
          }
        })
        .catch(next);
    })
    .catch(next);
};

const logoutUser = (req, res) => {
  res.status(202).clearCookie('jwt').send({ message: 'Куки удалены' });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError(userNotFoundMsg))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === userNotFoundMsg) {
        next(new NotFoundError(userNotFoundMsg));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError(userNotFoundMsg))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === userNotFoundMsg) {
        next(new NotFoundError(userNotFoundMsg));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(invalidUserDataMsg));
      } else if (err.code === 11000) {
        next(new ExistEmailError(existEmailMsg));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
};
