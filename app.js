const express = require('express');
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();
const bodyParser = require('body-parser');

const limiter = require('express-rate-limit')({
  windowMs: 200,
  max: 100,
  message: 'Превышено количество запросов',
});

const { requestLogger, errorLogger } = require('./middlewares/logger');

const authRoute = require('./routes/auth');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/errors');
const Error404 = require('./errors/Error404');
const corsChecker = require('./middlewares/corsChecker');

app.use(requestLogger);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(corsChecker);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', authRoute);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new Error404('Страница не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {});
