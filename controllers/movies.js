const mongoose = require('mongoose');

const Movie = require('../models/movie');

const ObjectID = mongoose.Types.ObjectId;

const getMovies = (req, res) => {
  if (!ObjectID.isValid(req.user._id)) {
    res.status(400).send({ message: 'Неправильные данные пользователя' });
    return;
  }
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const createMovie = (req, res) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRu,
    nameEn,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    thumbnail,
    owner: req.user._id,
    nameRu,
    nameEn,
    movieId,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неправильные данные фильма' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteMovie = (req, res) => {

};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
