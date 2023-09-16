const router = require('express').Router();
const authRoute = require('./auth');
const auth = require('../middlewares/auth');
const Error404 = require('../errors/Error404');

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

module.exports = router;
