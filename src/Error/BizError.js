const { BaseError } = require('./BaseError');

class BizError extends BaseError {
  constructor(description, statusCode = 400, data) {
    super(description, statusCode, data);
  }
}

module.exports = {
  BizError,
};
