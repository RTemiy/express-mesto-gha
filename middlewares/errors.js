const handleError = (err, req, res, next) => {
  const { statusCode = 500, message = 'Ошибка на стороне сервера' } = err;
  res.status(statusCode).send({ message });
  next();
};

module.exports = handleError;
