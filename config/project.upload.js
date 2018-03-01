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
const uploadBasePath = './pub/ghb-web/act';
// 远程层级路径，如：/2018/08/appName
const uploadPathLevel = `/${configInfo.onlineYear}/${configInfo.onlineMonth}/${configInfo.appName}`;
// 完整的上传目录，下面例子是上传到 ftp 的 ./pub/ghb-web/act/2018/08/appName 文件夹下
const entireUploadPath = uploadBasePath + uploadPathLevel;
// 文件访问基本路径
const fileAccessBasePath = `https://${urlEnv}.guanghuobao.com/ghb-web/act${uploadPathLevel}`;
// 访问链接
const accessUrl = `${fileAccessBasePath}/index.html`;

log('上传的文件夹路径：' + chalk.green(localUploadDir));

// 这里只是递归计算要上传文件的总数
readDirFile({
  localDirPath: localUploadDir,
  success: function (err, aUploadFiles) {
    ftp.on('ready', function () {
      console.log(chalk.green('ftp 连接成功'), '\n');
      createBaseDir(entireUploadPath).then(() => {
        console.log(`共有 ${chalk.green(aUploadFiles.length)} 个文件需要上传`);
        log(chalk.green('开始上传文件...'));
        // 这里是递归上传所有文件
        readDirFile({
          localDirPath: localUploadDir,
          uploadDirPath: entireUploadPath,
          uploadFilesLength: aUploadFiles.length,
          isUpload: true,
          accessUrl: accessUrl,
          fileAccessBasePath: fileAccessBasePath,
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
  options.accessUrl = opts.accessUrl || '';
  options.fileAccessBasePath = opts.fileAccessBasePath || '';

  let fileList = [];
  let aUploadSuccessFile = [];
  let aUploadSuccessFileUrl = [];

  readDirRecur(options);

  /**
   * 递归读取文件
   * 
   * @param {any} options 
   */
  function readDirRecur(options) {
    fs.readdir(options.localDirPath, function (err, files) {

      if (err) return options.success(err, []);

      let count = 0
      const checkEnd = function () {
        ++count == files.length && options.success({}, fileList);
      }

      files.forEach(function (file) {
        const fullPath = options.localDirPath + '/' + file;
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
                return readDirRecur({
                  localDirPath: fullPath,
                  uploadDirPath: nextLevelDirPath,
                  success: options.success,
                  isUpload: options.isUpload
                });
              });
            } else {
              return readDirRecur({
                localDirPath: fullPath,
                success: checkEnd
              });
            }
          } else {
            if (options.isUpload) {
              // 如果是文件，直接上传
              uploadFile(options.localDirPath, options.uploadDirPath, file);
            } else {
              fileList.push(fullPath);
              checkEnd();
            }
          }
        });
      });

      files.length === 0 && options.success({}, fileList);
    })
  }

  /**
   * 文件上传
   * 
   * @param {any} localDirPath 本地文件路径
   * @param {any} uploadDirPath 上传文件路径
   * @param {any} file 文件
   */
  function uploadFile(localDirPath, uploadDirPath, file) {
    const remoteFilePath = uploadDirPath + '/' + file;
    const remoteAccessPath = options.fileAccessBasePath + remoteFilePath.split(options.uploadDirPath)[1];
    ftp.put(path.join(localDirPath, file), remoteFilePath, function (err) {
      if (err) {
        console.log(file, chalk.red('上传文件失败：'), err);
        console.log(chalk.yellow('尝试重新上传：'), file);
        return uploadFile(localDirPath, uploadDirPath, file);
      }
      aUploadSuccessFile.push(remoteFilePath);
      aUploadSuccessFileUrl.push(remoteAccessPath);

      console.log(file, chalk.green('上传成功'));
      console.log('文件位置：' + chalk.cyanBright(remoteFilePath));
      console.log('访问路径：' + chalk.green(remoteAccessPath));
      console.log('已成功上传：' + chalk.green(aUploadSuccessFile.length) + ' 个\n');

      if (aUploadSuccessFile.length === options.uploadFilesLength) {
        ftp.end();
        log(chalk.green('上传完成'));
        console.log('Access Url:', chalk.green(options.accessUrl), '\n');
        options.success && options.success({}, aUploadSuccessFileUrl);
        process.exit(0);
      }
    });
  }

}