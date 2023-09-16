const handleError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (statusCode === 500) {
    res.status(statusCode).send({ message: 'Ошибка на стороне сервера' });
  } else {
    res.status(statusCode).send({ message });
  }
  next();
};

module.exports = handleError;
