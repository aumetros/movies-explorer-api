const mongoose = require('mongoose');

const User = require('../models/user');

const ObjectID = mongoose.Types.ObjectId;

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

};

module.exports = {
  getUser,
  updateUser,
};
