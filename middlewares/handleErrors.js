const { intServerErrorMsg } = require('../utils/constants');

const handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? intServerErrorMsg
        : message,
    });
  next();
};

module.exports = handleErrors;
