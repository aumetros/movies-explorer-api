const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const { getUser, updateUser } = require('../controllers/users');
const { emailReg } = require('../utils/constants');

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object({
    email: Joi.string().pattern(emailReg).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.use(errors());

module.exports = router;
