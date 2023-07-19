const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const DEV_DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const DEV_JWT = 'some-secret-key';

module.exports = {
  limiter,
  DEV_DB_ADDRESS,
  DEV_JWT,
};
