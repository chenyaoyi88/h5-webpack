// https://www.npmjs.com/package/ftp-client
const ftpClient = require('ftp-client');
const colors = require('colors');
const PROJECT = require('./project.config');
/**
 * config.ftp.json 这个文件自己本地创建，格式如下
{
  "host": "你的 ftp host",
  "user": "ftp 用户名",
  "password": "ftp 密码"
}
 */
const ftpConfig = require('../config.ftp.json');
const appConfig = require('../config.json');
const ftp = new ftpClient(ftpConfig);
const ENV = process.env.NODE_ENV;

// 要上传的文件夹名字（相对于根目录）
let uploadDir = '';
if (ENV === 'production') {
  uploadDir = 'prod';
} else {
  uploadDir = 'test';
}

console.log(`当前上传环境：${ENV}`.green);

ftp.connect(function () {
  console.log('连接 ftp 成功');
  ftp.upload(uploadDir + '/**', `${PROJECT.PATH.REMOTE}/${appConfig.appName}`, {
    baseDir: uploadDir,
    // 不区分新的旧的，每次都全部覆盖（有bug，覆盖文件夹会报错）
    overwrite: 'all'
  }, function (result) {
    console.log(result);
  });
});