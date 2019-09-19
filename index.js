const { BizError } = require('./src/Error/BizError');
const { SystemError } = require('./src/Error/SystemError');
const { log } = require('./src/log/log');
const {
  checkPathExist,
  deleteFile,
  loadJSONFile,
  generateUKey,
  createFolderWhenNotExist,
  getFileList,
  loadCSVFIle,
} = require('./src/util/util');

module.exports = {
  log,
  UserDefineError: {
    BizError,
    SystemError,
  },
  util: {
    checkPathExist,
    deleteFile,
    loadJSONFile,
    generateUKey,
    createFolderWhenNotExist,
    getFileList,
    loadCSVFIle,
  },
};
