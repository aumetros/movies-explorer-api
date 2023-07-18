const mongoose = require('mongoose');

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

const ObjectID = mongoose.Types.ObjectId;

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email, password: hash, name,
      }))
      .then((user) => res.status(201).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError(invalidUserDataMsg));
        } else if (err.code === 11000) {
          next(new ExistEmailError(existEmailMsg));
        } else {
          next();
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
        throw new BadRequestError(invalidLoginData);
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
                maxAge: 3600000 * 24,
                httpOnly: true,
                sameSite: true,
              })
              .send(user.toJSON());
          } else {
            next(new BadRequestError(invalidLoginData));
          }
        })
        .catch(() => {
          next(new BadRequestError(invalidLoginData));
        });
    })
    .catch(() => {
      next(new AuthorizationError(invalidLoginData));
    });
};

const logoutUser = (req, res) => {
  res.status(202).clearCookie('jwt').send({ message: 'Куки удалены' });
};

const getUser = (req, res, next) => {
  if (!ObjectID.isValid(req.user._id)) {
    throw new BadRequestError(invalidUserDataMsg);
  }
  User.findById(req.user._id)
    .orFail(() => new Error(userNotFoundMsg))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === userNotFoundMsg) {
        next(new NotFoundError(userNotFoundMsg));
      } else {
        next();
      }
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  if (!ObjectID.isValid(req.user._id)) {
    throw new BadRequestError(invalidUserDataMsg);
  }
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error(userNotFoundMsg))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === userNotFoundMsg) {
        next(new NotFoundError(userNotFoundMsg));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(invalidUserDataMsg));
      } else if (err.code === 11000) {
        next(new ExistEmailError(existEmailMsg));
      } else {
        next();
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
