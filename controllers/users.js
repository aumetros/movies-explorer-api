const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ObjectID = mongoose.Types.ObjectId;

const createUser = (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).send({ message: 'Неправильные данные' });
    return;
  }
  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email, password: hash, name,
      }))
      .then((user) => res.status(201).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Неправильные данные' });
        } else if (err.code === 11000) {
          res.status(400).send({ message: 'Пользователь существует' });
        } else {
          res.status(500).send({ message: 'Ошибка сервера' });
        }
      });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        res.status(400).send({ message: 'Неправильные данные' });
        return;
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, 'some-secret-key');
            res.send({ token });
          } else {
            res.status(400).send({ message: 'Неправильные данные' });
          }
        })
        .catch(() => {
          res.status(400).send({ message: 'Неправильные данные' });
        });
    })
    .catch(() => {
      res.status(400).send({ message: 'Неправильные данные' });
    });
};

const logoutUser = (req, res) => {
  res.status(202).clearCookie('jwt').send('cookie cleared');
  // res.redirect('/');
};

const getUser = (req, res) => {
  if (!ObjectID.isValid(req.user._id)) {
    res.status(400).send({ message: 'Неправильные данные' });
    return;
  }
  User.findById(req.user._id)
    .orFail(() => new Error('Юзер не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Юзер не найден') {
        res.status(404).send({ message: 'Юзер не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateUser = (req, res) => {
  const { email, name } = req.body;
  if (!ObjectID.isValid(req.user._id)) {
    res.status(400).send({ message: 'Неправильные данные' });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Юзер не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Юзер не найден') {
        res.status(404).send({ message: 'Юзер не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неправильные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
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
