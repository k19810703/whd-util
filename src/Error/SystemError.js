const { BaseError } = require('./BaseError');

class SystemError extends BaseError {
  constructor(description, statusCode = 500, data) {
    super(description, statusCode, data);
  }
}

module.exports = {
  SystemError,
};
