module.exports = class Error409 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
