const { log } = require('./index');

(async ()=> {
  log.info('123');
  log.info({ a: '123' });
})()
.catch(e => console.error(e));
