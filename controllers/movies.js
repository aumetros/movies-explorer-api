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
  if (!req.params._id) {
    res.status(400).send({ message: 'Не переданы данные фильма' });
    return;
  }
  Movie.findOne({ movieId: req.params._id })
    .orFail(() => new Error('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        movie.deleteOne();
        return res.send(movie);
      }
      return res.status(401).send({ message: 'Удаление карточки запрещено' });
    })
    .catch((err) => {
      if (err.message === 'Фильм не найден') {
        res.status(404).send({ message: 'Фильм не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
