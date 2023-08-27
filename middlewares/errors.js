const handleError = (err, res) => {
  res.status(err.statusCode).send({ message: err.message });
};

module.exports = handleError;
