const { util } = require('./index');
const {
  httpClient,
} = util;

(async ()=> {
  const httpclient = util.httpClient({
    baseURL: 'https://digital.rbits.chance.co.jp/digitalapp-bff/digitalapp-bff',
    timeout: 10000,
  });
  const response = await httpclient.get('/api/v1/contactchange?deviceId=d123456');
  console.log(response);
})()
.catch(e => console.error(e));
