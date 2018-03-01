const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Client = require('ftp');
const ftp = new Client();
// const ftpConfig_Prod = require('../config.ftp.prod.json');
const ftpConfig_Test = require('../config.ftp.test.json');
/**
 * config.ftp.*.json 的格式
 * 
 * {
 *   "host": "主机",
 *   "user": "用户名",
 *   "password": "密码"
 * }
 */
const PROJECT = require('./project.config');
const configInfo = require('../config.info.json');
// 本地要上传的目录（文件夹）
let localUploadDir = '';
// 环境切换
let urlEnv = '';
// ftp 配置
let ftpConfig = {};

switch (process.env.NODE_ENV) {
  case 'test':
    localUploadDir = path.resolve(__dirname, PROJECT.PATH.TEST);
    urlEnv = 'sit';
    ftpConfig = ftpConfig_Test;
    break;
  case 'production':
    localUploadDir = path.resolve(__dirname, PROJECT.PATH.PROD);
    urlEnv = 'www';
    // ftpConfig = ftpConfig_Prod;
    break;
}
// 远程基本路径
const remoteBasePath = './pub/ghb-web/act';
// 远程层级路径，如：/2018/08/appName
const remotePathLevel = `/${configInfo.onlineYear}/${configInfo.onlineMonth}/${configInfo.appName}`;
// 完整的上传目录，下面例子是上传到 ftp 的 ./pub/ghb-web/act/2018/08/appName 文件夹下
const entireUploadPath = remoteBasePath + remotePathLevel;
// 访问链接
const accessUrl = `https://${urlEnv}.guanghuobao.com/ghb-web/act${remotePathLevel}/index.html`;
// 所有的文件个数

log('上传的文件夹路径：' + chalk.green(localUploadDir));

readDirFile({
  localDirPath: localUploadDir,
  success: function (err, aUploadFiles) {
    ftp.on('ready', function () {
      console.log(chalk.green('ftp 连接成功'), '\n');
      createBaseDir(entireUploadPath).then(() => {
        console.log(`共有 ${chalk.green(aUploadFiles.length)} 个文件需要上传`);
        log(chalk.green('开始上传文件...'));
        readDirFile({
          localDirPath: localUploadDir,
          uploadDirPath: entireUploadPath,
          uploadFilesLength: aUploadFiles.length,
          isUpload: true,
          success: function (err, data) {
            console.log(data);
          }
        });
      });
    });

    ftp.on('error', function (err) {
      log(chalk.red('ftp 连接失败'));
    });

    ftp.connect(ftpConfig_Test);
  }
});

/**
 * 在 FTP 上创建本项目文件夹
 *
 * @param {any} basePath 要创建的本项目文件夹 FTP 位置
 * @returns
 */
function createBaseDir(basePath) {
  return new Promise((resolve, reject) => {
    ftp.mkdir(basePath, true, function (err) {
      if (err) {
        console.log(chalk.red('在 FTP 上创建本项目文件夹失败：\n'), err);
        reject(err);
        ftp.end();
        return;
      }
      console.log('在 FTP 上创建本项目文件夹成功：' + chalk.green(basePath), '\n');
      resolve();
    });
  });
}

function log(msg) {
  console.log(' ');
  console.log(msg);
  console.log(' ');
}

function readDirFile(opts) {
  const options = opts || {};
  options.localDirPath = opts.localDirPath || '';
  options.uploadDirPath = opts.uploadDirPath || '';
  options.uploadFilesLength = opts.uploadFilesLength || 0;
  options.isUpload = opts.isUpload || false;

  let fileList = [];
  let aUploadSuccessFile = [];

  function readDirRecur(localDirPath, callback, uploadDirPath) {
    fs.readdir(localDirPath, function (err, files) {

      if (err) return callback(err, []);

      let count = 0
      const checkEnd = function () {
        ++count == files.length && callback({}, fileList);
      }

      files.forEach(function (file) {
        const fullPath = localDirPath + '/' + file;
        fs.stat(fullPath, function (err, stats) {
          if (stats.isDirectory()) {
            if (options.isUpload) {
              // 如果是文件夹，递归处理
              const nextLevelDirPath = options.uploadDirPath + '/' + file;
              ftp.mkdir(nextLevelDirPath, true, function (err) {
                if (err) {
                  console.log(chalk.red('创建项目目录失败：'), err);
                  return;
                }
                return readDirRecur(fullPath, checkEnd, nextLevelDirPath);
              });
            } else {
              return readDirRecur(fullPath, checkEnd);
            }
          } else {
            if (options.isUpload) {
              // 如果是文件，直接上传
              uploadFile(localDirPath, uploadDirPath, file);
            } else {
              fileList.push(fullPath);
              checkEnd();
            }
          }
        });
      });

      files.length === 0 && callback({}, fileList);
    })
  }

  function uploadFile(localDirPath, uploadDirPath, file) {
    const remoteFilePath = uploadDirPath + '/' + file;
    ftp.put(path.join(localDirPath, file), remoteFilePath, function (err) {
      if (err) {
        console.log(file, chalk.red('上传文件失败：'), err);
        console.log(chalk.yellow('尝试重新上传：'), file);
        return uploadFile(localDirPath, uploadDirPath, file);
      }
      console.log(remoteFilePath, chalk.green('上传成功'));
      aUploadSuccessFile.push(remoteFilePath);
      console.log('已成功上传：' + chalk.green(aUploadSuccessFile.length) + ' 个');
      if (aUploadSuccessFile.length === options.uploadFilesLength) {
        ftp.end();
        log(chalk.green('上传完成'));
        console.log('Access Url:', chalk.green(accessUrl));
        process.exit(0);
      }
    });
  }


  readDirRecur(options.localDirPath, options.success, options.uploadDirPath);
}