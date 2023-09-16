const express = require('express');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

const limiter = require('express-rate-limit')({
  windowMs: 200,
  max: 100,
  message: 'Превышено количество запросов',
});

const { requestLogger, errorLogger } = require('./middlewares/logger');

const handleError = require('./middlewares/errors');
const corsChecker = require('./middlewares/corsChecker');

app.use(requestLogger);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(corsChecker);

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {});
