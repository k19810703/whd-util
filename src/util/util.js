const fs = require('fs');
const srs = require('secure-random-string');
const Papa = require('papaparse');
const jsonfile = require('jsonfile');

const { BizError } = require('../Error/BizError');

const length = 8;
const alphanumeric = true;

const generateUKey = () => srs({ length, alphanumeric });

// 检查checkpath是否存在
const checkPathExist = (checkpath) => {
  if (!fs.existsSync(checkpath)) throw new BizError(`${checkpath} does not exist`);
};

// 删除path
const deleteFile = path => checkPathExist(path)
  .then(() => fs.unlinkSync(path));

// 读取jsonfilepath指向的json文件，返回内容
const loadJSONFile = jsonfilepath => checkPathExist(jsonfilepath)
  .then(() => jsonfile.readFileSync(jsonfilepath))
  .then(jsondata => jsondata);

const createFolderWhenNotExist = folder => fs.existsSync(folder)
  .then((fileexist) => {
    if (!fileexist) fs.mkdirSync(folder);
  });

const loadCSVFIle = (csvFilePath, encode = 'utf-8') => {
  Papa.parse(fs.readFileSync(csvFilePath, encode), {
    complete: (results) => {
      this.data = Promise.resolve(results.data);
    },
    error: (error) => {
      Promise.reject(error);
    },
  });
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


module.exports = {
  checkPathExist,
  deleteFile,
  loadJSONFile,
  generateUKey,
  createFolderWhenNotExist,
  getFileList,
  loadCSVFIle,
};
