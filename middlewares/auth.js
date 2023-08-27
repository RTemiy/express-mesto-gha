const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Error401('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return next(new Error401('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
