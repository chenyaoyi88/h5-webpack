import * as IMG_success from '../../images/success.png';
import * as IMG_error from '../../images/error.png';

interface ModalConfig {
  // 状态码
  code?: string;
  // 是否显示动画
  isShowAnimate?: boolean;
  confirmCallback?: Function;
  openCallback?: Function;
  beforeOpenCallback?: Function;
  content?: string;
}

/**
 * 弹窗的公共配置
 * @param type 弹窗的类型
 */
const modalConfig = function(options?: ModalConfig) {
  let imgSrc = '';
  let text1 = '';
  let type = '';
  let content = options.content;
  let confirmCallback = options.confirmCallback;
  let openCallback = options.openCallback;
  let beforeOpenCallback = options.beforeOpenCallback;

  switch (options.code) {
    case 'success':
      type = 'success';
      imgSrc = IMG_success;
      text1 = '50元奖金即将通过广货宝公众号发送给您！';
      break;
    default:
      type = 'error';
      imgSrc = IMG_error;
      text1 = '网络繁忙，请稍后再试！';
  }
  return {
    modalClass: `act-other ${type}`,
    content: content? content : `
        <div class="modal-img-wrap">
            <img class="img" src="${imgSrc}" alt="">
        </div>
        <div class="modal-text">
            <p class="text">${text1}</p>
        </div>
        `,
    confirmText: '我知道了',
    isShowAnimate: options.isShowAnimate || true,
    confirmCallback: confirmCallback,
    openCallback: openCallback,
    beforeOpenCallback: beforeOpenCallback
  };
};

export { modalConfig };
