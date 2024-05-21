// import axios from 'axios';
const axios = require('axios')
const md5 = require('md5');
const utils = require('./utils');
// 向服务器获取 pow 配置
const getConfig = async (configApiUrl, axiosObj) => {
    try {
        let response;
        if (axiosObj == undefined || axiosObj == null) {
            response = await axios.get(configApiUrl);
        } else {
            response = await axiosObj.get(configApiUrl);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};
// 向服务器发送 pow 结果
const verify = async (powResult, verifyApiUrl, axiosObj) => {
    // console.log(' powResult 11 = ', powResult);
    let res;
    try {
        if (axiosObj == undefined || axiosObj == null) {
            res = await axios.post(verifyApiUrl, { data: powResult });
        } else{
            res = await axiosObj.post(verifyApiUrl, { data: powResult });
        }
        return res.data;
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

const startPoW = async (configApiUrl, verifyApiUrl, axiosObj=null) => {
    console.log('axiosObj = ', axiosObj);
    console.log('axios = ', axios);
    return new Promise(async (resolve, reject) => {
        // 请求 config
        const config = await getConfig(configApiUrl, axiosObj);
        console.log("get config -> ", config);
        // 求解难题
        const powResult = await solve(config.difficulty, config.prefix);
        console.log("powResult -> ", powResult);
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

module.exports = {
    startPoW
}
