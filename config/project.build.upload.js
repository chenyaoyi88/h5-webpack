const Ftp = require('ftp');
const fs = require('fs');
const path = require('path');
const ftp = new Ftp();

// 要新建上传的项目文件夹
const projectFolder = 'project';

const config = {
  // ftp 帐号密码信息
  ftpMsg: {
    host: '***',
    user: '***',
    password: '***'
  },
  path: {
    // 本地打包出来的测试环境的项目路径（静态资源）
    localTestFolder: path.resolve(__dirname, '../test/'),
    // 要上传到测试环境的项目路径
    uploadTestFolder: '/pub/ghb-web/' + projectFolder
  }
};


console.log('查看目录', config.path.localTestFolder);
fs.readdir(config.path.localTestFolder, function(err, files) {
  if (err) {
    return console.error(err);
  }
  files.forEach(function(file) {
    console.log(file);
  });
});

// // 连接 ftp 成功
// ftp.on('ready', function() {
//   ftp.list(function(err, list) {
//     if (err) {
//       console.log('读取列表错误：', err);
//     }
//     console.dir(list);
//     ftp.end();
//   });

//   const path = '/pub/ghb-web/' + projectFolder;
//   console.log('要添加文件的路径:', path);
//   ftp.mkdir(path, true, function(err) {
//     if (err) {
//       console.log('新建文件夹错误：', err);
//     }
//     ftp.end();
//   });

//   ftp.end();
// });

// ftp.connect(config.ftpMsg);
