const { BaseError } = require('./BaseError');

class BizError extends BaseError {
  constructor(description, data, statusCode = 400) {
    super(description, data, statusCode);
  }
}

module.exports = {
  BizError,
};
