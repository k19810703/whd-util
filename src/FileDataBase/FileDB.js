const Joi = require('@hapi/joi');
const moment = require('moment');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const _ = require('lodash');

const { log } = require('../log/log');
const { generateUKey } = require('../util/util');
const { BizError } = require('../Error/BizError');
const { SystemError } = require('../Error/SystemError');

const systemFields = ['id', 'createtimestamp', 'updatetimestamp'];

class FileDB {
  constructor(name, dbfilepath, init = false) {
    this.collectionname = name;
    const adapter = new FileSync(dbfilepath);
    log.debug(`init ${this.collectionname} with ${dbfilepath}`);
    this.db = low(adapter);
    const timestamp = Joi.date().timestamp('unix');
    this.defaultSchema = {
      id: Joi.string().alphanum().length(8).required(),
      createtimestamp: timestamp,
      updatetimestamp: timestamp,
    };
    if (init) {
      const initData = {};
      initData[name] = [];
      this.db.setState({ data: initData[name] })
        .write();
    }
  }

  static layOutCheck(schema, data, type) {
    if (!schema) throw new SystemError(`${type} schema is not defined`);
    const { error } = schema.validate(_.omit(data, systemFields));
    if (error) throw error;
    return true;
  }

  async createLayOutCheck(createData) {
    return FileDB.layOutCheck(this.createSchema, createData, 'create');
  }

  async updateLayOutCheck(updateData) {
    return FileDB.layOutCheck(this.updateSchema, updateData, 'update');
  }

  createDataProcess(newdata) {
    log.debug(`${this.collectionname} createDataProcess in base ${JSON.stringify(newdata)}`);
    const formatData = {
      ...newdata,
      id: generateUKey(),
      createtimestamp: moment().unix(),
      updatetimestamp: moment().unix(),
    };
    return Promise.resolve(formatData);
  }

  async updateDataProcess(id, newData) {
    const existData = await this.findById(id);
    if (!existData) throw new BizError(`data id=${id} can not be found in ${this.collectionname}`);
    const formatData = {
      ...newData,
      id,
      createtimestamp: existData.createtimestamp,
      updatetimestamp: moment().unix(),
    };
    return Promise.resolve(formatData);
  }

  async validateId(id) {
    const { error } = this.defaultSchema.id.validate(id);
    if (error) throw new BizError(`id(${id}) is not a valid id`);
    return true;
  }

  async bulkCreate(newDatas) {
    await Promise.all(newDatas.map(newData => this.createLayOutCheck(newData)));
    const newFormatedDatas = await Promise.all(
      newDatas.map(newData => this.createDataProcess(newData)),
    );
    log.debug(`insert ${this.collectionname}: ${JSON.stringify(newFormatedDatas)}`);
    this.db
      .get(this.collectionname)
      .push(...newFormatedDatas)
      .write();
    return newFormatedDatas;
  }


  async create(newdata) {
    log.debug(`create ${this.collectionname} ${JSON.stringify(newdata)}`);
    await this.createLayOutCheck(newdata);
    const istdata = await this.createDataProcess(newdata);
    log.debug(`insert ${this.collectionname}: ${JSON.stringify(istdata)}`);
    this.db
      .get(this.collectionname)
      .push(istdata)
      .write();
    return istdata;
  }

  async update(id, data) {
    log.debug(`update(base) ${this.collectionname} for id ${id} => ${JSON.stringify(data)}`);
    await Promise.all(
      [
        this.validateId(id),
        this.updateLayOutCheck(data),
      ],
    );
    const upddata = await this.updateDataProcess(id, data);
    log.debug(`updatedata => ${JSON.stringify(upddata)}`);
    this.db.get(this.collectionname)
      .find({ id })
      .assign(upddata)
      .write();
    return Promise.resolve({
      result: 'updated',
      data: upddata,
    });
  }

  async deleteById(id) {
    await this.validateId(id);
    const searchresult = await this.findById(id);
    this.db.get(this.collectionname)
      .remove({ id })
      .write();
    return Promise.resolve({
      result: 'deleted',
      type: this.collectionname,
      data: searchresult,
    });
  }

  async findAll() {
    return Promise.resolve(this.db.get(this.collectionname).value());
  }

  async findByCondition(condition) {
    log.debug(`findByCondition(base) find in ${this.collectionname} for ${JSON.stringify(condition)} `);
    const searchresult = this.db.get(this.collectionname).filter(condition).value();
    log.debug(`found ${JSON.stringify(searchresult)}`);
    return Promise.resolve(searchresult);
  }

  async findById(id) {
    log.debug(`findById(base) find ${id} ${this.collectionname}`);
    await this.validateId(id);
    const searchresult = this.db.get(this.collectionname).filter({ id }).head().value();
    return Promise.resolve(searchresult);
  }
}

module.exports.FileDB = FileDB;
