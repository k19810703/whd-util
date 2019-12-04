/* eslint-env jest */
const Joi = require('@hapi/joi');
const _ = require('lodash');

const { FileDB } = require('../../');
const { UserDefineError } = require('../../');


class DataModel extends FileDB {
  constructor(name, dbfilepath, init) {
    super(name, dbfilepath, init);
    const description = Joi.string().required();
    this.idSchema = Joi.string().empty('').length(8);
    this.createSchema = Joi.object().keys({
      id: Joi.string().empty(''),
      createtimestamp: Joi.number().empty(''),
      updatetimestamp: Joi.number().empty(''),
      description,
    });
    this.updateSchema = this.createSchema;
  }
}

class DataModelWOCreateSchema extends FileDB {
  constructor(name, dbfilepath) {
    super(name, dbfilepath);
    this.idSchema = Joi.string().empty('').length(8);
    this.createSchema = null;
  }
}

const dataSchema = Joi.object().keys({
  id: Joi.string().empty('').length(8).required(),
  createtimestamp: Joi.date().timestamp('unix').required(),
  updatetimestamp: Joi.date().timestamp('unix').required(),
  description: Joi.string().empty('').required(),
});

const testNewData = {
  description: 'description',
};

const prepareDatas = dataLength => _.fill(Array(dataLength), {
  description: 'description',
});

describe('FileDB test', () => {
  const data = new DataModel('data', './data.json', true);
  // const idschema1 = util.getIDSchema();
  // const idschema2 = util.getIDSchema(7);
  let newData;

  test('invalid data', async () => {
    const errorData = {
      ...testNewData,
      errorField: 'aaa',
    };
    try {
      newData = await data.create(errorData);
    } catch (error) {
      expect(error.isJoi).toBeTruthy();
      expect(error.message).toBe('"errorField" is not allowed');
    }
  });

  test('create return data should be right', async () => {
    newData = await data.create(testNewData);
    const { error } = dataSchema.validate(newData);
    expect(error).toBeUndefined();
    expect(newData.description).toBe('description');
  });

  test('data created could be retrieved by findById', async () => {
    const searchCondition = { description: 'description' };
    const dataCreated = await data.findByCondition(searchCondition);
    expect(dataCreated.length).toBe(1);
    expect(dataCreated[0]).toEqual(expect.objectContaining(newData));
  });

  test('data created could be retrieved by findById', async () => {
    const dataCreated = await data.findById(newData.id);
    expect(dataCreated).toEqual(expect.objectContaining(newData));
  });

  test('data created could be retrieved by findAll', async () => {
    const dataCreated = await data.findAll();
    expect(dataCreated.length).toEqual(1);
    expect(dataCreated[0]).toEqual(expect.objectContaining(newData));
  });

  test('update with invalid id', async () => {
    try {
      await data.update('abc', testNewData);
    } catch (error) {
      expect(error).toBeInstanceOf(UserDefineError.BizError);
      expect(error.message).toBe('id(abc) is not a valid id');
    }
  });

  test('update with not exist id', async () => {
    try {
      await data.update('12345678', testNewData);
    } catch (error) {
      expect(error).toBeInstanceOf(UserDefineError.BizError);
      expect(error.message).toBe('data id=12345678 can not be found in data');
    }
  });

  test('data created can be updated by update', async () => {
    const updateData = {
      ...testNewData,
      description: 'description1',
    };
    const dataUpdated = await data.update(newData.id, updateData);
    expect(dataUpdated.result).toBe('updated');
    expect(dataUpdated.data).toEqual(expect.objectContaining(updateData));
  });

  test('data can be deleted', async () => {
    const dataDeleted = await data.deleteById(newData.id);
    expect(dataDeleted.result).toBe('deleted');
  });

  test('no data in database', async () => {
    const dbdata = await data.findAll();
    expect(dbdata.length).toBe(0);
  });
});

describe('FileDB test', () => {
  const data = new DataModel('data', './data.json', false);
  // const idschema1 = util.getIDSchema();
  // const idschema2 = util.getIDSchema(7);
  let newData;
  test('bulk create return data should be right', async () => {
    const datalength = _.random(2, 10);
    newData = await data.bulkCreate(prepareDatas(datalength));
    expect(newData.length).toBe(datalength);
    newData.forEach((singleData) => {
      const { error } = dataSchema.validate(singleData);
      expect(error).toBeUndefined();
      expect(singleData.description).toBe('description');
    });
  });
});

describe('FileDB Error test', () => {
  const errorModel = new DataModelWOCreateSchema('data', './data.json', false);
  test('create schema undefined', async () => {
    try {
      await errorModel.create({});
    } catch (error) {
      expect(error).toBeInstanceOf(UserDefineError.SystemError);
      expect(error.message).toBe('create schema is not defined');
    }
  });

  test('update schema undefined', async () => {
    try {
      await errorModel.update('12345678', {});
    } catch (error) {
      expect(error).toBeInstanceOf(UserDefineError.SystemError);
      expect(error.message).toBe('update schema is not defined');
    }
  });
});
