import './modal.scss';

const modal = {
    show: function (options: ShowModal) {

        if (document.getElementById('modal')) {
            return;
        }

        document.body.insertAdjacentHTML(
            'beforeend',
            `<div class="modal act-normal show ${options.modalClass || ''}" id="modal">
                <div class="modal-wrap animated ${options.modalWrapClass || ''}">
                    <div class="modal-content ${options.contentWrapClass || ''}" id="modal-content">
                        <div class="modal-text-wrap modal-normal ${options.textWrapClass || ''}" id="modal-text-wrap">
                            <div class="modal-text">
                                <p class="text"></p>
                            </div>
                        </div>
                        <div class="modal-btn-wrap" id="modal-btn-wrap">
                            <div data-id="modal-close-btn" id="modal-confirm" class="modal-btn">${options.confirmText || '知道了'}</div>
                        </div>
                    </div>
                    <div data-id="modal-close-btn" id="modal-close" class="modal-close"></div>
                </div>
            </div>
            `
        );

        const oModal = document.getElementById('modal');
        const oModalContentWrap = document.getElementById('modal-text-wrap');
        const oModalBtnWrap = document.getElementById('modal-btn-wrap');
        const aModalCloseBtn = document.querySelectorAll('[data-id=modal-close-btn]');

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

                document.body.removeChild(oModal);
                document.removeEventListener('touchend', removeModal, false);
            }
        }

        // 判断字符串里有没有标签
        if (/<[^>]+>/g.test(options.content)) {
            oModalContentWrap.innerHTML = options.content;
        } else {
            oModalContentWrap.innerHTML = `
            <div class="modal-text" id="">
                <p class="text">${options.content}</p>
            </div>
            `;
        }
        // if (options.confirmHtml) {
        //     // 如果按钮区域是自定义内容的
        // }
        document.addEventListener('touchend', removeModal, false);
    }
};

export { modal };