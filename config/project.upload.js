// https://www.npmjs.com/package/ftp-client
const ftpClient = require('ftp-client');
const colors = require('colors');
const PROJECT = require('./project.config');
const ftp = new ftpClient(PROJECT.FTP);
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
  ftp.upload(uploadDir + '/**', `${PROJECT.PATH.REMOTE}/${PROJECT.NAME}`, {
    baseDir: uploadDir,
    // 不区分新的旧的，每次都全部覆盖（有bug，覆盖文件夹会报错）
    overwrite: 'all'
  }, function (result) {
    console.log(result);
  });
});
