const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Client = require('ftp');
const ftp = new Client();
const ftpConfig = require('../config.ftp.json');
const ENV = process.env.NODE_ENV;

const appName = '/' + require('../config.json').appName;

// 远程基本路径
// const remoteBasePath = './pub/ghb-web';
// const remoteBasePath = './public_html';
// 目录结构
// const remotePathLevel = '/act2/2018';
// 完整的上传目录
let entireBasePath = './pub/ghb-web/act2/2018/01' + appName;

// 目录（文件夹）
const dir = {
  // 本地要读取的目录（文件夹）
  read: {
    test: path.resolve(__dirname, '../test'),
    prod: path.resolve(__dirname, '../prod')
  }
};

// 根据当前环境读取打包出来的测试（test） 还是生产（prod）的目录
const curEnvDir = ENV === 'production' ? dir.read.prod : dir.read.test;
// 所有的文件个数
let aFiles = [];
// 上传成功的文件
let aUploadSuccess = [];
// 上传失败的文件
let aUploadFailed = [];

log(chalk.yellow('当前环境路径：') + chalk.green(curEnvDir));

readDirLoop(curEnvDir, function(err, data) {
  aFiles = data;
});

setTimeout(function() {
  console.log(`约 ${aFiles.length} 个文件要上传`);

  ftp.on('ready', function() {
    log(chalk.green('ftp 连接成功'));
    createProjectBaseDir(entireBasePath).then(() => {
      log(chalk.green('开始上传文件...'));
      readUploadDir(curEnvDir, entireBasePath);
    });
  });

  ftp.on('error', function(err) {
    log(chalk.red('ftp 连接失败'));
  });

  ftp.connect(ftpConfig);
}, 1000);

/**
 * 创建项目根目录
 *
 * @param {any} basePath 项目根目录
 * @returns
 */
function createProjectBaseDir(basePath) {
  return new Promise((resolve, reject) => {
    ftp.mkdir(basePath, true, function(err) {
      if (err) {
        console.log(chalk.red('创建项目根目录失败：'), err);
        reject(err);
        ftp.end();
        return;
      }
      log(chalk.yellow('创建项目根目录成功：') + chalk.green(basePath));
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
  ftp.put(path.join(uploadPath, file), remoteFilePath, function(err) {
    if (err) {
      console.log(file, chalk.red('上传文件失败：'), err);
      console.log(chalk.yellow('尝试重新上传：'), file);
      return uploadFile(uploadPath, remotePath, file);
    }
    console.log(file, chalk.green('上传文件成功：'));
    aUploadSuccess.push(remoteFilePath);
    console.log('已成功上传：' + chalk.green(aUploadSuccess.length) + '个');
    if (aUploadSuccess.length === aFiles.length) {
      ftp.end();
      log(chalk.green('上传完成'));
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
  fs.readdir(uploadPath, function(err, files) {
    if (err) {
      console.log(chalk.red('读取文件夹错误：'), err);
      ftp.end();
      return;
    }
    files.forEach((file, index) => {
      let readLocalFile = path.join(uploadPath, file);
      fs.stat(readLocalFile, function(err, stat) {
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
          ftp.mkdir(nextLevelRemoteFilePath, true, function(err) {
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

function readDirLoop(uploadPath, callback) {
  let results = [];
  fs.readdir(uploadPath, function(err, files) {
    if (err) return callback(err);
    let pending = files.length;
    if (!pending) return callback(null, results);
    files.forEach(file => {
      file = path.join(uploadPath, file);
      // let readLocalFile = path.resolve(uploadPath, file);
      fs.stat(file, function(err, stat) {
        if (stat.isFile()) {
          results.push(file);
          if (!--pending) callback(null, results);
        } else if (stat.isDirectory()) {
          readDirLoop(file, function(err, res) {
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
