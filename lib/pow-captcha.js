// import axios from 'axios';
const axios = require('axios')
const md5 = require('md5');
const utils = require('./utils');
// 向服务器获取 pow 配置
const getConfig = async (configApiUrl, axiosObj) => {
    try {
        if (axiosObj == undefined || axiosObj == null) {
            const response = await axios.get(configApiUrl);
            return response;
        } else {
            // 用户自己的 axios 可能自己做了拆箱，因此直接返回即可
            const response = await axiosObj.get(configApiUrl);
            return response;
        }

    } catch (error) {
        throw error;
    }
};
// 向服务器发送 pow 结果
const verify = async (powResult, verifyApiUrl, axiosObj) => {
    // console.log(' powResult 11 = ', powResult);
    try {
        if (axiosObj == undefined || axiosObj == null) {
            const res = await axios.post(verifyApiUrl, { data: powResult });
            return res;
        } else {
            // 用户自己的 axios 可能自己做了拆箱，因此直接返回即可
            const res = await axiosObj.post(verifyApiUrl, { data: powResult });
            return res;
        }
    } catch (e) {
        throw e;
    }
};





const solve = (difficulty, prefix) => {
    console.log("difficulty = ", difficulty, "prefix = ", prefix);
    let paddingNum = 0;
    let aa = 0;
    while (true) {
        const md5Str = md5(prefix + paddingNum.toString())
        // console.log(md5Str);
        if (utils.checkPaddingNum(md5Str, difficulty)) {
            // console.log('md5 = ', md5Str, 'paddingNum = ', paddingNum);
            break;
        }
        paddingNum += 1
        aa += 1
    }
    console.log('solve!');
    return {
        md5Str: md5(prefix + paddingNum.toString()),
        paddingNum: paddingNum
    }
};

/**
 * 使用本模块内部的axios发请求
 * @param {*} configApiUrl 
 * @param {*} verifyApiUrl 
 * @returns { verify: true, totalTryCnt: powResult.paddingNum }
 */
const startPoW = async (configApiUrl, verifyApiUrl) => {

    return new Promise(async (resolve, reject) => {
        let axiosInstance = getAxiosInstance();
        // 设置默认配置
        axios.defaults.withCredentials = true;
        // 请求 config
        const config = await getConfig(configApiUrl, axiosInstance);
        console.log("get config -> ", config);
        // 求解难题
        const powResult = await solve(config.difficulty, config.prefix);
        console.log("powResult -> ", powResult);
        // 提交到后台验证
        const verifyResult = await verify(powResult, verifyApiUrl, axiosInstance);
        // 如果后端认可
        if (verifyResult.verify) {
            resolve({ verify: true, totalTryCnt: powResult.paddingNum });
        } else {
            reject('pow result not correct!');
        }
    })
}
const getPoWWithAxios = (configApiUrl, axiosObj) => {
    return new Promise(async (resolve, reject) => {
        // 请求 config
        // 返回的是一个对象 {difficulty: 5, prefix: xxxxxx}
        const config = await getConfig(configApiUrl, axiosObj);
        return resolve(config);
    })
};
const tryPoWWithAxios = (verifyApiUrl, config, axiosObj) => {
    return new Promise(async (resolve, reject) => {
        // 求解难题
        const powResult = await solve(config.difficulty, config.prefix);
        // 提交到后台验证
        const verifyResult = await verify(powResult, verifyApiUrl, axiosObj);
        // 如果后端认可
        if (verifyResult.verify) {
            resolve({ verify: true, totalTryCnt: powResult.paddingNum });
        } else {
            reject('pow result not correct!');
        }
    })
}

const getAxiosInstance = () => {
    const instance = axios.create({
        withCredentials: true
    });
    // 用于存储 cookie 的变量
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
        return response.data;
    }, function (error) {
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            cookies = setCookieHeader.join('; ');
        }
        return Promise.reject(error);
    });
    return instance;
}

module.exports = {
    startPoW,
    getPoWWithAxios,
    tryPoWWithAxios
}
