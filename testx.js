const Joi = require('@hapi/joi');

const { FileDB } = require('./index');

class DataModel extends FileDB {
  constructor(name, dbfilepath) {
    super(name, dbfilepath);
    const description = Joi.string().required();
    this.createSchema = Joi.object().keys({
      id: Joi.string().empty(''),
      createtimestamp: Joi.number().empty(''),
      updatetimestamp: Joi.number().empty(''),
      description,
    });
    this.updateSchema = this.createSchema;
  }
}

const datamodel = new DataModel('data', './data.json');