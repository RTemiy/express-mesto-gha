module.exports = class Error403 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
