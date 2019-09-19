/* eslint-env jest */
const fs = require('fs');

const { util } = require('../../index');
const { UserDefineError } = require('../../index');
const testdata = require('../data/test.json');

const {
  BizError,
} = UserDefineError;

const testfile = './filetobedelete';

describe('generateUKey test', () => {
  const ukey = util.generateUKey();

  test('alphanumeric only', async () => {
    expect(ukey).toMatch(/^[0-9a-zA-Z]+$/);
  });

  test('expect length is 8', async () => {
    expect(ukey.length).toBe(8);
  });
});

describe('checkPathExist test', () => {
  test('folder not exist', async () => {
    expect.assertions(3);
    try {
      await util.checkPathExist('./notexistfolder');
    } catch (error) {
      expect(error).toBeInstanceOf(BizError);
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual(expect.objectContaining({}));
    }
  });

  test('folder exist', async () => {
    expect.assertions(0);
    try {
      await util.checkPathExist(__dirname);
    } catch (error) {
      expect(error).toBeInstanceOf(BizError);
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual(expect.objectContaining({}));
    }
  });
});

describe('deleteFile test', () => {
  test('file not exist', async () => {
    expect.assertions(3);
    try {
      await util.deleteFile('./notexistfile');
    } catch (error) {
      expect(error).toBeInstanceOf(BizError);
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual(expect.objectContaining({}));
    }
  });

  test('file exist', async () => {
    expect.assertions(0);
    try {
      fs.writeFileSync(testfile, 'aaa');
      await util.checkPathExist(testfile);
      await util.deleteFile(testfile);
    } catch (error) {
      expect(error).toBeInstanceOf(BizError);
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual(expect.objectContaining({}));
    }
  });
});

describe('loadJSONFile test', () => {
  test('file not exist', async () => {
    expect.assertions(3);
    try {
      await util.loadJSONFile('./notexistfile');
    } catch (error) {
      expect(error).toBeInstanceOf(BizError);
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual(expect.objectContaining({}));
    }
  });

  test('file exist', async () => {
    const jsondata = await util.loadJSONFile(`${__dirname}/../data/test.json`);
    expect(jsondata).toEqual(expect.objectContaining(testdata));
  });
});

describe('createFolderWhenNotExist test', () => {
  test('folder not exist', async () => {
    expect.assertions(0);
    try {
      await util.createFolderWhenNotExist('./testFolder');
    } catch (error) {
      expect(error).toBeInstanceOf(BizError);
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual(expect.objectContaining({}));
    }
  });

  test('folder not exist', async () => {
    expect.assertions(0);
    try {
      await util.createFolderWhenNotExist('./testFolder');
      fs.rmdirSync('./testFolder');
    } catch (error) {
      expect(error).toBeInstanceOf(BizError);
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual(expect.objectContaining({}));
    }
  });
});

describe('loadCSVFIle test', () => {
  test('load csv file', async () => {
    const expectData = [['a', 'b', 'c'], ['1', '2', '3'], ['4', '5', '6']];
    const csvdata = await util.loadCSVFIle(`${__dirname}/../data/test.csv`);
    expect(csvdata).toEqual(expect.objectContaining(expectData));
  }); 
});

describe('getFileList test', () => {
  test('getFileList folder not exist', async () => {
    expect.assertions(3);
    try {
      await util.getFileList('./notexistfile');
    } catch (error) {
      expect(error).toBeInstanceOf(BizError);
      expect(error.statusCode).toBe(400);
      expect(error.data).toEqual(expect.objectContaining({}));
    }
  });

  test('getFileList ignore system file', async () => {
    const filelist = await util.getFileList(`${__dirname}/../data`);
    expect(filelist.length).toEqual(3);
  });

  test('getFileList not ignore system file', async () => {
    const filelist = await util.getFileList(`${__dirname}/../data`, false);
    expect(filelist.length).toEqual(4);
  });
});
