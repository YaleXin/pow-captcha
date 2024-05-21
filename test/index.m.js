const Captcha = require("../lib/pow-captcha");
const axios = require('axios')

describe('pow-captcha-no-axios', () => {
    //   let captcha;

    before(() => {

    });

    it('start', (done) => {
        const [api1, api2] = ['http://localhost:8080/api/admin/powConfig', 'http://localhost:8080/api/admin/powVerify'];

        // console.log(Captcha);
        Captcha.startPoW(api1, api2).then(res => {
            console.log('res = ', res);
            done();
        }).catch(e => {
            done(e)
        }
        )
    }).timeout(10000);
});






describe('pow-captcha-with-axios', () => {

    before(() => {

    });

    it('start', (done) => {
        const [CONFIG_API, VERIFY_API] = ['powConfig', 'powVerify'];
        let instance = axios.create({
            baseURL: 'http://localhost:8080/api/admin/',
            timeout: 5000,
            withCredentials: true,
        });
        let cookies = '';
        // 添加请求拦截器
        instance.interceptors.request.use(config => {
            if (cookies) {
                config.headers['Cookie'] = cookies;
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });
        // 添加响应拦截器
        instance.interceptors.response.use(function (response) {
            const setCookieHeader = response.headers['set-cookie'];
            if (setCookieHeader) {
                cookies = setCookieHeader.join('; ');
            }
            // 2xx 范围内的状态码都会触发该函数。
            // 对响应数据做点什么
            return response.data;
        }, function (error) {
            const setCookieHeader = response.headers['set-cookie'];
            if (setCookieHeader) {
                cookies = setCookieHeader.join('; ');
            }
            // 超出 2xx 范围的状态码都会触发该函数。
            // 对响应错误做点什么
            return Promise.reject(error);
        });
        // console.log(Captcha);
        Captcha.getPoWWithAxios(CONFIG_API, instance).then(config => {
            console.log('config = ', config);
            Captcha.tryPoWWithAxios(VERIFY_API, config, instance).then(verifyResult => {
                console.log('verifyResult = ', verifyResult);
                done();
            }).catch(e => {
                done(e);
            })
        }).catch(e => {
            done(e);
        }
        )
    }).timeout(10000);
});

