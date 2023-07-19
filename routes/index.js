const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('../middlewares/auth');

const { createUser, loginUser, logoutUser } = require('../controllers/users');
const { NotFoundError } = require('../utils/errors');
const { routeNotFoundMsg } = require('../utils/constants');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), loginUser);

router.post('/signout', logoutUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(routeNotFoundMsg));
});

router.use(errors());

module.exports = router;
