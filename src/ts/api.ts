const APP_ENV = process.env.NODE_ENV || 'production';

console.log('当前环境：' + APP_ENV);

let requestHost = '';

if (APP_ENV === 'development') {
  // 开发环境
  requestHost = '//127.0.0.1:4000';
} else {
  requestHost = '//' + window.location.host;
  console.log = console.dir = console.table =  function() {};
}

const api = {
  // 获取微信 js-sdk 参数
  wechatjs: requestHost + '/shop/common/wechat/jssdk_params',
  // 业务接口
  receiveRedpack: requestHost + '/api/v1/receiveRedpack'
};

export { api };
