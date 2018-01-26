import { ajax, api } from '../util';
import * as shareIMG from '../../images/share.jpg';

// 环境变量
const Env: string = process.env.NODE_ENV;

const weixin = {
  config: <WxConfig>{
    // 分享标题
    title: '分享标题',
    // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    link: `https://www.guanghuobao.com/${
      Env === 'production' ? '' : 'sit/'
    }api/v1/wechat/auth/receiveRedpack/request`,
    // 分享描述（分享描述不能过长，否则会影响分享图标分享给好友时无法正常显示）
    desc: '分享描述',
    // 分享图标
    imgUrl: 'https:' + shareIMG,
    // 分享类型,music、video或link，不填默认为link
    type: '',
    // 如果type是music或video，则要提供数据链接，默认为空
    dataUrl: ''
  },
  init: function() {
    // 非开发环境发送请求
    if (Env !== 'development') {
      // 请求拿微信 js-sdk 配置参数
      ajax({
        url: api.wechatjs,
        type: 'GET',
        data: {
          url: window.location.href
        },
        success: function(data: WxJsSdk) {
          wx.config({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: Env === 'production' || Env === 'test' ? false : true,
            // 必填，公众号的唯一标识
            appId: data.appId,
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
              // 分享到朋友圈
              'onMenuShareTimeline',
              // 分享给朋友
              'onMenuShareAppMessage'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });

          // config 配置成功
          wx.ready(function() {
            console.log('wx-ready config 配置成功');
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

            // 分享到朋朋友圈
            wx.onMenuShareTimeline({
              title: weixin.config.title,
              link: weixin.config.link,
              imgUrl: weixin.config.imgUrl,
              // 用户确认分享后执行的回调函数
              success: function() {},
              // 用户取消分享后执行的回调函数
              cancel: function() {}
            });

            // 分享给好友
            wx.onMenuShareAppMessage({
              title: weixin.config.title,
              link: weixin.config.link,
              desc: weixin.config.desc,
              imgUrl: weixin.config.imgUrl,
              // 分享类型,music、video或link，不填默认为link
              type: weixin.config.type,
              // 如果type是music或video，则要提供数据链接，默认为空
              dataUrl: weixin.config.dataUrl,
              // 用户确认分享后执行的回调函数
              success: function() {},
              // 用户取消分享后执行的回调函数
              cancel: function() {}
            });
          });

          // config 配置失败
          wx.error(function(err: any) {
            console.log('wx-config-error: ' + err);
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
        }
      });
    }
  }
};

export { weixin };
