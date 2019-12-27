# whd-util

##  API

### log
  环境变量LogLevel定制log输出登记，[参考](https://github.com/winstonjs/winston#logging-levels)

  ```javascript
  const { log } = require('whd-util');
  log.info('i am log');
  ```
### UserDefineError
```javascript
  const { UserDefineError } = require('whd-util');
  const {
    BizError,
    SystemError,
  } = UserDefineError;

  const httpStatus = 500;
  const errorData = {
    error: 'i am error',
  };
  throw new BizError('message', httpStatus, errorData);
```
### util
```javascript
const { util } = require('whd-util');
const {
  checkPathExist,
  deleteFile,
  loadJSONFile,
  generateUKey,
  createFolderWhenNotExist,
  getFileList,
  loadCSVFIle,
  httpClient,
} = util;

const httpclient = util.httpClient({
  baseURL: 'http://www.httpbin.org',
});
const response = await httpclient.get('/get');
```
