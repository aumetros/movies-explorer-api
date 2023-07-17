require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes');
const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter, DB_ADDRESS } = require('./utils/config');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(DB_ADDRESS);

app.use(helmet());

app.use(express.json());
app.use(cookieParser());

app.use(limiter);

app.use(requestLogger);

app.use(cors({
  credentials: true,
}));

app.use(router);

app.use(errorLogger);

app.use(handleErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Сервер запущен на порту 3000');
});
