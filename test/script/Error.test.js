/* eslint-env jest */

const { UserDefineError } = require('../../index');

const {
  BizError,
  SystemError,
} = UserDefineError;

const dummyData = {
  dummyData: 'dummyData',
};

test('BizError => message only', async () => {
  try {
    throw new BizError('biz error');
  } catch (error) {
    expect(error).toBeInstanceOf(BizError);
    expect(error.statusCode).toBe(400);
    expect(error.data).toEqual(expect.objectContaining({}));
  }
});

test('BizError => message and code', async () => {
  try {
    throw new BizError('biz error', 401);
  } catch (error) {
    expect(error).toBeInstanceOf(BizError);
    expect(error.statusCode).toBe(401);
    expect(error.data).toEqual(expect.objectContaining({}));
  }
});

test('BizError => message, code and data', async () => {
  try {
    throw new BizError('biz error', 402, dummyData);
  } catch (error) {
    expect(error).toBeInstanceOf(BizError);
    expect(error.statusCode).toBe(402);
    expect(error.data).toEqual(expect.objectContaining(dummyData));
  }
});

test('SystemError => message only', async () => {
  try {
    throw new SystemError('sys error');
  } catch (error) {
    expect(error).toBeInstanceOf(SystemError);
    expect(error.statusCode).toBe(500);
    expect(error.data).toEqual(expect.objectContaining({}));
  }
});

test('SystemError => message and code', async () => {
  try {
    throw new SystemError('biz error', 501);
  } catch (error) {
    expect(error).toBeInstanceOf(SystemError);
    expect(error.statusCode).toBe(501);
    expect(error.data).toEqual(expect.objectContaining({}));
  }
});

test('SystemError => message, code and data', async () => {
  try {
    throw new SystemError('SystemError error', 502, dummyData);
  } catch (error) {
    expect(error).toBeInstanceOf(SystemError);
    expect(error.statusCode).toBe(502);
    expect(error.data).toEqual(expect.objectContaining(dummyData));
  }
});
