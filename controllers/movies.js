const Movie = require('../models/movie');

const {
  invalidMovieDataMsg,
  movieNotFoundMsg,
  forbiddenErrorMsg,
} = require('../utils/constants');

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../utils/errors');

const getMovies = (req, res, next) => {
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
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => new NotFoundError(movieNotFoundMsg))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        movie.deleteOne()
          .then((delMovie) => res.send({ data: delMovie }))
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenErrorMsg);
      }
    })
    .catch((err) => {
      if (err.message === movieNotFoundMsg) {
        next(new NotFoundError(movieNotFoundMsg));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
