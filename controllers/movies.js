const mongoose = require('mongoose');

const Movie = require('../models/movie');

const {
  invalidUserDataMsg,
  invalidMovieDataMsg,
  movieNotFoundMsg,
  forbiddenErrorMsg,
} = require('../utils/constants');

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../utils/errors');

const ObjectID = mongoose.Types.ObjectId;

const getMovies = (req, res, next) => {
  if (!ObjectID.isValid(req.user._id)) {
    throw new BadRequestError(invalidUserDataMsg);
  }
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
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
    nameRU,
    nameEN,
    movieId,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(invalidMovieDataMsg));
      } else {
        next();
      }
    });
};

const deleteMovie = (req, res, next) => {
  if (!ObjectID.isValid(req.params._id)) {
    throw new BadRequestError(invalidMovieDataMsg);
  }
  Movie.findById(req.params._id)
    .orFail(() => new Error(movieNotFoundMsg))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        movie.deleteOne();
        return res.send(movie);
      }
      throw new ForbiddenError(forbiddenErrorMsg);
    })
    .catch((err) => {
      if (err.message === movieNotFoundMsg) {
        next(new NotFoundError(movieNotFoundMsg));
      } else {
        next();
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
