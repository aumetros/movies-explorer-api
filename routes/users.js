const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const { getUser, updateUser } = require('../controllers/users');

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.use(errors());

module.exports = router;
