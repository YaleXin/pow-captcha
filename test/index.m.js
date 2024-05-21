const startPoWSimple = require("../lib/pow-captcha");
const axios = require('axios')

describe('pow-captcha-no-axios', () => {
    //   let captcha;

    before(() => {

    });

    it('start', (done) => {
        const [api1, api2] = ['http://localhost:8080/api/admin/powConfig', 'http://localhost:8080/api/admin/powVerify'];

        // console.log(startPoWSimple);
        startPoWSimple.startPoW(api1, api2).then(res => {
            done(res);
        }).catch(e => {
            done(e)
        }
        )
    });
});

describe('pow-captcha-with-axios', () => {

    before(() => {

    });

    it('start', (done) => {
        const [api1, api2] = ['powConfig', 'powVerify'];
        axios.defaults.withCredentials = true

        const instance = axios.create({
            baseURL: 'http://localhost:8080/api/admin/',
            timeout: 5000,
            withCredentials: true,
          });
        // console.log(startPoWSimple);
        startPoWSimple.startPoW(api1, api2, instance).then(res => {
            done(res);
        }).catch(e => {
            done(e)
        }
        )
    });
});
