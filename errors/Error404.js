module.exports = class Error404 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
