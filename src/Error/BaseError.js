/**
 * 错误基础类
 * @class
 */
class BaseError {
  /**
   * @constructs BaseError
   * @param {string} description - 错误描述
   * @param {number} statusCode - HTTP状态码
   * @param {Object} data - 错误信息
   */
  constructor(description, statusCode, data = {}) {
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
