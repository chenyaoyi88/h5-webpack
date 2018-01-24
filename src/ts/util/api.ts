const APP_ENV = process.env.NODE_ENV || 'production';
// 非生产环境，将 index.html 导进来，从而达到修改 html 文件的时候触发 reload
if (APP_ENV !== 'production') {
  require('../../index.html');
} else {
  console.log = function() {};
  console.dir = function() {};
}
console.log('当前环境：' + APP_ENV);

let requestHost = '//';

if (APP_ENV === 'development') {
  // 开发环境
  requestHost = '//127.0.0.1:4000';
}

// switch (APP_ENV) {
//   case 'development':
//     // 开发环境
//     requestHost = '//127.0.0.1:4000';
//     break;
//   case 'test':
//     // 测试环境
//     requestHost = '//sit.guanghuobao.com';
//     break;
//   case 'production':
//     // 正式/生产
//     requestHost = '//www.guanghuobao.com';
//     break;
// }

const api = {
  // 获取微信 js-sdk 参数
  wechatjs: requestHost + '/shop/common/wechat/jssdk_params',
  // 业务接口
  receiveRedpack: requestHost + '/api/v1/receiveRedpack'
};

export { api };
