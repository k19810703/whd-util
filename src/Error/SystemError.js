const { BaseError } = require('./BaseError');

class SystemError extends BaseError {
  constructor(description, data, statusCode = 500) {
    super(description, data, statusCode);
  }
}

module.exports = {
  SystemError,
};
