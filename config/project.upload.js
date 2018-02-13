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
    localUploadDir = path.resolve(__dirname, PROJECT.PATH.TEST);;
    urlEnv = 'sit';
    ftpConfig = ftpConfig_Test;
    break;
  case 'production':
    localUploadDir = path.resolve(__dirname, PROJECT.PATH.PROD);;
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
let aUploadFiles = [];
// 上传成功的文件
let aUploadSuccessFiles = [];

log('上传的文件夹路径：' + chalk.green(localUploadDir));

// 计算文件个数
readDirLoop(localUploadDir, function (err, data) {
  aUploadFiles = data;

  ftp.on('ready', function () {
    console.log(chalk.green('ftp 连接成功'), '\n');
    // 延迟 1 秒连接 ftp，因为上面 readDirLoop 递归计算文件个数需要时间，而且不知道什么时候计算完
    setTimeout(function () {
      createProjectBaseDir(entireUploadPath).then(() => {
        console.log(`约 ${chalk.green(aUploadFiles.length)} 个文件需要上传`);
        log(chalk.green('开始上传文件...'));
        readUploadDir(localUploadDir, entireUploadPath);
      });
    }, 1000);
  });

  ftp.on('error', function (err) {
    log(chalk.red('ftp 连接失败'));
  });

  ftp.connect(ftpConfig_Test);
});

/**
 * 在 FTP 上创建本项目文件夹
 *
 * @param {any} basePath 要创建的本项目文件夹 FTP 位置
 * @returns
 */
function createProjectBaseDir(basePath) {
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

/**
 * 上传文件
 *
 * @param {any} uploadPath 本地文件路径
 * @param {any} remotePath 上传的文件的远程路径
 * @param {any} file 要上传的文件
 */
function uploadFile(uploadPath, remotePath, file) {
  const remoteFilePath = remotePath + '/' + file;
  ftp.put(path.join(uploadPath, file), remoteFilePath, function (err) {
    if (err) {
      console.log(file, chalk.red('上传文件失败：'), err);
      console.log(chalk.yellow('尝试重新上传：'), file);
      return uploadFile(uploadPath, remotePath, file);
    }
    console.log(remoteFilePath, chalk.green('上传成功'));
    aUploadSuccessFiles.push(remoteFilePath);
    console.log('已成功上传：' + chalk.green(aUploadSuccessFiles.length) + ' 个');
    if (aUploadSuccessFiles.length === aUploadFiles.length) {
      ftp.end();
      log(chalk.green('上传完成'));
      console.log('Access Url:', chalk.green(accessUrl));
      process.exit(0);
    }
  });
}

/**
 * 读取要上传的文件夹
 *
 * @param {any} uploadPath 本地文件路径
 * @param {any} remotePath 上传的文件的远程路径
 */
function readUploadDir(uploadPath, remotePath) {
  fs.readdir(uploadPath, function (err, files) {
    if (err) {
      console.log(chalk.red('读取文件夹错误：'), err);
      ftp.end();
      return;
    }
    files.forEach((file, index) => {
      let readLocalFile = path.join(uploadPath, file);
      fs.stat(readLocalFile, function (err, stat) {
        if (err) {
          console.log(chalk.red('检测文件夹错误：'), err);
          ftp.end();
          return;
        }
        if (stat.isFile()) {
          // 如果是文件，直接上传
          uploadFile(uploadPath, remotePath, file);
        } else if (stat.isDirectory()) {
          // 如果是文件夹，递归处理
          const nextLevelRemoteFilePath = remotePath + '/' + file;
          ftp.mkdir(nextLevelRemoteFilePath, true, function (err) {
            if (err) {
              console.log(chalk.red('创建项目目录失败：'), err);
              return;
            }
            readLocalFile = path.join(uploadPath, file);
            readUploadDir(readLocalFile, nextLevelRemoteFilePath);
          });
        } else {
          // 如果不是文件也不是文件夹，输出看看是什么玩意
          console.log('什么玩意：', stat);
        }
      });
    });
  });
}

/**
 * 递归计算文件个数
 *
 * @param {any} uploadPath
 * @param {any} callback
 */
function readDirLoop(uploadPath, callback) {
  let results = [];
  fs.readdir(uploadPath, function (err, files) {
    if (err) return callback(err);
    let pending = files.length;
    if (!pending) return callback(null, results);
    files.forEach(file => {
      file = path.join(uploadPath, file);
      // let readLocalFile = path.resolve(uploadPath, file);
      fs.stat(file, function (err, stat) {
        if (stat.isFile()) {
          results.push(file);
          if (!--pending) callback(null, results);
        } else if (stat.isDirectory()) {
          readDirLoop(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) callback(null, results);
          });
        } else {
          // 如果不是文件也不是文件夹，输出看看是什么玩意
          console.log('什么玩意：', stat);
        }
      });
    });
  });
}

function log(msg) {
  console.log(' ');
  console.log(msg);
  console.log(' ');
}