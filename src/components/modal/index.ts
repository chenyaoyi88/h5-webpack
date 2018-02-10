import './modal.scss';

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

const modal = {
  show: function (options?: ShowModal) {
    // 防止重复生成
    if (document.getElementById('modal')) {
      return;
    }

    const ModalId = 'modal-' + new Date().getTime();
    const oBody = document.body;

    // 判断字符串里有没有标签
    let sContentHtml = '';
    if (/<[^>]+>/g.test(options.content)) {
      sContentHtml = options.content;
    } else {
      sContentHtml = `
              <div class="modal-text">
                  <p class="text">${options.content}</p>
              </div>
              `;
    }

    // 判断字符串里有没有标签
    let sBtnWrapHtml = '';
    if (/<[^>]+>/g.test(options.confirmHtml)) {
      sBtnWrapHtml = `
      <div data-id="modal-close-btn" id="modal-confirm">${
        options.confirmHtml
        }</div>
      `;
    } else {
      sBtnWrapHtml = `
      <button data-id="modal-close-btn" id="modal-confirm" class="modal-btn">${options.confirmText ||
        '知道了'}</button>
              `;
    }

    oBody.insertAdjacentHTML(
      'beforeend',
      `<div class="modal ${
      options.isShowAnimate ? 'modal-animate' : ''
      } ${options.modalClass || ''}" id="${ModalId}">
            <div class="modal-wrap ${options.modalWrapClass || ''}">
                <div class="modal-content ${options.contentWrapClass || ''}">

                    <div data-id="modal-text-wrap" class="modal-text-wrap modal-normal ${options.textWrapClass ||
      ''}">
                        ${sContentHtml}
                    </div>
                    <div data-id="modal-btn-wrap" class="modal-btn-wrap">
                        ${sBtnWrapHtml}
                    </div>

                </div>
            </div>
            <div class="modal-bg"></div>
        </div>
        `
    );

    const oModal = document.getElementById(ModalId) as HTMLDivElement;
    const oModalContentWrap = oModal.querySelector('[data-id=modal-text-wrap]');
    const oModalBtnWrap = oModal.querySelector('[data-id=modal-btn-wrap]');
    const aModalCloseBtn = oModal.querySelectorAll('[data-id=modal-close-btn]');
    let curPos: any = '';

    const removeModal = function (event: any): void {
      event.preventDefault();
      const oTarget = event.srcElement;
      const targetID = oTarget['dataset'].id;
      if (targetID === 'modal-close-btn') {
        if (oTarget.id === 'modal-confirm') {
          // 点击确定回调
          options.confirmCallback && options.confirmCallback();
        }

        if (oTarget.id === 'modal-close') {
          // 点击关闭回调
          options.closeCallback && options.closeCallback();
        }

        if (options.isShowAnimate) {
          // 如果是动画打开
          oModal.classList.remove('show-animate');
          oModal.addEventListener(
            'webkitTransitionEnd',
            function () {
              if (oBody.contains(oModal)) {
                oBody.removeChild(oModal);
              }
              document.removeEventListener('click', removeModal, false);
            },
            false
          );
        } else {
          // 不是动画打开
          oBody.removeChild(oModal);
          document.removeEventListener('click', removeModal, false);
        }

        // 恢复位置
        oBody.style.overflow = '';
        oBody.style.position = null;
        oBody.style.top = null;
        window.scrollTo(0, curPos);

      }
    };

    if (options.isShowAnimate) {
      setTimeout(function () {
        oModal.classList.add('show-animate');
      }, 50);
    }

    const scrollTop = window.pageYOffset
      || document.documentElement.scrollTop
      || oBody.scrollTop
      || 0;
    curPos = scrollTop;//保存当前滚动条位置
    oBody.style.top = -1 * scrollTop + "px";
    oBody.style.position = 'fixed';

    document.addEventListener('click', removeModal, false);
  }
};

export { modal };
