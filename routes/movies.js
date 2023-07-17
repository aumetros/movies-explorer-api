const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { linkReg } = require('../utils/constants');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(linkReg).required(),
    trailer: Joi.string().pattern(linkReg).required(),
    nameRu: Joi.string().required(),
    nameEn: Joi.string().required(),
    thumbnail: Joi.string().pattern(linkReg).required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

router.use(errors());

module.exports = router;
