const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { AuthorizationError } = require('../utils/errors');
const { authErrorMsg } = require('../utils/constants');
const { DEV_JWT } = require('../utils/config');

const handleAuthError = () => {
  throw new AuthorizationError(authErrorMsg);
};

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return handleAuthError();
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT);
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload;

  next();
};

module.exports = auth;
