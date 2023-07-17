const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { AuthorizationError } = require('../utils/errors');
const { authErrorMsg } = require('../utils/constants');

const handleAuthError = () => {
  throw new AuthorizationError(authErrorMsg);
};

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return handleAuthError();
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload;

  next();
};

module.exports = auth;
