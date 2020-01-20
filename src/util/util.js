/**
 * @module util
 */
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

/**
 * 生成一个包含英数字的随机字符串
 * @param {string} length - 字符串长度
 */
const generateUKey = (length = 8) => srs({ length, alphanumeric });

// const getIDSchema = (length = 8) => Joi.string().alphanum().length(length).required();

/**
 * 检查目录是否存在
 * @param {string} checkpath - 目录路径
 */
const checkPathExist = (checkpath) => {
  if (!fs.existsSync(checkpath)) throw new BizError(`${checkpath} does not exist`);
  return Promise.resolve();
};

/**
 * 删除指定文件，若文件不存在报错
 * @param {string} pathToBeDel - 待删除文件路径
 */
const deleteFile = pathToBeDel => checkPathExist(pathToBeDel)
  .then(() => fs.unlinkSync(pathToBeDel));

/**
 * 读取指定json文件
 * @param {string} jsonfilepath - json文件路径
 */
const loadJSONFile = jsonfilepath => checkPathExist(jsonfilepath)
  .then(() => jsonfile.readFileSync(jsonfilepath))
  .then(jsondata => jsondata);

/**
 * 创建目录，若目录不存在则创建，若存在则结束
 * @param {string} folder - 待创建目录路径
 */
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

/**
 * 读入CSV文件
 * @param {string} csvFilePath - 待创建目录路径
 * @param {encode} [encode] - 文件编码
 */
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
};

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
