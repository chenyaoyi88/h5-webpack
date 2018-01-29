const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Client = require('ftp');
const ftp = new Client();
const ftpConfig = require('../config.ftp.json');
const ENV = process.env.NODE_ENV;

const appName = '/test-upload';

// 远程基本路径
const remoteBasePath = './pub/ghb-web';
// 目录结构
const remotePathLevel = '/act2/2018/02';
// 完整的上传目录
let entireBasePath = remoteBasePath + remotePathLevel + appName;

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

ftp.on('ready', function() {
  // createProjectBaseDir()
  //   .then(() => {
  //     return getUploadFiles();
  //   })
  //   .then(files => {
  //     checkFiles(files);
  //   })
  //   .catch(err => {});

  console.log(path.resolve(curEnvDir, 'index.html'));
  console.log(remoteBasePath + '/index.html');

  ftp.put(path.resolve(curEnvDir, 'index.html'), remoteBasePath + '/index.html', function(err) {
    if (err) {
      console.log(chalk.red('创建项目目录失败：'), err);
      ftp.end();
      return;
    }
    console.log('创建项目目录成功');
    ftp.end();
  });

});

ftp.connect(ftpConfig);

function createProjectBaseDir() {
  return new Promise((resolve, reject) => {
    ftp.mkdir(entireBasePath, true, function(err) {
      if (err) {
        console.log(chalk.red('创建项目目录失败：'), err);
        reject(err);
        return;
      }
      console.log('创建项目目录成功');
      resolve();
    });
  });
}

/**
 * 读取本地要上传的文件夹
 *
 * @returns
 */
function getUploadFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir(dir.read.test, function(err, files) {
      if (err) {
        console.log(chalk.red('读取文件夹错误：'), err);
        reject(err);
        return;
      }
      console.log(chalk.green('读取文件夹成功'));
      resolve(files);
    });
  });
}

/**
 * 检测是文件还是文件夹
 *
 * @param {any} files 文件列表
 * @returns
 */
function checkFiles(files) {
  // return new Promise((resolve, reject) => {
  let count = 0;
  const filesLength = files.length;
  files.forEach((file, index) => {
    const readLocalFile = path.join(curEnvDir, file);
    fs.stat(readLocalFile, function(err, stat) {
      if (err) {
        console.log(chalk.red('检测文件夹错误：'), err);
        return;
      }
      if (stat.isFile()) {
        // 如果是文件，直接上传
        count++;
        uploadFile(curEnvDir, entireBasePath, file);
      } else if (stat.isDirectory()) {
        // 如果是文件夹，递归处理
        count++;
        console.log('目录名：', file);
        
        ftp.mkdir(entireBasePath + '/' + file, true, function(err) {
          if (err) {
            console.log(chalk.red('创建项目目录失败：'), err);
            return;
          }
          console.log('创建项目目录成功');
        });

      } else {
        // 如果不是文件也不是文件夹，输出看看是什么玩意
        console.log('什么玩意：', stat);
      }
    });
  });
  // });
}

function uploadFile(localPath, targetPath, file) {
  console.log('a: ', path.join(localPath, file));
  console.log('b: ', targetPath + '/' + file);
  ftp.put(path.join(localPath, file), targetPath + '/' + file, function(err) {
    if (err) {
      console.log(chalk.red('上传文件失败：'), err);
      return;
    }
    console.log(chalk.green('上传文件成功：'), file);
  });
}
