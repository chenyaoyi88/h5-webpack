declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare var wx: any;

interface Window {
}

interface ShowModal {
    // 要现实的文本
    content: string;
    // 是否展示动画
    isShowAnimate?: boolean;
    // 是否展示动画
    modalAnimate?: string;
    // modal 另外添加的样式名
    modalClass?: string;
    // modalWrap 另外添加的样式名
    modalWrapClass?: string;
    // textWrap 另外添加的样式名
    textWrapClass?: string;
    // contentWrap 另外添加的样式名
    contentWrapClass?: string;
    // 确定按钮文字
    confirmText?: string;
    // 确定按钮自定义
    confirmHtml?: string;
    // 确定按钮回调
    confirmCallback?: Function;
    // 关闭按钮回调
    closeCallback?: Function;
}

interface Ajax<T> {
    // 请求类型
    type: string;
    // 提交的 url 
    url: string;
    //  提交的数据对象
    data?: T;
    //  请求超时时间
    timeout?: number;
    //  需要设置的请求头
    headers?: any;
    //  请求成功回调
    success?: Function;
    //   请求失败回调
    error?: Function;
}


/**
 * 微信js-sdk所需参数
 * 
 * @interface WxJsSdk
 */
interface WxJsSdk {
    appId: string;
    nonceStr: string;
    noncestr: string;
    signature: string
    timestamp: string;
}

/**
 * 微信分享配置
 * 
 * @interface WxConfig
 */
interface WxConfig {
    // 分享标题
    title: string;
    // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    link: string;
    // 分享描述
    desc?: string;
    // 分享图标
    imgUrl?: string;
    // 分享类型,music、video或link，不填默认为link
    type?: string;
    // 如果type是music或video，则要提供数据链接，默认为空
    dataUrl?: string;
}