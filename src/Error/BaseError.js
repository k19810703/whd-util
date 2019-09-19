class BaseError {
  constructor(description, statusCode = 500, data = {}) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.statusCode = statusCode;
    this.message = description;
    this.data = data;
  }
}

module.exports = {
  BaseError,
};
