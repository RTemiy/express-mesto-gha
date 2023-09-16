const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const { errors } = require('celebrate');
const limiter = require('express-rate-limit')({
  windowMs: 200,
  max: 100,
  message: 'Превышено количество запросов',
});
const { requestLogger, errorLogger } = require('../middlewares/logger');
const corsChecker = require('../middlewares/corsChecker');
const authRoute = require('./auth');
const auth = require('../middlewares/auth');
const Error404 = require('../errors/Error404');
const handleError = require('../middlewares/errors');
const router = require('./auth');

router.use(requestLogger);

router.use(limiter);
router.use(helmet());
router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(corsChecker);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/', authRoute);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.all('*', (req, res, next) => {
  next(new Error404('Страница не существует'));
});

router.use(errorLogger);

router.use(errors());

router.use(handleError);

module.exports = router;
