require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes');
const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter, DEV_DB_ADDRESS } = require('./utils/config');

const { PORT = 3000, NODE_ENV, PROD_DB_ADDRESS } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? PROD_DB_ADDRESS : DEV_DB_ADDRESS);

app.use(helmet());

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(limiter);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(router);

app.use(errorLogger);

app.use(handleErrors);

app.listen(PORT, () => {
  console.log('Сервер запущен на порту 3000');
});
