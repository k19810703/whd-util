const fs = require('fs');
const https = require('https');
const axios = require('axios');
// const Joi = require('@hapi/joi');
const srs = require('secure-random-string');
const Papa = require('papaparse');
const jsonfile = require('jsonfile');
const path = require('path');
const { BizError } = require('../Error/BizError');


// const length = 8;
const alphanumeric = true;

const generateUKey = (length = 8) => srs({ length, alphanumeric });

// const getIDSchema = (length = 8) => Joi.string().alphanum().length(length).required();

// 检查checkpath是否存在
const checkPathExist = (checkpath) => {
  if (!fs.existsSync(checkpath)) throw new BizError(`${checkpath} does not exist`);
  return Promise.resolve();
};

// 删除path
const deleteFile = pathToBeDel => checkPathExist(pathToBeDel)
  .then(() => fs.unlinkSync(pathToBeDel));

// 读取jsonfilepath指向的json文件，返回内容
const loadJSONFile = jsonfilepath => checkPathExist(jsonfilepath)
  .then(() => jsonfile.readFileSync(jsonfilepath))
  .then(jsondata => jsondata);

const createFolderWhenNotExist = folder => Promise.resolve(fs.existsSync(folder))
  .then((fileexist) => {
    if (!fileexist) {
      let pathtmp;
      folder.split(/[/\\]/).forEach((dirname) => {
        pathtmp = pathtmp ? path.join(pathtmp, dirname) : dirname;
        if (!fs.existsSync(pathtmp)) {
          fs.mkdirSync(pathtmp);
        }
      });
    }
    return Promise.resolve();
  });

const loadCSVFIle = async (csvFilePath, encode = 'utf-8') => {
  const result = await Papa.parse(fs.readFileSync(csvFilePath, encode), {
    complete: results => Promise.resolve(results.data),
    // error: error => Promise.reject(error),
  });
  return Promise.resolve(result.data);
};

// 获取folder下的所有文件信息，ignoreSystemFile=true时候排除系统文件
async function getFileList(folder, ignoreSystemFile = true) {
  await checkPathExist(folder);
  const folderInfo = fs.readdirSync(folder);
  const fileList = [];
  folderInfo.forEach((ele) => {
    const info = fs.statSync(`${folder}/${ele}`);
    if (!info.isDirectory()) {
      const { size, ctime: createtimestamp, mtime: modifytimestamp } = info;
      if ((ignoreSystemFile && !ele.startsWith('.')) || !ignoreSystemFile) {
        fileList.push({
          filename: ele,
          size,
          createtimestamp,
          modifytimestamp,
        });
      }
    }
  });
  return Promise.resolve(fileList);
}

const httpClient = ({ baseURL, timeout, headers }) => {
  const axiosConfig = {
    baseURL,
    timeout: timeout || 10000,
    hearders: headers || undefined,
    httpsAgent: baseURL.startsWith('https') ? new https.Agent({
      rejectUnauthorized: false,
    }) : undefined,
  };
  const instance = axios.create(axiosConfig);
  return instance;
}

module.exports = {
  checkPathExist,
  deleteFile,
  loadJSONFile,
  generateUKey,
  createFolderWhenNotExist,
  getFileList,
  loadCSVFIle,
  httpClient,
  // getIDSchema,
};
