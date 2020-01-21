const { BaseError } = require('./BaseError');

/**
 * 系统错误
 * @class
 * @augments BaseError
 */
class SystemError extends BaseError {
  /**
   * @constructs SystemError
   * @param {string} description - 错误描述
   * @param {number} [statusCode=500] - HTTP状态码
   * @param {Object} data - 错误信息
   */
  constructor(description, statusCode = 500, data) {
    super(description, statusCode, data);
  }
}

module.exports = {
  SystemError,
};
