const jwt = require('jsonwebtoken');

// const { NODE_ENV, JWT_SECRET } = process.env;
// const { AuthorizationError } = require('../utils/errors');

// const handleAuthError = () => {
//   throw new Error('Необходима авторизация');
// };

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация ' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация ' });
  }

  req.user = payload;

  next();
};

module.exports = auth;
