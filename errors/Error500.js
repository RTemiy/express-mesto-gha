module.exports = class Error500 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
};
