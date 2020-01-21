const { BaseError } = require('./BaseError');

/**
 * 业务错
 * @class
 * @augments BaseError
 */
class BizError extends BaseError {
  /**
   * @constructs BizError
   * @param {string} description - 错误描述
   * @param {number} [statusCode=400] - HTTP状态码
   * @param {Object} data - 错误信息
   */
  constructor(description, statusCode = 400, data) {
    super(description, statusCode, data);
  }
}

module.exports = {
  BizError,
};
